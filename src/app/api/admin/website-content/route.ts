import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbContent, saveDbContent, WebsiteContent } from "@/lib/db";

export async function GET() {
  const content = getDbContent();
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: Partial<WebsiteContent> = await req.json();
    const saved = saveDbContent(body);
    return NextResponse.json({ success: true, content: saved });
  } catch {
    return NextResponse.json({ error: "Failed to update website content" }, { status: 500 });
  }
}
