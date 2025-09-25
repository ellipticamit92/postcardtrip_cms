import InquiryService from "@/services/inquiry.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiry = await InquiryService.create(body);

    return NextResponse.json(
      { success: true, data: inquiry, message: "Inquiry created" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/website/inquiry error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create inquiry",
      },
      { status: 500 }
    );
  }
}
