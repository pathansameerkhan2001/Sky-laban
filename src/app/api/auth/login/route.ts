import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createToken, setAdminSessionCookie } from "@/lib/auth";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";

const ALLOWED_ADMIN_ROLES = ["admin", "super admin", "super_admin", "editor", "administrator"];
const KNOWN_ADMIN_EMAILS = ["adnix.in@gmail.com"];
const KNOWN_ADMIN_UUIDS = ["53177535-cbd5-4f02-b7c5-ce9cabc4c6f6"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cookieStore = await cookies();
    const pendingCookies: Array<{ name: string; value: string; options: any }> = [];

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Ignore if in restricted context
            }
            pendingCookies.push({ name, value, options });
          });
        },
      },
    });

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError || !authData.user) {
      const errMsg = authError?.message || "Invalid email or password.";
      console.warn(`[Supabase Auth] Login failed for ${cleanEmail}:`, errMsg);

      let userFriendlyMessage = "Invalid login credentials. Please check your email and password, or use Forgot Password to reset.";
      if (errMsg.toLowerCase().includes("invalid login credentials")) {
        userFriendlyMessage =
          "Invalid login credentials. Please verify your email and password. If you forgot your password, click 'Forgot password?' below to reset it.";
      } else if (errMsg.toLowerCase().includes("email not confirmed")) {
        userFriendlyMessage =
          "Your email address has not been confirmed yet. Please check your inbox or confirm it in the Supabase Dashboard.";
      }

      return NextResponse.json(
        { error: userFriendlyMessage },
        { status: 401 }
      );
    }

    const user = authData.user;

    // 2. Strict Admin Authorization Check using public.admin_users
    let isAuthorized = false;
    let role = "admin";
    let displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";

    // A. Query database public.admin_users table by user.id (UUID), id, and email
    try {
      const { data: byUserId } = await supabase
        .from("admin_users")
        .select("id, user_id, email, display_name, role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (byUserId && ALLOWED_ADMIN_ROLES.includes(String(byUserId.role).trim().toLowerCase())) {
        isAuthorized = true;
        role = byUserId.role || role;
        displayName = byUserId.display_name || displayName;
      } else {
        const { data: byId } = await supabase
          .from("admin_users")
          .select("id, user_id, email, display_name, role")
          .eq("id", user.id)
          .maybeSingle();

        if (byId && ALLOWED_ADMIN_ROLES.includes(String(byId.role).trim().toLowerCase())) {
          isAuthorized = true;
          role = byId.role || role;
          displayName = byId.display_name || displayName;
        } else if (user.email) {
          const { data: byEmail } = await supabase
            .from("admin_users")
            .select("id, user_id, email, display_name, role")
            .eq("email", user.email.toLowerCase().trim())
            .maybeSingle();

          if (byEmail && ALLOWED_ADMIN_ROLES.includes(String(byEmail.role).trim().toLowerCase())) {
            isAuthorized = true;
            role = byEmail.role || role;
            displayName = byEmail.display_name || displayName;
          }
        }
      }
    } catch (err) {
      console.warn("[Auth] admin_users query notice:", err);
    }

    // B. Check user metadata / app_metadata
    if (!isAuthorized) {
      const appRole = String(user.app_metadata?.role || user.user_metadata?.role || "").trim().toLowerCase();
      if (ALLOWED_ADMIN_ROLES.includes(appRole)) {
        isAuthorized = true;
        role = user.app_metadata?.role || user.user_metadata?.role || "admin";
      }

      // C. Check known admin email or UUID allowlist
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
        role = "super_admin";
      }
    }

    // If account authenticated in Supabase but lacks admin authorization, reject
    if (!isAuthorized) {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error:
            "Access restricted: User account is authenticated in Supabase, but your UUID is not registered with an administrator role in public.admin_users.",
        },
        { status: 403 }
      );
    }

    // Construct JSON response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: displayName,
        role,
      },
    });

    // Attach pending Supabase SSR cookies directly to response headers
    for (const c of pendingCookies) {
      response.cookies.set(c.name, c.value, c.options);
    }

    // Set signed admin session cookie directly on response
    const sessionToken = createToken({
      userId: user.id,
      email: user.email || email,
      name: displayName,
      role,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("skylaban_admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Also update server cookie store
    await setAdminSessionCookie({
      userId: user.id,
      email: user.email || email,
      name: displayName,
      role,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
