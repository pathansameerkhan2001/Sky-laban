import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gioxrotqpuzmgtoayfre.supabase.co";
const supabaseKey = "sb_publishable_404QfezZPc8L2qaJ9c6XCg_m8M_DmUs";

async function main() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Check storage bucket
  console.log("\n--- Storage Check ---");
  try {
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) {
      console.log("listBuckets error (might require admin or bucket is public):", bErr.message);
    } else {
      console.log("Buckets found:", buckets?.map((b) => ({ id: b.id, name: b.name, public: b.public })));
    }

    // Try accessing sky-laban-media directly
    const { data: files, error: fErr } = await supabase.storage.from("sky-laban-media").list("", { limit: 10 });
    if (fErr) {
      console.log("Error accessing 'sky-laban-media' bucket:", fErr.message);
    } else {
      console.log("Files in 'sky-laban-media' root:", files?.map((f) => f.name));
    }
  } catch (err: any) {
    console.log("Storage check exception:", err.message);
  }

  // 2. Check Database Tables
  console.log("\n--- Database Tables Check ---");
  const tables = ["categories", "products", "founders", "admin_users", "hero_slides", "instagram_reels", "outlets", "site_content"];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select("*", { count: "exact" }).limit(3);
      if (error) {
        console.log(`Table '${table}': ERROR -> ${error.message} (code: ${error.code})`);
      } else {
        console.log(`Table '${table}': EXISTS (${count ?? data?.length} rows). Sample:`, data?.length ? data[0] : "(empty)");
      }
    } catch (err: any) {
      console.log(`Table '${table}': Exception -> ${err.message}`);
    }
  }
}

main().catch((err) => console.error("Main error:", err));
