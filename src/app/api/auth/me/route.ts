import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";

export async function GET() {
  try {
    const cookieStore = await cookies();

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
          } catch {
            // Handled
          }
        },
      },
    });

const ALLOWED_ADMIN_ROLES = ["admin", "super admin", "super_admin", "editor", "administrator"];
const KNOWN_ADMIN_EMAILS = ["brandnix.in@gmail.com"];
const KNOWN_ADMIN_UUIDS = [
  "4300f42c-c168-4ce-9254-5fad4c4539a5",
  "53177535-cbd5-4f02-b7c5-ce9cabc4c6f6",
];

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let isAuthorized = false;
      let displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
      let role = "admin";

      try {
        const { data: byUserId } = await supabase
          .from("admin_users")
          .select("id, user_id, display_name, role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (byUserId && ALLOWED_ADMIN_ROLES.includes(String(byUserId.role).trim().toLowerCase())) {
          isAuthorized = true;
          displayName = byUserId.display_name || displayName;
          role = byUserId.role || role;
        } else {
          const { data: byId } = await supabase
            .from("admin_users")
            .select("id, user_id, display_name, role")
            .eq("id", user.id)
            .maybeSingle();
          if (byId && ALLOWED_ADMIN_ROLES.includes(String(byId.role).trim().toLowerCase())) {
            isAuthorized = true;
            displayName = byId.display_name || displayName;
            role = byId.role || role;
          }
        }
      } catch {
        // Fallback
      }

      if (!isAuthorized) {
        const appRole = String(user.app_metadata?.role || user.user_metadata?.role || "").trim().toLowerCase();
        if (ALLOWED_ADMIN_ROLES.includes(appRole)) {
          isAuthorized = true;
          role = appRole;
        }

        const envEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
          .toLowerCase()
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const allAllowedEmails = [...KNOWN_ADMIN_EMAILS, ...envEmails];

        if (
          (user.email && allAllowedEmails.includes(user.email.toLowerCase().trim())) ||
          KNOWN_ADMIN_UUIDS.includes(user.id)
        ) {
          isAuthorized = true;
          if (user.id === "4300f42c-c168-4ce-9254-5fad4c4539a5") {
            displayName = "Brandnix Admin";
          }
        }
      }

      if (!isAuthorized) {
        return NextResponse.json({ authenticated: false, error: "Access denied: Account is not an authorized administrator." }, { status: 403 });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: displayName,
          role,
        },
      });
    }

    // Fallback to verified admin session token
    const session = await getAdminSession();
    if (session) {
      return NextResponse.json({ authenticated: true, user: session });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
