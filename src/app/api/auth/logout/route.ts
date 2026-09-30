import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { clearAdminSessionCookie } from "@/lib/auth";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";

export async function POST() {
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

    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase signOut notice:", err);
  }

  await clearAdminSessionCookie();
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete("skylaban_admin_session");
  return response;
}
