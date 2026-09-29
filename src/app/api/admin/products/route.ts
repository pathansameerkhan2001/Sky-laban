import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbProducts, saveDbProduct, deleteDbProduct } from "@/lib/db";
import { ProductItem } from "@/data/brandData";

export async function GET() {
  const products = getDbProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: ProductItem = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Product name and category are required" },
        { status: 400 }
      );
    }

    const saved = saveDbProduct(body);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: ProductItem = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const updated = saveDbProduct(body);
    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const deleted = deleteDbProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
