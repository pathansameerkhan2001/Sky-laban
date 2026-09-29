import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDbEnquiries, updateDbEnquiryStatus, deleteDbEnquiry } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const enquiries = getDbEnquiries();
  return NextResponse.json(enquiries);
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status, notes } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }
    const updated = updateDbEnquiryStatus(id, status, notes);
    return NextResponse.json({ success: true, enquiry: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Enquiry ID required" }, { status: 400 });
    deleteDbEnquiry(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
