import { NextRequest, NextResponse } from "next/server";
import { addDbEnquiry } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, city, message, type, investmentBudget, preferredLocation } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    const saved = addDbEnquiry({
      name,
      email: email || "",
      phone,
      city: city || "Not specified",
      message: message || "No message provided",
      type: type === "franchise" ? "franchise" : type === "contact" ? "contact" : "general",
      investmentBudget: investmentBudget || undefined,
      preferredLocation: preferredLocation || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully! Our team will contact you shortly.",
      enquiryId: saved.id,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again or call our hotline." },
      { status: 500 }
    );
  }
}
