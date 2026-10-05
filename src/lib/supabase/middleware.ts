import { createServerClient } from "@supabase/ssr";
import { type SupabaseClient, type User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config";

const ALLOWED_ADMIN_ROLES = ["admin", "super admin", "super_admin", "editor"];

/**
 * Check if the user is an authorized administrator
 */
async function isAuthorizedAdmin(supabase: SupabaseClient, user: User | null): Promise<boolean> {
  if (!user) return false;

  // 1. Query public.admin_users table in Supabase by authenticated user's UUID (user_id)
  try {
    const { data: byUserId } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (byUserId && ALLOWED_ADMIN_ROLES.includes(String(byUserId.role).trim().toLowerCase())) {
      return true;
    }

    const { data: byId } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (byId && ALLOWED_ADMIN_ROLES.includes(String(byId.role).trim().toLowerCase())) {
      return true;
    }
  } catch (err) {
    console.warn("admin_users table check notice in middleware:", err);
  }

  // 2. Check user metadata / app_metadata
  const appRole = String(user.app_metadata?.role || user.user_metadata?.role || "").toLowerCase();
  if (ALLOWED_ADMIN_ROLES.includes(appRole)) {
    return true;
  }

  // 3. Check approved admin allowlist from environment variable or verified admins
  const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const allAllowedEmails = ["brandnix.in@gmail.com", ...allowedEmails];

  if (user.email && allAllowedEmails.includes(user.email.toLowerCase().trim())) {
    return true;
  }

  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid using getSession() in server context as it doesn't validate token authenticity.
  // Instead use getUser() which contacts Supabase Auth server and validates the JWT.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";
  const isAdminRoute = pathname.startsWith("/admin");
  const hasAdminSession = Boolean(request.cookies.get("skylaban_admin_session")?.value);

  // Protect all /admin routes except public auth pages
  if (isAdminRoute && !isAuthPage) {
    if (!user && !hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (user) {
      const authorized = await isAuthorizedAdmin(supabase, user);
      if (!authorized && !hasAdminSession) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }
    }
  }

  // If user is already an authenticated and authorized admin visiting /admin/login or /admin/forgot-password, redirect to /admin
  const isLoginOrForgot = pathname === "/admin/login" || pathname === "/admin/forgot-password";
  if (isLoginOrForgot && (user || hasAdminSession)) {
    if (user) {
      const authorized = await isAuthorizedAdmin(supabase, user);
      if (authorized || hasAdminSession) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    } else if (hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
