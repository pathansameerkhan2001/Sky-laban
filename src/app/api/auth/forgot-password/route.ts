import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, getAppUrl } from "@/lib/supabase/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
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
          });
        },
      },
    });

    // Destination after user clicks email recovery link
    const redirectTo = getAppUrl("/auth/callback?next=/admin/reset-password");

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (error) {
      console.warn(`[Supabase Auth] resetPasswordForEmail notice for ${email.trim()}:`, error.message);
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Too many reset attempts. Please wait a few minutes before trying again." },
          { status: 429 }
        );
      }
    }

    // Generic safe response to protect against user enumeration
    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email address, a password reset link has been sent. Please check your email inbox and spam folder.",
    });
  } catch (err: any) {
    console.error("[Forgot Password API Error]:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}
