import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { getAuthenticatedUserAndToken } from "@/lib/supabase/server";
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_MEDIA_BUCKET,
} from "@/lib/supabase/config";

const ALLOWED_ADMIN_ROLES = ["admin", "super admin", "super_admin", "editor", "administrator"];
const KNOWN_ADMIN_EMAILS = ["brandnix.in@gmail.com"];

const ALLOWED_FOLDERS = ["hero", "products", "reels", "outlets", "branding", "founders"] as const;
type StorageFolder = typeof ALLOWED_FOLDERS[number];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate with Supabase Auth using SSR session/cookies
    const { user, accessToken, supabase } = await getAuthenticatedUserAndToken();

    // Safe server-side debugging (NO tokens, passwords, or secrets logged)
    console.log("[Upload Auth Debug] Authenticated user exists:", Boolean(user));
    console.log("[Upload Auth Debug] Authenticated user ID:", user?.id || "none");
    console.log("[Upload Auth Debug] Authenticated user email:", user?.email || "none");
    console.log("[Upload Auth Debug] Active access token present:", Boolean(accessToken));

    if (!user) {
      console.warn("[Upload Auth] Rejecting unauthenticated upload request (401)");
      return NextResponse.json(
        { error: "Please sign in to an authorized administrator account before uploading." },
        { status: 401 }
      );
    }

    // 2. Create authenticated Supabase client carrying the user's JWT
    // This guarantees PostgreSQL RLS evaluates auth.uid() = user.id for database & storage checks
    const authClient = accessToken
      ? createSupabaseJsClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        })
      : supabase;

    // 3. Query public.admin_users table dynamically using user.id
    let isAuthorized = false;
    let adminRecord: { user_id?: string; role?: string; display_name?: string } | null = null;

    try {
      const { data: record, error: adminQueryErr } = await authClient
        .from("admin_users")
        .select("id, user_id, display_name, role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (record && ALLOWED_ADMIN_ROLES.includes(String(record.role).trim().toLowerCase())) {
        isAuthorized = true;
        adminRecord = record;
      }
      if (adminQueryErr) {
        console.warn("[Upload Auth Check] admin_users query notice:", adminQueryErr.message);
      }
    } catch (err) {
      console.warn("[Upload Auth Check] admin_users lookup error:", err);
    }

    // 4. Verify admin email against authorized allowlist & ensure database record is synced
    const envEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
      .toLowerCase()
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const allAllowedEmails = [...KNOWN_ADMIN_EMAILS, ...envEmails];
    const appRole = String(user.app_metadata?.role || user.user_metadata?.role || "").trim().toLowerCase();

    const isEmailAllowed = Boolean(user.email && allAllowedEmails.includes(user.email.toLowerCase().trim()));
    const hasAdminAppRole = ALLOWED_ADMIN_ROLES.includes(appRole);

    if (isEmailAllowed || hasAdminAppRole) {
      if (!isAuthorized) {
        // Sync the authenticated user into public.admin_users so Storage RLS helper is_admin() succeeds
        try {
          const { data: upsertData, error: upsertErr } = await authClient
            .from("admin_users")
            .upsert(
              {
                user_id: user.id,
                display_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin",
                role: "Admin",
              },
              { onConflict: "user_id" }
            )
            .select()
            .maybeSingle();

          if (!upsertErr) {
            isAuthorized = true;
            adminRecord = upsertData || { user_id: user.id, role: "Admin" };
            console.log("[Upload Auth Sync] Admin verified and synced in public.admin_users:", user.id);
          } else {
            console.warn("[Upload Auth Sync] admin_users upsert warning:", upsertErr.message);
            // Allow verified admin email to proceed even if table upsert had a constraint notice
            isAuthorized = true;
          }
        } catch (e) {
          console.warn("[Upload Auth Sync] admin_users sync error:", e);
          isAuthorized = true;
        }
      }
    }

    console.log(
      "[Upload Auth Debug] admin_users lookup result:",
      adminRecord ? { userId: adminRecord.user_id, role: adminRecord.role } : "not registered"
    );
    console.log("[Upload Auth Debug] Admin role authorization result:", isAuthorized);

    // If authenticated user is not an admin, return 403 Forbidden
    if (!isAuthorized) {
      console.warn(`[Upload Auth] User ${user.email} (${user.id}) is authenticated but not an admin (403)`);
      return NextResponse.json(
        { error: "Your account is not authorized as a Sky Laban admin." },
        { status: 403 }
      );
    }

    // 5. Validate multipart/form-data request and uploaded file
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "No file was provided for upload." },
        { status: 400 }
      );
    }

    // 6. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image format (${file.type}). Allowed formats: JPEG, PNG, WebP, AVIF.` },
        { status: 400 }
      );
    }

    // 7. Validate file size (10 MB limit)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the 10 MB limit." },
        { status: 413 }
      );
    }

    // 8. Determine target folder: hero, products, reels, outlets, branding, founders
    let folder: StorageFolder = "hero";
    const rawFolder = String(formData.get("folder") || "hero")
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");

    if (ALLOWED_FOLDERS.includes(rawFolder as StorageFolder)) {
      folder = rawFolder as StorageFolder;
    }

    // 9. Generate safe unique filename without leading slashes
    // Example: hero/salankatia-feast-1741234567890-a1b2c3.jpg
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const rawName = file.name.replace(/\.[^/.]+$/, "").toLowerCase();
    const sanitizedBase =
      rawName
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || folder;
    const uniqueId = `${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    const cleanFileName = `${sanitizedBase}-${uniqueId}.${ext}`;
    const storagePath = `${folder}/${cleanFileName}`;

    // 10. Upload to Supabase Storage bucket 'sky-laban-media'
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await authClient.storage
      .from(SUPABASE_MEDIA_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error(
        `[Supabase Storage Error] Upload to ${SUPABASE_MEDIA_BUCKET}/${storagePath} failed:`,
        uploadError
      );
      // Return 500 for actual Storage or infrastructure failures (never convert to 403)
      return NextResponse.json(
        { error: `Unable to upload image to Sky Laban Media Storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 11. Generate public media URL
    const { data: publicData } = authClient.storage
      .from(SUPABASE_MEDIA_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = publicData.publicUrl;

    console.log(`[Upload Success] Uploaded: ${storagePath} -> ${publicUrl}`);

    // 12. Return clean JSON response
    return NextResponse.json({
      success: true,
      storagePath,
      publicUrl,
      url: publicUrl,
      path: storagePath,
    });
  } catch (err: any) {
    console.error("[Upload API Unexpected Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}
