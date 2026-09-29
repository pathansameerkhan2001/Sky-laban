import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbHeroSlides, saveDbHeroSlide, deleteDbHeroSlide, HeroSlideItem } from "@/lib/db";

export async function GET() {
  const slides = getDbHeroSlides();
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: HeroSlideItem = await req.json();
    if (!body.image && !body.desktopImage) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }
    if (!body.desktopImage && body.image) {
      body.desktopImage = body.image;
    }
    if (!body.image && body.desktopImage) {
      body.image = body.desktopImage;
    }
    const saved = saveDbHeroSlide(body);
    return NextResponse.json({ success: true, slide: saved });
  } catch {
    return NextResponse.json({ error: "Failed to save slide" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: HeroSlideItem = await req.json();
    if (!body.id) return NextResponse.json({ error: "Slide ID required" }, { status: 400 });
    const updated = saveDbHeroSlide(body);
    return NextResponse.json({ success: true, slide: updated });
  } catch {
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
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
