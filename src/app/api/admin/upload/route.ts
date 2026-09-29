import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadToSupabaseStorage, isSupabaseConfigured } from "@/lib/supabase";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as any) || "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalName = file.name || "media.jpg";
    const mimeType = file.type || "image/jpeg";

    // 1. If Supabase is configured, try uploading to Supabase Storage bucket
    if (isSupabaseConfigured()) {
      const supabaseResult = await uploadToSupabaseStorage(buffer, originalName, folder, mimeType);
      if (supabaseResult?.url) {
        return NextResponse.json({
          success: true,
          url: supabaseResult.url,
          storage: "supabase",
          path: supabaseResult.path,
        });
      }
    }

    // 2. Default/Local storage fallback: Save to public/uploads/reels/
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = originalName.split(".").pop() || "jpg";
    const cleanFileName = `thumb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(uploadDir, cleanFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${cleanFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      storage: "local",
      path: publicUrl,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
