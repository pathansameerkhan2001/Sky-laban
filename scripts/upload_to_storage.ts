import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { LOCAL_TO_STORAGE_MAP } from "../src/lib/media";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gioxrotqpuzmgtoayfre.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_404QfezZPc8L2qaJ9c6XCg_m8M_DmUs";

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || "sky-laban-media";

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    default:
      return "application/octet-stream";
  }
}

async function main() {
  console.log("==================================================================");
  console.log("Sky Laban - Supabase Storage Media Upload Utility");
  console.log("Target Supabase URL:", supabaseUrl);
  console.log("Target Storage Bucket:", BUCKET_NAME);
  console.log("==================================================================\n");

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Check or Create Bucket
  console.log(`[1/3] Checking storage bucket '${BUCKET_NAME}'...`);
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();

  const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME || b.id === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`Bucket '${BUCKET_NAME}' not found in bucket list. Attempting creation...`);
    const { error: cErr } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ["image/*", "video/*"],
    });

    if (cErr) {
      console.warn(`Note on bucket creation: ${cErr.message}`);
      console.warn(
        `If RLS prevented creation, please execute the SQL migration in 'supabase/schema.sql' or create the public bucket '${BUCKET_NAME}' in Supabase Dashboard -> Storage.`
      );
    } else {
      console.log(`✓ Bucket '${BUCKET_NAME}' successfully created as PUBLIC.`);
    }
  } else {
    console.log(`✓ Bucket '${BUCKET_NAME}' confirmed existing in Supabase.`);
  }

  // 2. Iterate and Upload Files
  console.log(`\n[2/3] Uploading media files to '${BUCKET_NAME}'...`);
  const entries = Object.entries(LOCAL_TO_STORAGE_MAP);
  let successCount = 0;
  let failCount = 0;
  let missingLocalCount = 0;

  for (const [localUrl, bucketPath] of entries) {
    // Construct local absolute path inside public folder
    const localFsPath = path.join(process.cwd(), "public", localUrl.startsWith("/") ? localUrl.slice(1) : localUrl);

    if (!fs.existsSync(localFsPath)) {
      console.warn(`[MISSING LOCAL] ${localUrl} -> Not found on disk at ${localFsPath}`);
      missingLocalCount++;
      continue;
    }

    const fileBuffer = fs.readFileSync(localFsPath);
    const contentType = getMimeType(localFsPath);
    const fileSizeKb = Math.round(fileBuffer.length / 1024);

    try {
      const { error: upErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(bucketPath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (upErr) {
        console.error(`✗ [FAIL] ${bucketPath} (${fileSizeKb} KB): ${upErr.message}`);
        failCount++;
      } else {
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(bucketPath);
        console.log(`✓ [UPLOADED] ${bucketPath} (${fileSizeKb} KB) -> ${publicUrlData.publicUrl}`);
        successCount++;
      }
    } catch (ex: any) {
      console.error(`✗ [EXCEPTION] ${bucketPath}: ${ex.message}`);
      failCount++;
    }
  }

  // 3. Summary
  console.log("\n==================================================================");
  console.log("Upload Summary Report:");
  console.log(`Total Mapped Assets: ${entries.length}`);
  console.log(`Successfully Uploaded: ${successCount}`);
  console.log(`Failed / Blocked by RLS: ${failCount}`);
  console.log(`Missing Local Files: ${missingLocalCount}`);
  console.log("==================================================================");
}

main().catch((err) => console.error("Upload fatal error:", err));
