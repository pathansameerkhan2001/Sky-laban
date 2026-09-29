import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbReels, saveDbReel, deleteDbReel, ReelItem } from "@/lib/db";
import { syncReelToSupabaseTable, deleteReelFromSupabaseTable } from "@/lib/supabase";

export async function GET() {
  const reels = getDbReels();
  return NextResponse.json(reels);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: ReelItem = await req.json();
    if (!body.url || !body.image) {
      return NextResponse.json({ error: "URL and Image required" }, { status: 400 });
    }
    const saved = saveDbReel(body);
    // Background sync to Supabase table if configured
    syncReelToSupabaseTable(saved).catch((err) =>
      console.warn("Supabase background sync notice:", err)
    );

    return NextResponse.json({ success: true, reel: saved });
  } catch {
    return NextResponse.json({ error: "Failed to save reel" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: ReelItem = await req.json();
    if (!body.id) return NextResponse.json({ error: "Reel ID required" }, { status: 400 });
    const updated = saveDbReel(body);
    // Background sync to Supabase table if configured
    syncReelToSupabaseTable(updated).catch((err) =>
      console.warn("Supabase background sync notice:", err)
    );

    return NextResponse.json({ success: true, reel: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update reel" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Reel ID required" }, { status: 400 });
    deleteDbReel(id);
    // Background sync to Supabase table if configured
    deleteReelFromSupabaseTable(id).catch((err) =>
      console.warn("Supabase delete notice:", err)
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete reel" }, { status: 500 });
  }
}

