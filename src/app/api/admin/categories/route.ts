import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbCategories, saveDbCategory, deleteDbCategory, CategoryItem } from "@/lib/db";
import { syncCategoryToSupabaseTable, deleteCategoryFromSupabaseTable } from "@/lib/supabase";

export async function GET() {
  const categories = getDbCategories();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: CategoryItem = await req.json();
    if (!body.name) return NextResponse.json({ error: "Category name required" }, { status: 400 });
    const saved = saveDbCategory(body);
    // Background sync to Supabase
    syncCategoryToSupabaseTable(saved).catch((err) =>
      console.warn("Supabase category sync warning:", err)
    );
    return NextResponse.json({ success: true, category: saved });
  } catch {
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: CategoryItem = await req.json();
    if (!body.id) return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    const updated = saveDbCategory(body);
    // Background sync to Supabase
    syncCategoryToSupabaseTable(updated).catch((err) =>
      console.warn("Supabase category sync warning:", err)
    );
    return NextResponse.json({ success: true, category: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    deleteDbCategory(id);
    deleteCategoryFromSupabaseTable(id).catch((err) =>
      console.warn("Supabase category delete warning:", err)
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

