import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { createServerClient } from "@supabase/ssr";
import { getAdminSession } from "@/lib/auth";
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_MEDIA_BUCKET,
} from "@/lib/supabase/config";

const ALLOWED_ADMIN_ROLES = ["admin", "super admin", "super_admin", "editor", "administrator"];
const KNOWN_ADMIN_EMAILS = ["brandnix.in@gmail.com"];
const KNOWN_ADMIN_UUIDS = [
  "4300f42c-c168-4ce-9254-5fad4c4539a5",
  "53177535-cbd5-4f02-b7c5-ce9cabc4c6f6",
];

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
    const cookieStore = await cookies();

    // 1. Verify current Supabase authenticated session
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const fallbackSession = await getAdminSession();

    if (!user && !fallbackSession) {
      return NextResponse.json(
        { error: "Please sign in as an administrator before uploading." },
        { status: 401 }
      );
    }

    // 2 & 3. Verify user's ID exists in public.admin_users and role = admin
    let isAuthorized = false;

    if (user) {
      try {
        const { data: byUserId } = await supabase
          .from("admin_users")
          .select("id, user_id, display_name, role")
          .or(`user_id.eq.${user.id},id.eq.${user.id}`)
          .maybeSingle();

        if (byUserId && ALLOWED_ADMIN_ROLES.includes(String(byUserId.role).trim().toLowerCase())) {
          isAuthorized = true;
        }
      } catch (err) {
        console.warn("[Upload Auth Check] admin_users query notice:", err);
      }

      // Check allowlist fallback and sync to admin_users table so storage RLS succeeds
      if (!isAuthorized) {
        const envEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
          .toLowerCase()
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const allAllowedEmails = [...KNOWN_ADMIN_EMAILS, ...envEmails];
        const appRole = String(user.app_metadata?.role || user.user_metadata?.role || "").trim().toLowerCase();

        if (
          ALLOWED_ADMIN_ROLES.includes(appRole) ||
          (user.email && allAllowedEmails.includes(user.email.toLowerCase().trim())) ||
          KNOWN_ADMIN_UUIDS.includes(user.id)
        ) {
          isAuthorized = true;
          try {
            await supabase.from("admin_users").upsert(
              {
                user_id: user.id,
                email: user.email,
                display_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin",
                role: "admin",
              },
              { onConflict: "user_id" }
            );
          } catch (upsertErr) {
            console.warn("[Upload Auth Sync] Notice on admin_users upsert:", upsertErr);
          }
        }
      }
    } else if (fallbackSession) {
      if (ALLOWED_ADMIN_ROLES.includes(String(fallbackSession.role).trim().toLowerCase())) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Your admin account does not have permission to upload media." },
        { status: 403 }
      );
    }

    // 4. Validate uploaded file
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // 5. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image format. Allowed formats: JPEG, PNG, WebP, AVIF." },
        { status: 400 }
      );
    }

    // 6. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image exceeds the 10 MB limit." },
        { status: 400 }
      );
    }

    // Determine target folder: hero, products, reels, outlets, branding, founders
    let folder: StorageFolder = "hero";
    const rawFolder = String(formData.get("folder") || "hero")
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");

    if (ALLOWED_FOLDERS.includes(rawFolder as StorageFolder)) {
      folder = rawFolder as StorageFolder;
    }

    // 7. Generate safe unique filename without leading slash
    // Example: hero/salankatia-hero-spoon-abc123.jpg
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

    // 8. Upload to bucket: sky-laban-media
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_MEDIA_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error(
        `[Supabase Storage Error] Failed to upload to ${SUPABASE_MEDIA_BUCKET}/${storagePath}:`,
        uploadError
      );
      const isPolicyError =
        uploadError.message.toLowerCase().includes("security") ||
        uploadError.message.toLowerCase().includes("policy") ||
        uploadError.message.toLowerCase().includes("permission");

      return NextResponse.json(
        {
          error: isPolicyError
            ? "Your admin account does not have permission to upload to Sky Laban Media Storage."
            : `Unable to upload image to Sky Laban Media Storage: ${uploadError.message}`,
        },
        { status: isPolicyError ? 403 : 400 }
      );
    }

    // 9. Get public URL
    const { data: publicData } = supabase.storage
      .from(SUPABASE_MEDIA_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = publicData.publicUrl;

    // 10. Return clean JSON response
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
