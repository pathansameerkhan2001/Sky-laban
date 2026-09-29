import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

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
            } catch {}
            pendingCookies.push({ name, value, options });
          });
        },
      },
    });

    // Check if recovery user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Password reset session is invalid or has expired. Please request a new reset link." },
        { status: 401 }
      );
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      console.warn("[Reset Password Error]:", updateError.message);
      return NextResponse.json(
        { error: updateError.message || "Failed to update password." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Password updated successfully. You can now log in with your new password.",
    });

    for (const c of pendingCookies) {
      response.cookies.set(c.name, c.value, c.options);
    }

    return response;
  } catch (err: any) {
    console.error("[Reset Password API Error]:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating your password." },
      { status: 500 }
    );
  }
}
