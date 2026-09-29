import { createClient, SupabaseClient } from "@supabase/supabase-js";
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

/**
 * Upload file to Supabase Storage bucket with folder categorization.
 * Organized folders: hero/, categories/, products/, reels/, outlets/, founders/, branding/
 */
export async function uploadToSupabaseStorage(
  fileBuffer: Buffer,
  fileName: string,
  folder: "hero" | "categories" | "products" | "reels" | "outlets" | "founders" | "branding" = "products",
  contentType: string = "image/jpeg"
): Promise<{ url: string; path: string } | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const fileExt = fileName.split(".").pop() || "jpg";
    const cleanName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `${folder}/${cleanName}`;

    const { error: uploadError } = await client.storage
      .from(MEDIA_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Supabase Storage upload warning [${MEDIA_BUCKET}]:`, uploadError.message);
      return null;
    }

    const { data: publicData } = client.storage
      .from(MEDIA_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: publicData.publicUrl,
      path: filePath,
    };
  } catch (err: any) {
    console.warn("Storage upload exception:", err.message);
    return null;
  }
}

/**
 * Sync Instagram Reel to Supabase table
 */
export async function syncReelToSupabaseTable(reel: any): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("instagram_reels").upsert({
      id: reel.id,
      title: reel.title,
      instagram_url: reel.url,
      thumbnail_url: reel.image,
      display_order: reel.order || 0,
      is_published: reel.isActive !== false,
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
 */
export async function syncProductToSupabaseTable(product: any): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("products").upsert({
      id: product.id,
      name: product.name,
      description: product.description || product.tagline || "",
      image_url: product.image,
      price: product.price || null,
      display_order: product.order || 1,
      is_published: product.isAvailable !== false,
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



