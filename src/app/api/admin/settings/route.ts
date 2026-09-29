import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbSettings, saveDbSettings } from "@/lib/db";

export async function GET() {
  const settings = getDbSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const updated = saveDbSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
