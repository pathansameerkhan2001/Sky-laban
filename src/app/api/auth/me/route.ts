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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Find admin details
      let displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
      let role = user.app_metadata?.role || "admin";

      try {
        const { data: byUserId } = await supabase
          .from("admin_users")
          .select("display_name, role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (byUserId) {
          displayName = byUserId.display_name || displayName;
          role = byUserId.role || role;
        } else {
          const { data: byId } = await supabase
            .from("admin_users")
            .select("display_name, role")
            .eq("id", user.id)
            .maybeSingle();
          if (byId) {
            displayName = byId.display_name || displayName;
            role = byId.role || role;
          } else if (user.email) {
            const { data: byEmail } = await supabase
              .from("admin_users")
              .select("display_name, role")
              .eq("email", user.email.toLowerCase().trim())
              .maybeSingle();
            if (byEmail) {
              displayName = byEmail.display_name || displayName;
              role = byEmail.role || role;
            }
          }
        }
      } catch {
        // Fallback
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
