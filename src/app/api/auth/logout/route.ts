import { NextResponse } from "next/server";
import { clearAdminSessionCookie, getAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    const { getSupabaseClient, isSupabaseConfigured } = await import("@/lib/supabase");
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn("Supabase signOut error:", err);
  }

  await clearAdminSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}
