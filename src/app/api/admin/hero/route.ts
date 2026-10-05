import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbHeroSlides, saveDbHeroSlide, deleteDbHeroSlide, HeroSlideItem } from "@/lib/db";
import {
  syncHeroSlideToSupabaseTable,
  deleteHeroSlideFromSupabaseTable,
  getSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { toStoragePath } from "@/lib/media";

export async function GET() {
  let slides = getDbHeroSlides();

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data: supaHero, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && Array.isArray(supaHero) && supaHero.length > 0) {
        slides = supaHero.map((s: any) => ({
          id: s.id,
          title: s.title || "Sky Laban",
          subtitle: s.subtitle || "",
          image: s.image_path,
          desktopImage: s.image_path,
          mobileImage: s.image_path,
          alt: s.alt_text || s.title || "Sky Laban Signature Desserts",
          order: s.sort_order || 1,
          isActive: s.is_active ?? true,
        }));
      }
    } catch (err) {
      console.warn("[Admin Hero GET] Using local fallback:", err);
    }
  }

  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: HeroSlideItem = await req.json();
    const rawImage = body.image || body.desktopImage || (body as any).image_path;
    if (!rawImage) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const cleanImage = toStoragePath(rawImage);
    body.image = cleanImage;
    body.desktopImage = cleanImage;
    (body as any).image_path = cleanImage;

    const saved = saveDbHeroSlide(body);

    // Sync to Supabase hero_slides table
    syncHeroSlideToSupabaseTable(saved).catch((err) =>
      console.warn("[Hero Supabase Sync Error]:", err)
    );

    return NextResponse.json({ success: true, slide: saved });
  } catch (err: any) {
    console.error("[Hero POST Error]:", err);
    return NextResponse.json({ error: "Failed to save slide" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: HeroSlideItem = await req.json();
    if (!body.id) return NextResponse.json({ error: "Slide ID required" }, { status: 400 });

    const rawImage = body.image || body.desktopImage || (body as any).image_path;
    if (rawImage) {
      const cleanImage = toStoragePath(rawImage);
      body.image = cleanImage;
      body.desktopImage = cleanImage;
      (body as any).image_path = cleanImage;
    }

    const updated = saveDbHeroSlide(body);

    // Sync to Supabase hero_slides table
    syncHeroSlideToSupabaseTable(updated).catch((err) =>
      console.warn("[Hero Supabase Sync Error]:", err)
    );

    return NextResponse.json({ success: true, slide: updated });
  } catch (err: any) {
    console.error("[Hero PUT Error]:", err);
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Slide ID required" }, { status: 400 });

    deleteDbHeroSlide(id);

    // Delete from Supabase hero_slides table
    deleteHeroSlideFromSupabaseTable(id).catch((err) =>
      console.warn("[Hero Supabase Delete Error]:", err)
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Hero DELETE Error]:", err);
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
