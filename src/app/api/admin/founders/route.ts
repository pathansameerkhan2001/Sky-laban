import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbFounders, saveDbFounder, deleteDbFounder, FounderItem } from "@/lib/db";

export async function GET() {
  const founders = getDbFounders();
  return NextResponse.json(founders);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: FounderItem = await req.json();
    if (!body.name || !body.title) {
      return NextResponse.json({ error: "Name and Title required" }, { status: 400 });
    }
    const saved = saveDbFounder(body);
    return NextResponse.json({ success: true, founder: saved });
  } catch {
    return NextResponse.json({ error: "Failed to save founder" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: FounderItem = await req.json();
    if (!body.id) return NextResponse.json({ error: "Founder ID required" }, { status: 400 });
    const updated = saveDbFounder(body);
    return NextResponse.json({ success: true, founder: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update founder" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Founder ID required" }, { status: 400 });
    deleteDbFounder(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete founder" }, { status: 500 });
  }
}
