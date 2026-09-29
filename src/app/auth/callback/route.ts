import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, getAppUrl } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
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
              // Ignore in route handler context
            }
            pendingCookies.push({ name, value, options });
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectUrl = getAppUrl(next);
      const response = NextResponse.redirect(redirectUrl);
      for (const c of pendingCookies) {
        response.cookies.set(c.name, c.value, c.options);
      }
      return response;
    }
  }

  return NextResponse.redirect(getAppUrl("/admin/login?error=auth-code-error"));
}
