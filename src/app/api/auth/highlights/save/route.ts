import { NextRequest, NextResponse } from "next/server";
import HighlightService from "@/services/highlight.service";

// POST /api/highlight/save - Create a new city
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const highlight = await HighlightService.saveAIData(body);

    return NextResponse.json(
      {
        success: true,
        data: highlight,
        message: "Highlight created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating highlight:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create highlight",
      },
      { status: 500 }
    );
  }
}
