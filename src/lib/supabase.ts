import { type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_MEDIA_BUCKET,
} from "./supabase/config";

const supabaseUrl = SUPABASE_URL;
const supabasePublishableKey = SUPABASE_PUBLISHABLE_KEY;
export const MEDIA_BUCKET = SUPABASE_MEDIA_BUCKET;

export { createClient as createBrowserClientSSR } from "./supabase/client";
export { createClient as createServerClientSSR } from "./supabase/server";

let cachedBrowserClient: SupabaseClient | null = null;

/**
 * Get Supabase browser client using @supabase/ssr
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (cachedBrowserClient) return cachedBrowserClient;
  cachedBrowserClient = createBrowserClient(supabaseUrl, supabasePublishableKey);
  return cachedBrowserClient;
}

/**
 * Standard Supabase client
 */
export function getSupabaseClient(): SupabaseClient {
  return getSupabaseBrowserClient();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

import { toStoragePath } from "./media";

/**
 * Upload file to Supabase Storage bucket with folder categorization.
 * Organized folders: hero, products, reels, outlets, branding, founders
 */
export async function uploadToSupabaseStorage(
  fileBuffer: Buffer,
  fileName: string,
  folder: "hero" | "categories" | "products" | "reels" | "outlets" | "founders" | "branding" = "products",
  contentType: string = "image/jpeg",
  customClient?: SupabaseClient
): Promise<{ url: string; path: string; error?: string } | null> {
  let client = customClient;
  if (!client) {
    if (typeof window === "undefined") {
      try {
        const { createClient: createServerClientSSR } = await import("./supabase/server");
        client = (await createServerClientSSR()) as unknown as SupabaseClient;
      } catch {
        client = getSupabaseClient();
      }
    } else {
      client = getSupabaseClient();
    }
  }
  if (!client) return null;

  try {
    const ext = (fileName.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const rawBase = fileName.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const baseName = rawBase || folder;
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const cleanFileName = `${baseName}-${uniqueSuffix}.${ext}`;
    const filePath = `${folder}/${cleanFileName}`;

    const { error: uploadError } = await client.storage
      .from(MEDIA_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error(`[Supabase Storage Error] Upload to ${MEDIA_BUCKET}/${filePath} failed:`, uploadError);
      return { url: "", path: "", error: uploadError.message };
    }

    const { data: publicData } = client.storage
      .from(MEDIA_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: publicData.publicUrl,
      path: filePath,
    };
  } catch (err: any) {
    console.error("[Supabase Storage Exception]:", err);
    return { url: "", path: "", error: err.message || "Failed to upload file to storage" };
  }
}

/**
 * Sync Hero Slide to Supabase table
 * Supabase columns: id, title, subtitle, image_path, alt_text, sort_order, is_active, updated_at
 */
export async function syncHeroSlideToSupabaseTable(slide: any): Promise<void> {
  let client: SupabaseClient | null = null;
  if (typeof window === "undefined") {
    try {
      const { createClient: createServerClientSSR } = await import("./supabase/server");
      client = (await createServerClientSSR()) as unknown as SupabaseClient;
    } catch {
      client = getSupabaseClient();
    }
  } else {
    client = getSupabaseClient();
  }
  if (!client) return;

  try {
    const imagePath = toStoragePath(slide.image || slide.desktopImage || slide.image_path);
    const payload = {
      id: slide.id,
      title: slide.title || "Sky Laban",
      subtitle: slide.subtitle || "",
      image_path: imagePath,
      alt_text: slide.alt || slide.title || "Sky Laban Signature Desserts",
      sort_order: slide.order || 1,
      is_active: slide.isActive !== false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client.from("hero_slides").upsert(payload);
    if (error) {
      console.warn("[Supabase hero_slides upsert warning]:", error.message);
    }
  } catch (err: any) {
    console.warn("[Supabase hero_slides upsert exception]:", err.message);
  }
}

/**
 * Delete Hero Slide from Supabase table
 */
export async function deleteHeroSlideFromSupabaseTable(id: string): Promise<void> {
  let client: SupabaseClient | null = null;
  if (typeof window === "undefined") {
    try {
      const { createClient: createServerClientSSR } = await import("./supabase/server");
      client = (await createServerClientSSR()) as unknown as SupabaseClient;
    } catch {
      client = getSupabaseClient();
    }
  } else {
    client = getSupabaseClient();
  }
  if (!client) return;

  try {
    const { error } = await client.from("hero_slides").delete().eq("id", id);
    if (error) {
      console.warn("[Supabase hero_slides delete warning]:", error.message);
    }
  } catch (err: any) {
    console.warn("[Supabase hero_slides delete exception]:", err.message);
  }
}

/**
 * Sync Instagram Reel to Supabase table
 * Supabase columns: id, caption, reel_url, thumbnail_path, sort_order, is_active, updated_at
 */
export async function syncReelToSupabaseTable(reel: any): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const thumbnailPath = toStoragePath(reel.image || reel.thumbnail_path);
    await client.from("instagram_reels").upsert({
      id: reel.id,
      caption: reel.title || reel.caption || "",
      reel_url: reel.url || reel.reel_url || "",
      thumbnail_path: thumbnailPath,
      sort_order: reel.order || 1,
      is_active: reel.isActive !== false,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Supabase reel upsert notice:", err);
  }
}

/**
 * Delete Instagram Reel from Supabase table
 */
export async function deleteReelFromSupabaseTable(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("instagram_reels").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase reel delete notice:", err);
  }
}

/**
 * Sync Category to Supabase table
 */
export async function syncCategoryToSupabaseTable(cat: any): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("categories").upsert({
      id: cat.id,
      name: cat.name,
      image_url: cat.image,
      display_order: cat.order || 0,
      is_published: cat.isActive !== false,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Supabase category upsert notice:", err);
  }
}

/**
 * Delete Category from Supabase table
 */
export async function deleteCategoryFromSupabaseTable(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("categories").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase category delete notice:", err);
  }
}

/**
 * Sync Product to Supabase table
 * Supabase columns: id, name, description, category, price, image_path, sort_order, is_active, updated_at
 */
export async function syncProductToSupabaseTable(product: any): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const imagePath = toStoragePath(product.image || product.image_path);
    await client.from("products").upsert({
      id: product.id,
      name: product.name,
      description: product.description || product.tagline || "",
      category: product.category || "Salankatia",
      image_path: imagePath,
      price: product.price || null,
      sort_order: product.order || 1,
      is_active: product.isAvailable !== false,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Supabase product upsert notice:", err);
  }
}

/**
 * Delete Product from Supabase table
 */
export async function deleteProductFromSupabaseTable(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("products").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase product delete notice:", err);
  }
}

/**
 * Sync Outlet to Supabase table
 * Supabase columns: id, name, city, address, image_path, maps_url, is_active, sort_order, phone, updated_at
 */
export async function syncOutletToSupabaseTable(outlet: any): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const imagePath = toStoragePath(outlet.image || outlet.image_path);
    await client.from("outlets").upsert({
      id: outlet.id,
      name: outlet.name,
      city: outlet.city,
      address: outlet.address,
      image_path: imagePath,
      maps_url: outlet.mapsUrl || outlet.map_url || "",
      sort_order: outlet.order || 1,
      is_active: outlet.status !== "closed",
      phone: outlet.phone || "",
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Supabase outlet upsert notice:", err);
  }
}

/**
 * Delete Outlet from Supabase table
 */
export async function deleteOutletFromSupabaseTable(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("outlets").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase outlet delete notice:", err);
  }
}

/**
 * Delete a file from Supabase Storage bucket
 */
export async function deleteFromSupabaseStorage(
  filePath: string,
  customClient?: SupabaseClient
): Promise<boolean> {
  let client = customClient;
  if (!client) {
    if (typeof window === "undefined") {
      try {
        const { createClient: createServerClientSSR } = await import("./supabase/server");
        client = (await createServerClientSSR()) as unknown as SupabaseClient;
      } catch {
        client = getSupabaseClient();
      }
    } else {
      client = getSupabaseClient();
    }
  }
  if (!client) return false;

  try {
    const cleanPath = toStoragePath(filePath);
    const { error } = await client.storage
      .from(MEDIA_BUCKET)
      .remove([cleanPath]);
    if (error) {
      console.warn(`Supabase Storage remove warning [${MEDIA_BUCKET}]:`, error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn("Storage remove exception:", err.message);
    return false;
  }
}



