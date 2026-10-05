/**
 * Sky Laban - Unified Admin Media Upload Service
 * 
 * Reusable client-side upload function for all CMS media types:
 * - hero
 * - products
 * - reels
 * - outlets
 * - founders
 * - branding
 */

import { toStoragePath, getPublicMediaUrl } from "./media";

export type MediaFolder = "hero" | "products" | "reels" | "outlets" | "founders" | "branding";

export const ALLOWED_FOLDERS: MediaFolder[] = [
  "hero",
  "products",
  "reels",
  "outlets",
  "founders",
  "branding",
];

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface UploadMediaOptions {
  file: File;
  folder: MediaFolder;
}

export interface UploadMediaResult {
  success: boolean;
  storagePath: string;
  publicUrl: string;
  error?: string;
}

/**
 * Uploads media to Supabase Storage bucket 'sky-laban-media' via authenticated server API.
 * Validates file type, file size (<= 10MB), and folder.
 * Returns clean storage path (e.g. "hero/filename-abc123.jpg") and public URL.
 */
export async function uploadSkyLabanMedia({
  file,
  folder,
}: UploadMediaOptions): Promise<UploadMediaResult> {
  // 1. Validate file existence
  if (!file) {
    return {
      success: false,
      storagePath: "",
      publicUrl: "",
      error: "No file was selected for upload.",
    };
  }

  // 2. Validate folder
  const normalizedFolder = folder.toLowerCase().trim() as MediaFolder;
  if (!ALLOWED_FOLDERS.includes(normalizedFolder)) {
    return {
      success: false,
      storagePath: "",
      publicUrl: "",
      error: `Invalid media folder '${folder}'. Allowed: ${ALLOWED_FOLDERS.join(", ")}.`,
    };
  }

  // 3. Validate MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      storagePath: "",
      publicUrl: "",
      error: "Unsupported image format. Allowed formats: JPEG, PNG, WebP, AVIF.",
    };
  }

  // 4. Validate file size (10 MB limit)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      storagePath: "",
      publicUrl: "",
      error: "Image exceeds the 10 MB limit.",
    };
  }

  // 5. Send to authenticated API
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", normalizedFolder);

  try {
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      let friendlyError = data.error || "Unable to upload image to Sky Laban Media Storage.";
      if (res.status === 401) {
        friendlyError = "Please sign in again.";
      } else if (res.status === 403) {
        friendlyError = data.error || "Your account is not authorized as a Sky Laban admin.";
      } else if (res.status === 413) {
        friendlyError = "Image exceeds the 10 MB limit.";
      } else if (res.status === 400) {
        friendlyError = data.error || "Invalid image upload request.";
      } else if (res.status >= 500) {
        friendlyError = data.error || "Upload failed. Storage server error.";
      }
      return {
        success: false,
        storagePath: "",
        publicUrl: "",
        error: friendlyError,
      };
    }

    const rawPath = data.storagePath || data.path || data.url;
    const cleanStoragePath = toStoragePath(rawPath);
    const publicUrl = data.publicUrl || getPublicMediaUrl(cleanStoragePath);

    return {
      success: true,
      storagePath: cleanStoragePath,
      publicUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      storagePath: "",
      publicUrl: "",
      error: err.message || "Unable to reach upload server.",
    };
  }
}
