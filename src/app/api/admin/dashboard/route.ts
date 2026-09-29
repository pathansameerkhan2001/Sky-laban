import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  getDashboardStats,
  getDbProducts,
  getDbHeroSlides,
  getDbOutlets,
  getDbReels,
  ProductItem,
  HeroSlideItem,
} from "@/lib/db";
import { createServerClientSSR } from "@/lib/supabase";
import { getMediaUrl } from "@/lib/media";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  // Fallback defaults from local store
  const localStats = getDashboardStats();
  const localProducts = getDbProducts();
  const localSlides = getDbHeroSlides();
  const localOutlets = getDbOutlets();
  const localReels = getDbReels();

  let totalProducts = localStats.totalProducts;
  let publishedProducts = localStats.publishedProducts;
  let totalHeroSlides = localStats.heroSlides;
  let activeHeroSlides = localStats.activeHeroSlides;
  let totalOutlets = localStats.totalOutlets;
  let existingOutlets = localStats.existingOutlets;
  let upcomingOutlets = localStats.upcomingOutlets;
  let totalReels = localStats.totalReels;
  let activeReels = localStats.totalReels;

  let recentProductsList = localProducts.slice(0, 6).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    image: getMediaUrl(p.image),
    isAvailable: p.isAvailable !== false,
    price: p.price || "At Outlets",
  }));

  let recentHeroSlidesList = localSlides.slice(0, 6).map((s) => ({
    id: s.id,
    title: s.title || "Sky Laban Signature",
    subtitle: s.subtitle || "",
    image: getMediaUrl(s.desktopImage || s.image),
    order: s.order || 1,
    isActive: s.isActive !== false,
  }));

  // Attempt live count queries from Supabase if configured and available
  try {
    const supabase = await createServerClientSSR();

    // 1. Products live count & recent
    const { count: prodCount, data: prodData } = await supabase
      .from("products")
      .select("id, name, category_id, description, price, image_url, is_available", { count: "exact" })
      .order("order_index", { ascending: true })
      .limit(6);

    if (typeof prodCount === "number") {
      totalProducts = prodCount;
    }
    if (prodData && prodData.length > 0) {
      recentProductsList = prodData.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category_id || "Dessert",
        image: getMediaUrl(p.image_url),
        isAvailable: p.is_available !== false,
        price: p.price ? `₹${p.price}` : "At Outlets",
      }));
    }

    // 2. Hero Slides live count & recent
    const { count: heroCount, data: heroData } = await supabase
      .from("hero_slides")
      .select("id, title, subtitle, desktop_image, mobile_image, order_index, is_active", { count: "exact" })
      .order("order_index", { ascending: true })
      .limit(6);

    if (typeof heroCount === "number") {
      totalHeroSlides = heroCount;
    }
    if (heroData && heroData.length > 0) {
      recentHeroSlidesList = heroData.map((h: any) => ({
        id: h.id,
        title: h.title,
        subtitle: h.subtitle || "",
        image: getMediaUrl(h.desktop_image || h.mobile_image),
        order: h.order_index || 1,
        isActive: h.is_active !== false,
      }));
    }

    // 3. Outlets live count
    const { count: outletCount, data: outletData } = await supabase
      .from("outlets")
      .select("id, status, is_active", { count: "exact" });

    if (typeof outletCount === "number") {
      totalOutlets = outletCount;
      if (outletData) {
        existingOutlets = outletData.filter((o: any) => o.status === "existing").length;
        upcomingOutlets = outletData.filter((o: any) => o.status === "upcoming").length;
      }
    }

    // 4. Instagram Reels live count
    const { count: reelCount, data: reelData } = await supabase
      .from("instagram_reels")
      .select("id, is_active", { count: "exact" });

    if (typeof reelCount === "number") {
      totalReels = reelCount;
      if (reelData) {
        activeReels = reelData.filter((r: any) => r.is_active !== false).length;
      }
    }
  } catch (err) {
    // Supabase query failed or table not migrated yet; gracefully use local store
    console.warn("Using local store stats fallback:", err);
  }

  return NextResponse.json({
    totalProducts,
    publishedProducts,
    totalHeroSlides,
    activeHeroSlides,
    totalOutlets,
    existingOutlets,
    upcomingOutlets,
    totalReels,
    activeReels,
    recentProducts: recentProductsList,
    recentHeroSlides: recentHeroSlidesList,
    lastUpdated: new Date().toISOString(),
  });
}
