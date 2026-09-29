/**
 * Sky Laban - Centralized Supabase & Application Environment Configuration
 * 
 * Sources from .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (with NEXT_PUBLIC_SUPABASE_ANON_KEY fallback)
 * - NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET
 * - NEXT_PUBLIC_SITE_URL (http://localhost:3000)
 * - NEXT_PUBLIC_PRODUCTION_URL (https://sky-laban-phi.vercel.app)
 */

// Supabase Project URL
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gioxrotqpuzmgtoayfre.supabase.co";

// Supabase Publishable Key (primary), with legacy anon key alias for compatibility
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_404QfezZPc8L2qaJ9c6XCg_m8M_DmUs";

// Supabase Storage Media Bucket
export const SUPABASE_MEDIA_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET ||
  process.env.SUPABASE_MEDIA_BUCKET ||
  "sky-laban-media";

// Application URLs
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const PRODUCTION_URL =
  process.env.NEXT_PUBLIC_PRODUCTION_URL || "https://sky-laban-phi.vercel.app";

/**
 * Returns the canonical application URL based on current environment
 */
export function getAppUrl(path: string = ""): string {
  const isProd = process.env.NODE_ENV === "production";
  const baseUrl = isProd ? PRODUCTION_URL : SITE_URL;
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${baseUrl.replace(/\/$/, "")}${cleanPath}`;
}
