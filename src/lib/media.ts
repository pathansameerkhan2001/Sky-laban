/**
 * Sky Laban - Supabase Storage Media & URL Resolver
 * 
 * Provides mapping, Supabase public Storage URL resolution, and local asset fallbacks.
 * Bucket: sky-laban-media
 * Structure:
 *   - branding/   : Logo, favicon, icons
 *   - hero/       : Homepage banners and hero slides
 *   - products/   : Products and category clouds
 *   - drinks/     : Bottled aseera nectars & drink creations
 *   - founders/   : Founder portraits and story photos
 *   - reels/      : Instagram reel thumbnails
 *   - outlets/    : Store photos and location maps
 */

import { SUPABASE_URL, SUPABASE_MEDIA_BUCKET } from "./supabase/config";

export const SUPABASE_STORAGE_BASE = SUPABASE_URL;
export const MEDIA_BUCKET = SUPABASE_MEDIA_BUCKET;
export const SUPABASE_PUBLIC_MEDIA_URL = `${SUPABASE_STORAGE_BASE}/storage/v1/object/public/${MEDIA_BUCKET}`;

/**
 * Complete Mapping between local files and their canonical Supabase Storage bucket paths
 */
export const LOCAL_TO_STORAGE_MAP: Record<string, string> = {
  // 1. BRANDING
  "/images/sky_laban_logo_transparent.png": "branding/sky_laban_logo_transparent.png",
  "/images/sky_laban_logo_original.png": "branding/sky_laban_logo_original.png",
  "/favicon.ico": "branding/favicon.ico",
  "/icon.png": "branding/icon.png",
  "/apple-icon.png": "branding/apple-icon.png",

  // 2. HERO SECTION
  "/hero/hero-table-feast-desktop-hd.jpg": "hero/hero-table-feast-desktop-hd.jpg",
  "/hero/hero-table-feast-mobile-hd.jpg": "hero/hero-table-feast-mobile-hd.jpg",
  "/hero/hero-table-feast-desktop.jpg": "hero/hero-table-feast-desktop.jpg",
  "/hero/hero-table-feast-mobile.jpg": "hero/hero-table-feast-mobile.jpg",
  "/hero/hero-cafe-experience-desktop-hd.jpg": "hero/hero-cafe-experience-desktop-hd.jpg",
  "/hero/hero-cafe-experience-mobile-hd.jpg": "hero/hero-cafe-experience-mobile-hd.jpg",
  "/hero/hero-cafe-experience-desktop.jpg": "hero/hero-cafe-experience-desktop.jpg",
  "/hero/hero-cafe-experience-mobile.jpg": "hero/hero-cafe-experience-mobile.jpg",
  "/hero/hero-gift-presentation-desktop.jpg": "hero/hero-gift-presentation-desktop.jpg",
  "/hero/hero-gift-presentation-mobile.jpg": "hero/hero-gift-presentation-mobile.jpg",
  "/hero/hero-dessert-collection-desktop.jpg": "hero/hero-dessert-collection-desktop.jpg",
  "/hero/hero-dessert-collection-mobile.jpg": "hero/hero-dessert-collection-mobile.jpg",
  "/hero/sky-laban-hero-clean.jpg": "hero/sky-laban-hero-clean.jpg",
  "/hero/sky-laban-hero-poster.jpg": "hero/sky-laban-hero-poster.jpg",
  "/hero/sky-laban-hero.png": "hero/sky-laban-hero.png",
  "/hero/slide-1-creamy-desktop.jpg": "hero/slide-1-creamy-desktop.jpg",
  "/hero/slide-2-scoop-desktop.jpg": "hero/slide-2-scoop-desktop.jpg",
  "/hero/slide-3-salankatia-desktop.jpg": "hero/slide-3-salankatia-desktop.jpg",

  // 3. PRODUCTS & CATEGORIES
  "/products/chocolate-almond-bowl.jpg": "products/chocolate-almond-bowl.jpg",
  "/products/salankatia-pistachio-lotus.jpg": "products/salankatia-pistachio-lotus.jpg",
  "/products/salankatia-nutella-lotus.jpg": "products/salankatia-nutella-lotus.jpg",
  "/products/salankatia-duo-cafe.jpg": "products/salankatia-duo-cafe.jpg",
  "/products/salankatia-kinder.jpg": "products/salankatia-kinder.jpg",
  "/products/salankatia-pistachio.jpg": "products/salankatia-pistachio.jpg",
  "/products/salankatia-strawberry.jpg": "products/salankatia-strawberry.jpg",
  "/products/koushiri-lotus.jpg": "products/koushiri-lotus.jpg",
  "/products/koushiri-nutella.jpg": "products/koushiri-nutella.jpg",
  "/products/koushiri-pistachio.jpg": "products/koushiri-pistachio.jpg",
  "/products/koushri-box-cake.jpg": "products/koushri-box-cake.jpg",
  "/products/muhallabia-pudding-pot.jpg": "products/muhallabia-pudding-pot.jpg",
  "/products/mango-muhallabia.jpg": "products/mango-muhallabia.jpg",
  "/products/heba-cake.jpg": "products/heba-cake.jpg",
  "/products/fazea-chocola-cake.jpg": "products/fazea-chocola-cake.jpg",
  "/products/fazea-chocola-lotus.jpg": "products/fazea-chocola-lotus.jpg",
  "/products/chocolate-sphere-gift.jpg": "products/chocolate-sphere-gift.jpg",
  "/products/kabsa-dessert-tray.jpg": "products/kabsa-dessert-tray.jpg",

  // Category Clouds
  "/images/categories/gulstha-cloud@2x.png": "products/gulstha-cloud@2x.png",
  "/images/categories/salankatia-cloud@2x.png": "products/salankatia-cloud@2x.png",
  "/images/categories/koushiri-cloud@2x.png": "products/koushiri-cloud@2x.png",
  "/images/categories/ruh-hayati-cloud@2x.png": "products/ruh-hayati-cloud@2x.png",
  "/images/categories/lou-a-cloud@2x.png": "products/lou-a-cloud@2x.png",
  "/images/categories/hiba-cake-cloud@2x.png": "products/hiba-cake-cloud@2x.png",
  "/images/categories/cakes-cloud@2x.png": "products/cakes-cloud@2x.png",
  "/images/categories/kunafa-pastry-cloud@2x.png": "products/kunafa-pastry-cloud@2x.png",
  "/images/categories/kabsa-cloud@2x.png": "products/kabsa-cloud@2x.png",
  "/images/categories/traditional-desserts-cloud@2x.png": "products/traditional-desserts-cloud@2x.png",
  "/images/categories/special-cloud@2x.png": "products/special-cloud@2x.png",

  // 4. DRINKS
  "/products/aseera-pistachio-bottle.jpg": "drinks/aseera-pistachio-bottle.jpg",
  "/products/aseera-lotus-bottle.jpg": "drinks/aseera-lotus-bottle.jpg",
  "/products/aseera-mango-bottle.jpg": "drinks/aseera-mango-bottle.jpg",
  "/products/aseera-nutella-bottle.jpg": "drinks/aseera-nutella-bottle.jpg",

  // 5. FOUNDERS & OUR STORY
  "/images/founders/akram-ali-khan-hd.jpg": "founders/akram-ali-khan-hd.jpg",
  "/images/Founder1(1).png": "founders/Founder1(1).png",
  "/images/Founder2(1).png": "founders/Founder2(1).png",
  "/images/founders/founders_reference_banner.jpg": "founders/founders_reference_banner.jpg",
  "/images/outlet_shaikpet_store.jpg": "founders/outlet_shaikpet_store.jpg",
  "/images/story/our_story_outlet.jpg": "founders/our_story_outlet.jpg",

  // 6. INSTAGRAM REELS
  "/images/reel_1.jpg": "reels/reel_1.jpg",
  "/images/reel_2.jpg": "reels/reel_2.jpg",
  "/images/reel_3.jpg": "reels/reel_3.jpg",
  "/images/reel_4.jpg": "reels/reel_4.jpg",
  "/images/reel_5.jpg": "reels/reel_5.jpg",
  "/images/reel_6.jpg": "reels/reel_6.jpg",
  "/images/reel_7.jpg": "reels/reel_7.jpg",
  "/images/reel_8.jpg": "reels/reel_8.jpg",

  // 7. OUTLETS & LOCATIONS
  "/images/store_kondapur.jpg": "outlets/store_kondapur.jpg",
  "/images/store_shaikpet.jpg": "outlets/store_shaikpet.jpg",
  "/images/store_ongole.jpg": "outlets/store_ongole.jpg",
  "/images/store_proddatur.jpg": "outlets/store_proddatur.jpg",
  "/images/store_ragavendra.jpg": "outlets/store_ragavendra.jpg",
  "/images/south_india_outlets_map.png": "outlets/south_india_outlets_map.png",
  "/images/south_india_outlets_map.jpg": "outlets/south_india_outlets_map.jpg",
  "/images/south_india_outlets_map@2x.png": "outlets/south_india_outlets_map@2x.png",
  "/images/outlets_bowl_clean.png": "outlets/outlets_bowl_clean.png",
  "/images/outlets_bowl_corner.png": "outlets/outlets_bowl_corner.png",
  "/images/outlets_dessert_bowl_accent.jpg": "outlets/outlets_dessert_bowl_accent.jpg",
  "/images/franchise_map_3d.jpg": "outlets/franchise_map_3d.jpg",
  "/images/franchise_network_art.png": "outlets/franchise_network_art.png",
  "/images/sky_laban_salankatia_tub.png": "branding/sky_laban_salankatia_tub.png",
};

/**
 * Returns the Supabase public Storage URL for a given relative bucket path.
 * Example: getSupabaseStorageUrl("hero/salankatia-hero-spoon-abc123.jpg")
 */
export function getSupabaseStorageUrl(bucketPath: string): string {
  const cleanPath = bucketPath.replace(/^\/+/, "");
  return `${SUPABASE_PUBLIC_MEDIA_URL}/${cleanPath}`;
}

/**
 * Standard Storage Folders for Sky Laban Media
 */
export const STORAGE_FOLDERS = [
  "hero/",
  "products/",
  "reels/",
  "outlets/",
  "branding/",
  "founders/",
  "drinks/",
  "categories/",
] as const;

/**
 * Convert any full URL or slash-prefixed path into a clean relative storage path.
 * Examples:
 *   "https://gioxrotqpuzmgtoayfre.supabase.co/storage/v1/object/public/sky-laban-media/hero/sample.jpg" -> "hero/sample.jpg"
 *   "/hero/sample.jpg" -> "hero/sample.jpg"
 *   "hero/sample.jpg" -> "hero/sample.jpg"
 */
export function toStoragePath(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return "";
  let clean = pathOrUrl.trim();

  // Strip Supabase public URL base if present
  if (clean.includes("/storage/v1/object/public/")) {
    const parts = clean.split("/storage/v1/object/public/");
    if (parts[1]) {
      const bucketAndPath = parts[1];
      const prefix = `${MEDIA_BUCKET}/`;
      if (bucketAndPath.startsWith(prefix)) {
        clean = bucketAndPath.slice(prefix.length);
      } else {
        clean = bucketAndPath;
      }
    }
  }

  // Strip any leading slashes
  return clean.replace(/^\/+/, "");
}

/**
 * Central Public Image URL Generator:
 * 
 * Safely converts storage paths (e.g. "hero/salankatia-hero-spoon.jpg", "products/item.jpg")
 * into the full Supabase public URL:
 * https://gioxrotqpuzmgtoayfre.supabase.co/storage/v1/object/public/sky-laban-media/...
 * 
 * Handles:
 * - hero/example.jpg
 * - products/example.jpg
 * - reels/example.jpg
 * - outlets/example.jpg
 * - branding/example.jpg
 * - founders/example.jpg
 * - Already-complete remote URLs (https://...) are returned unchanged.
 * - Local static website files (/images/...) are formatted with leading slash.
 */
export function getPublicMediaUrl(path: string | undefined | null): string {
  if (!path || typeof path !== "string") {
    return "/images/sky_laban_logo_transparent.png";
  }

  const trimmed = path.trim();

  // 1. If already an absolute remote URL or data/blob URI, return as-is
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // 2. Strip leading slash for folder comparison
  const cleanPath = trimmed.replace(/^\/+/, "");

  // 3. Check for standard Supabase Storage bucket folders
  for (const folder of STORAGE_FOLDERS) {
    if (cleanPath.startsWith(folder)) {
      return `${SUPABASE_PUBLIC_MEDIA_URL}/${cleanPath}`;
    }
  }

  // 4. Check if mapped in local-to-storage map
  const serveFromSupabase = process.env.NEXT_PUBLIC_SERVE_FROM_SUPABASE === "true";
  const mapped = LOCAL_TO_STORAGE_MAP[trimmed] || LOCAL_TO_STORAGE_MAP[`/${cleanPath}`];
  if (mapped && serveFromSupabase) {
    return `${SUPABASE_PUBLIC_MEDIA_URL}/${mapped.replace(/^\/+/, "")}`;
  }

  // 5. Default fallback to clean local website asset path
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/**
 * Backwards-compatible alias for getPublicMediaUrl
 */
export const getMediaUrl = getPublicMediaUrl;

/**
 * Returns the expected Supabase storage path for any local path
 */
export function getExpectedStoragePath(localPath: string): string | null {
  return LOCAL_TO_STORAGE_MAP[localPath] || null;
}

