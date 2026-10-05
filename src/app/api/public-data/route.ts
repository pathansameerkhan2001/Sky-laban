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
import { getPublicMediaUrl } from "@/lib/media";

export async function GET() {
  let categories = getDbCategories();
  let founders = getDbFounders();
  let reels = getDbReels();
  let outlets = getDbOutlets();
  let products = getDbProducts();
  const content = getDbContent();
  let heroSlides = getDbHeroSlides();

  // Retrieve from Supabase if configured and tables populated
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();

      // 1. Categories (from categories table if exists)
      try {
        const { data: supaCategories, error: catErr } = await supabase
          .from("categories")
          .select("*")
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        if (!catErr && Array.isArray(supaCategories) && supaCategories.length > 0) {
          categories = supaCategories.map((c: any) => ({
            id: c.id,
            name: c.name,
            image: getPublicMediaUrl(c.image_url),
            order: c.display_order,
            isActive: c.is_published,
          }));
        }
      } catch {}

      // 2. Founders (from founders table if exists)
      try {
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
            image: getPublicMediaUrl(f.image_url),
            description: f.description,
            order: f.display_order,
            isActive: f.is_published,
          }));
        }
      } catch {}

      // 3. Instagram Reels
      try {
        const { data: supaReels, error: reelErr } = await supabase
          .from("instagram_reels")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!reelErr && Array.isArray(supaReels) && supaReels.length > 0) {
          reels = supaReels.map((r: any, idx: number) => ({
            id: r.id,
            number: String(r.sort_order || idx + 1).padStart(2, "0"),
            title: r.caption || `Reel ${idx + 1}`,
            url: r.reel_url || "https://www.instagram.com/sky_laban/",
            image: getPublicMediaUrl(r.thumbnail_path),
            order: r.sort_order || idx + 1,
            isActive: r.is_active ?? true,
          }));
        }
      } catch {}

      // 4. Products
      try {
        const { data: supaProducts, error: prodErr } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!prodErr && Array.isArray(supaProducts) && supaProducts.length > 0) {
          const localList = getDbProducts();
          products = supaProducts.map((p: any) => {
            const match = localList.find((l) => l.id === p.id);
            const imageUrl = getPublicMediaUrl(p.image_path || match?.image || "/products/salankatia-nutella-lotus.jpg");
            return {
              id: p.id,
              name: p.name,
              tagline: match?.tagline || p.description || "",
              category: p.category || match?.category || "Salankatia",
              badge: match?.badge,
              image: imageUrl,
              description: p.description || match?.description || "",
              tastingNotes: match?.tastingNotes || ["Handcrafted Cream", "Velvet Layers"],
              servingSuggestion: match?.servingSuggestion,
              pairingNotes: match?.pairingNotes,
              price: p.price || match?.price,
              isHero: match?.isHero ?? true,
              isAvailable: p.is_active,
              order: p.sort_order || 1,
            };
          });
        }
      } catch {}

      // 5. Outlets
      try {
        const { data: supaOutlets, error: outErr } = await supabase
          .from("outlets")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!outErr && Array.isArray(supaOutlets) && supaOutlets.length > 0) {
          outlets = supaOutlets.map((o: any) => ({
            id: o.id,
            name: o.name,
            city: o.city,
            state: "Telangana",
            address: o.address,
            status: "existing",
            mapsUrl: o.maps_url || o.map_url,
            image: o.image_path ? getPublicMediaUrl(o.image_path) : undefined,
          }));
        }
      } catch {}

      // 6. Hero Slides from Supabase
      try {
        const { data: supaHero, error: heroErr } = await supabase
          .from("hero_slides")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!heroErr && Array.isArray(supaHero) && supaHero.length > 0) {
          console.log(`[Public Data] Retrieved ${supaHero.length} hero_slides from Supabase. Sample image_path: "${supaHero[0].image_path}" -> "${getPublicMediaUrl(supaHero[0].image_path)}"`);
          heroSlides = supaHero.map((s: any) => {
            const publicUrl = getPublicMediaUrl(s.image_path);
            return {
              id: s.id,
              title: s.title || "Sky Laban",
              subtitle: s.subtitle || "Authentic Egyptian Desserts",
              image: s.image_path,
              desktopImage: publicUrl,
              mobileImage: publicUrl,
              alt: s.alt_text || s.title || "Sky Laban Signature Desserts",
              desktopObjectPosition: "object-center",
              mobileObjectPosition: "object-center",
              order: s.sort_order || 1,
              isActive: s.is_active ?? true,
            };
          });
        }
      } catch (e: any) {
        console.warn("[Public Data] hero_slides query error:", e.message);
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
