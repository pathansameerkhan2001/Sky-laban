import { NextResponse } from "next/server";
import { getAuthenticatedUserAndToken } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";

const ALLOWED_ADMIN_ROLES = ["admin", "super admin", "super_admin", "editor", "administrator"];
const KNOWN_ADMIN_EMAILS = ["brandnix.in@gmail.com"];

export async function GET() {
  try {
    const { user, supabase } = await getAuthenticatedUserAndToken();

    if (user) {
      let isAuthorized = false;
      let displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
      let role = "Admin";

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
        }
      } catch {
        // Fallback check
      }

      if (!isAuthorized) {
        const appRole = String(user.app_metadata?.role || user.user_metadata?.role || "").trim().toLowerCase();
        if (ALLOWED_ADMIN_ROLES.includes(appRole)) {
          isAuthorized = true;
          role = user.app_metadata?.role || user.user_metadata?.role || "Admin";
        }

        const envEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
          .toLowerCase()
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const allAllowedEmails = [...KNOWN_ADMIN_EMAILS, ...envEmails];

        if (user.email && allAllowedEmails.includes(user.email.toLowerCase().trim())) {
          isAuthorized = true;
          role = "Admin";
        }
      }

      if (!isAuthorized) {
        return NextResponse.json(
          { authenticated: false, error: "Access denied: Account is not an authorized administrator." },
          { status: 403 }
        );
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

    // Fallback to verified admin session token if present
    const session = await getAdminSession();
    if (session) {
      return NextResponse.json({ authenticated: true, user: session });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
