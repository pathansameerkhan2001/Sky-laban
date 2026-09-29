import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const stats = getDashboardStats();
  return NextResponse.json(stats);
}
