import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  getSupabaseClient,
  uploadToSupabaseStorage,
  MEDIA_BUCKET,
} from "@/lib/supabase";
import { LOCAL_TO_STORAGE_MAP, getSupabaseStorageUrl } from "@/lib/media";
import {
  getDbProducts,
  getDbHeroSlides,
  getDbReels,
  getDbOutlets,
} from "@/lib/db";
import fs from "fs";
import path from "path";

export interface MediaItem {
  id: string;
  name: string;
  folder: "hero" | "products" | "outlets" | "reels" | "branding" | "drinks" | "other";
  path: string;
  publicUrl: string;
  sizeBytes?: number;
  updatedAt?: string;
  isUsed: boolean;
  usedIn: string[];
}

// Helper to determine where an asset is used
function checkUsage(bucketPath: string, localUrl: string) {
  const usedIn: string[] = [];
  const products = getDbProducts();
  const heroSlides = getDbHeroSlides();
  const reels = getDbReels();
  const outlets = getDbOutlets();

  // Check in products
  const matchingProd = products.find(
    (p) => p.image === localUrl || p.image?.includes(bucketPath)
  );
  if (matchingProd) usedIn.push(`Product: ${matchingProd.name}`);

  // Check in hero slides
  const matchingSlide = heroSlides.find(
    (s) =>
      s.image === localUrl ||
      s.desktopImage === localUrl ||
      s.mobileImage === localUrl ||
      s.image?.includes(bucketPath)
  );
  if (matchingSlide) usedIn.push(`Hero Slide: ${matchingSlide.title}`);

  // Check in reels
  const matchingReel = reels.find(
    (r) => r.image === localUrl || r.image?.includes(bucketPath)
  );
  if (matchingReel) usedIn.push(`Reel #${matchingReel.number}`);

  // Check in outlets
  const matchingOutlet = outlets.find(
    (o) => (o as any).image === localUrl || (o as any).image?.includes(bucketPath)
  );
  if (matchingOutlet) usedIn.push(`Outlet: ${matchingOutlet.name}`);

  // Check in branding
  if (bucketPath.startsWith("branding/")) {
    usedIn.push("Sky Laban Brand Header & Footer");
  }

  return {
    isUsed: usedIn.length > 0,
    usedIn,
  };
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedFolder = searchParams.get("folder") || "all";

  const client = getSupabaseClient();
  let mediaList: MediaItem[] = [];

  // 1. Attempt fetching remote files from Supabase Storage bucket
  try {
    const foldersToFetch =
      requestedFolder === "all"
        ? ["hero", "products", "outlets", "reels", "branding", "drinks"]
        : [requestedFolder];

    let foundAnyRemote = false;

    for (const f of foldersToFetch) {
      const { data: remoteFiles, error: listErr } = await client.storage
        .from(MEDIA_BUCKET)
        .list(f, {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        });

      if (!listErr && remoteFiles && remoteFiles.length > 0) {
        foundAnyRemote = true;
        for (const file of remoteFiles) {
          if (!file.name || file.name === ".emptyFolderPlaceholder") continue;
          const filePath = `${f}/${file.name}`;
          const publicUrl = getSupabaseStorageUrl(filePath);
          const usage = checkUsage(filePath, `/${filePath}`);

          mediaList.push({
            id: file.id || filePath,
            name: file.name,
            folder: f as any,
            path: filePath,
            publicUrl,
            sizeBytes: (file.metadata as any)?.size || 0,
            updatedAt: (file.updated_at || file.created_at) ?? undefined,
            isUsed: usage.isUsed,
            usedIn: usage.usedIn,
          });
        }
      }
    }

    // 2. If bucket is empty or not yet seeded, populate from known map with real local files
    if (!foundAnyRemote) {
      const entries = Object.entries(LOCAL_TO_STORAGE_MAP);
      for (const [localUrl, bucketPath] of entries) {
        const folder = bucketPath.split("/")[0] as any;
        if (requestedFolder !== "all" && folder !== requestedFolder) continue;

        const fileName = bucketPath.split("/").pop() || "image.jpg";
        const usage = checkUsage(bucketPath, localUrl);

        // Get local size if available
        let size = 0;
        try {
          const localFs = path.join(process.cwd(), "public", localUrl.startsWith("/") ? localUrl.slice(1) : localUrl);
          if (fs.existsSync(localFs)) {
            size = fs.statSync(localFs).size;
          }
        } catch {}

        mediaList.push({
          id: bucketPath,
          name: fileName,
          folder: folder as any,
          path: bucketPath,
          publicUrl: localUrl,
          sizeBytes: size,
          updatedAt: new Date().toISOString(),
          isUsed: usage.isUsed,
          usedIn: usage.usedIn,
        });
      }
    }
  } catch (err) {
    console.warn("Storage list fallback:", err);
  }

  return NextResponse.json({
    media: mediaList,
    totalCount: mediaList.length,
    bucket: MEDIA_BUCKET,
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");
  const force = searchParams.get("force") === "true";

  if (!filePath) {
    return NextResponse.json({ error: "File path is required" }, { status: 400 });
  }

  // Check usage
  const usage = checkUsage(filePath, `/${filePath}`);
  if (usage.isUsed && !force) {
    return NextResponse.json(
      {
        error: "File is currently in use",
        isUsed: true,
        usedIn: usage.usedIn,
        warning: `This image is currently referenced in: ${usage.usedIn.join(", ")}. Deleting it may break website display. Confirm with force=true to delete.`,
      },
      { status: 409 }
    );
  }

  try {
    const client = getSupabaseClient();
    const { error: delErr } = await client.storage
      .from(MEDIA_BUCKET)
      .remove([filePath]);

    if (delErr) {
      console.warn("Supabase remove warning:", delErr.message);
    }

    return NextResponse.json({ success: true, deletedPath: filePath });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete file" }, { status: 500 });
  }
}
