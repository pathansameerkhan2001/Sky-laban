import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbUsers, saveDbUser, deleteDbUser } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = getDbUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.email || !body.name) {
      return NextResponse.json({ error: "Email and name required" }, { status: 400 });
    }
    const saved = saveDbUser(body);
    const { passwordHash, ...safeUser } = saved;
    return NextResponse.json({ success: true, user: safeUser });
  } catch {
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const deleted = deleteDbUser(id);
    if (!deleted) {
      return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
