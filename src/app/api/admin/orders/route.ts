import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbOrders, saveDbOrder, updateDbOrderStatus, OrderItem } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = getDbOrders();
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: OrderItem = await req.json();
    const saved = saveDbOrder(body);
    return NextResponse.json({ success: true, order: saved });
  } catch {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }
    const updated = updateDbOrderStatus(id, status);
    return NextResponse.json({ success: true, order: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
