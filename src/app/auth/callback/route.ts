import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, getAppUrl } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/admin";
  const origin = requestUrl.origin;

  // Protect against open redirect attacks
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

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
      const redirectUrl = `${origin}${safeNext}`;
      const response = NextResponse.redirect(redirectUrl);
      for (const c of pendingCookies) {
        response.cookies.set(c.name, c.value, c.options);
      }
      return response;
    }

    console.warn("[Auth Callback] exchangeCodeForSession notice:", error.message);
  }

  // Fallback for flows where token is in client-side hash fragment (#access_token=...)
  // Since hash fragments are never sent over HTTP to the server, return a client-side handoff
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating...</title>
</head>
<body style="font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #EAF6FF;">
  <div style="text-align: center;">
    <p style="color: #0754C9; font-weight: 600; font-size: 14px;">Verifying session...</p>
    <script>
      (function() {
        if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery'))) {
          window.location.href = '${safeNext}' + window.location.hash;
        } else {
          window.location.href = '/admin/login?error=auth-code-error';
        }
      })();
    </script>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
