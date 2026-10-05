import { createServerClient, combineChunks, stringFromBase64URL } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
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
          // The `setAll` method was called from a Server Component.
          // This can be ignored if middleware is refreshing user sessions.
        }
      },
    },
  });
}

/**
 * Retrieves the current authenticated user and their active session access token
 * from Supabase SSR cookies for authenticated database & storage operations.
 */
export async function getAuthenticatedUserAndToken() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, accessToken: null, supabase };
  }

  // Extract session access token from Supabase SSR chunked cookie
  const storageKey = `sb-${new URL(SUPABASE_URL).hostname.split(".")[0]}-auth-token`;
  let accessToken: string | null = null;

  try {
    const combined = await combineChunks(storageKey, async (name) => {
      return cookieStore.get(name)?.value || null;
    });

    if (combined) {
      let val = combined;
      if (val.startsWith("base64-")) {
        val = stringFromBase64URL(val.slice(7));
      }
      const parsed = JSON.parse(val);
      accessToken = parsed.access_token || null;
    }
  } catch {
    // If chunk parsing fails, attempt getSession
  }

  if (!accessToken) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      accessToken = session?.access_token || null;
    } catch {}
  }

  return { user, accessToken, supabase };
}
