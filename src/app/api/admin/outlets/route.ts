import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbOutlets, saveDbOutlet, deleteDbOutlet, OutletItem } from "@/lib/db";

export async function GET() {
  const outlets = getDbOutlets();
  return NextResponse.json(outlets);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: OutletItem = await req.json();
    if (!body.city || !body.name) {
      return NextResponse.json({ error: "Name and city required" }, { status: 400 });
    }
    const saved = saveDbOutlet(body);
    return NextResponse.json({ success: true, outlet: saved });
  } catch {
    return NextResponse.json({ error: "Failed to save outlet" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: OutletItem = await req.json();
    if (!body.id) return NextResponse.json({ error: "Outlet ID required" }, { status: 400 });
    const updated = saveDbOutlet(body);
    return NextResponse.json({ success: true, outlet: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update outlet" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Outlet ID required" }, { status: 400 });
    deleteDbOutlet(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete outlet" }, { status: 500 });
  }
}
