import { NextResponse } from "next/server";
import {
  getDbProducts,
  getDbCategories,
  getDbOutlets,
  getDbReels,
  getDbContent,
  getDbFounders,
  getDbHeroSlides,
} from "@/lib/db";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  let categories = getDbCategories();
  let founders = getDbFounders();
  let reels = getDbReels();
  let outlets = getDbOutlets();
  let products = getDbProducts();
  const content = getDbContent();
  const heroSlides = getDbHeroSlides();

  // Retrieve from Supabase if configured and tables populated
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();

      // 1. Categories
      const { data: supaCategories, error: catErr } = await supabase
        .from("categories")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!catErr && Array.isArray(supaCategories) && supaCategories.length > 0) {
        categories = supaCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          image: c.image_url,
          order: c.display_order,
          isActive: c.is_published,
        }));
      }

      // 2. Founders (Akram first, Aslam second)
      const { data: supaFounders, error: fndErr } = await supabase
        .from("founders")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!fndErr && Array.isArray(supaFounders) && supaFounders.length > 0) {
        founders = supaFounders.map((f: any) => ({
          id: f.id,
          name: f.name,
          title: f.title,
          image: f.image_url,
          description: f.description,
          order: f.display_order,
          isActive: f.is_published,
        }));
      }

      // 3. Instagram Reels
      const { data: supaReels, error: reelErr } = await supabase
        .from("instagram_reels")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!reelErr && Array.isArray(supaReels) && supaReels.length > 0) {
        reels = supaReels.map((r: any, idx: number) => ({
          id: r.id,
          number: String(r.display_order || idx + 1).padStart(2, "0"),
          title: r.title,
          url: r.instagram_url,
          image: r.thumbnail_url,
          order: r.display_order,
          isActive: r.is_published,
        }));
      }

      // 4. Products
      const { data: supaProducts, error: prodErr } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!prodErr && Array.isArray(supaProducts) && supaProducts.length > 0) {
        const localList = getDbProducts();
        products = supaProducts.map((p: any) => {
          const match = localList.find((l) => l.id === p.id);
          return {
            id: p.id,
            name: p.name,
            tagline: p.tagline || match?.tagline || p.description || "",
            category: p.category || match?.category || "Salankatia",
            badge: p.badge || match?.badge,
            image: p.image_url || match?.image || "/products/salankatia-nutella-lotus.jpg",
            description: p.description || match?.description || "",
            tastingNotes: match?.tastingNotes || ["Handcrafted Cream", "Velvet Layers"],
            servingSuggestion: match?.servingSuggestion,
            pairingNotes: match?.pairingNotes,
            price: p.price || match?.price,
            isHero: match?.isHero ?? true,
            isAvailable: p.is_published,
            order: p.display_order || 1,
          };
        });
      }
    } catch (err) {
      console.warn("Notice: Using local store for public data fallback:", err);
    }
  }

  return NextResponse.json({
    products,
    categories,
    outlets,
    reels,
    content,
    founders,
    heroSlides,
  });
}

