import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createChunks, stringToBase64URL } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createToken, setAdminSessionCookie } from "@/lib/auth";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";

const ALLOWED_ADMIN_ROLES = ["admin", "super admin", "super_admin", "editor", "administrator"];
const KNOWN_ADMIN_EMAILS = ["brandnix.in@gmail.com"];

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

    const cleanEmail = String(email).trim().toLowerCase();
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
      password: String(password),
    });

    if (authError || !authData.user) {
      const errMsg = authError?.message || "Invalid email or password.";
      console.warn(`[Supabase Auth] Login failed for ${cleanEmail}:`, errMsg);

      let userFriendlyMessage = "Invalid login credentials. Please check your email and password, or use 'Forgot password?' to set or reset it.";
      if (errMsg.toLowerCase().includes("invalid login credentials")) {
        userFriendlyMessage =
          "Invalid login credentials. Please verify your email and password. If your account was newly invited or created without a password, click 'Forgot password?' below to set your password.";
      } else if (errMsg.toLowerCase().includes("email not confirmed")) {
        userFriendlyMessage =
          "Your email address has not been confirmed yet. Please verify your email inbox or confirm the user in the Supabase Dashboard.";
      }

      return NextResponse.json(
        { error: userFriendlyMessage },
        { status: 401 }
      );
    }

    const user = authData.user;

    // 2. Strict Admin Authorization Check using public.admin_users
    let isAuthorized = false;
    let role = "Admin";
    let displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";

    // Use authenticated client with the user's JWT to ensure PostgreSQL RLS allows querying and writing
    const authHeaders: Record<string, string> = {};
    if (authData.session?.access_token) {
      authHeaders.Authorization = `Bearer ${authData.session.access_token}`;
    }
    const authQueryClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        headers: authHeaders,
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // A. Query database public.admin_users table by authenticated user's actual UUID (user.id)
    try {
      const { data: byUserId, error: queryErr } = await authQueryClient
        .from("admin_users")
        .select("id, user_id, display_name, role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (byUserId && ALLOWED_ADMIN_ROLES.includes(String(byUserId.role).trim().toLowerCase())) {
        isAuthorized = true;
        role = byUserId.role || role;
        displayName = byUserId.display_name || displayName;
      }
      if (queryErr) {
        console.warn("[Auth] admin_users query warning:", queryErr.message);
      }
    } catch (err) {
      console.warn("[Auth] admin_users query notice:", err);
    }

    // B. Check user metadata / app_metadata
    if (!isAuthorized) {
      const appRole = String(user.app_metadata?.role || user.user_metadata?.role || "").trim().toLowerCase();
      if (ALLOWED_ADMIN_ROLES.includes(appRole)) {
        isAuthorized = true;
        role = user.app_metadata?.role || user.user_metadata?.role || "Admin";
      }

      // C. Check approved admin email allowlist
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

    // If account authenticated in Supabase but lacks admin authorization, reject
    if (!isAuthorized) {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error:
            "Access restricted: User account is authenticated in Supabase, but is not registered with administrator privileges.",
        },
        { status: 403 }
      );
    }

    // Ensure the authorized admin user is persisted in public.admin_users for Storage RLS checks
    try {
      const { error: upsertErr } = await authQueryClient.from("admin_users").upsert(
        {
          user_id: user.id,
          display_name: displayName,
          role: "Admin",
        },
        { onConflict: "user_id" }
      );
      if (upsertErr) {
        console.warn("[Auth] admin_users upsert error:", upsertErr.message);
      } else {
        console.log("[Auth] Successfully verified/synced admin into public.admin_users:", user.id);
      }
    } catch (e) {
      console.warn("[Auth] admin_users upsert notice:", e);
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

    // 1. Explicitly serialize Supabase Auth session into standard SSR cookies
    if (authData.session) {
      const storageKey = `sb-${new URL(SUPABASE_URL).hostname.split(".")[0]}-auth-token`;
      const encoded = "base64-" + stringToBase64URL(JSON.stringify(authData.session));
      const chunks = createChunks(storageKey, encoded);

      for (const chunk of chunks) {
        response.cookies.set(chunk.name, chunk.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        try {
          cookieStore.set(chunk.name, chunk.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        } catch {}
      }
    }

    // 2. Attach any pending cookies from createServerClient
    for (const c of pendingCookies) {
      response.cookies.set(c.name, c.value, c.options);
    }

    // 3. Set signed admin session cookie directly on response
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
