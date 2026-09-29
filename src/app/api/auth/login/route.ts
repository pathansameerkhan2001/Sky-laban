import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/db";
import { setAdminSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Try Supabase Auth if configured
    let authenticatedUser: { id: string; email: string; name: string; role: string } | null = null;

    try {
      const { getSupabaseClient, isSupabaseConfigured } = await import("@/lib/supabase");
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!authError && authData.user) {
          // Check admin_users table for authorization
          const { data: adminRecord } = await supabase
            .from("admin_users")
            .select("display_name, role")
            .eq("user_id", authData.user.id)
            .maybeSingle();

          if (adminRecord) {
            authenticatedUser = {
              id: authData.user.id,
              email: authData.user.email || email,
              name: adminRecord.display_name || "Admin",
              role: adminRecord.role || "super_admin",
            };
          } else {
            // Also check by email in admin_users if user_id not yet matched
            const { data: adminByEmail } = await supabase
              .from("admin_users")
              .select("display_name, role")
              .eq("email", email.toLowerCase())
              .maybeSingle();

            if (adminByEmail) {
              authenticatedUser = {
                id: authData.user.id,
                email: authData.user.email || email,
                name: adminByEmail.display_name || "Admin",
                role: adminByEmail.role || "super_admin",
              };
            }
          }
        }
      }
    } catch (supabaseErr) {
      console.warn("Supabase auth check:", supabaseErr);
    }

    // 2. Fallback to authorized admin database credentials
    if (!authenticatedUser) {
      const localUser = verifyAdminCredentials(email, password);
      if (localUser) {
        authenticatedUser = {
          id: localUser.id,
          email: localUser.email,
          name: localUser.name,
          role: localUser.role,
        };
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: "Invalid email or password or unauthorized admin account." },
        { status: 401 }
      );
    }

    await setAdminSessionCookie({
      userId: authenticatedUser.id,
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: authenticatedUser,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
