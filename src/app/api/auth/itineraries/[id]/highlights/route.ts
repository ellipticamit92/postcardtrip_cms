import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/itineraries/:id/highlights
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid itinerary ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    if (!body.text) {
      return NextResponse.json(
        { success: false, error: "Missing required field: text" },
        { status: 400 }
      );
    }

    const highlight = await ItineraryService.addHighlight(id, body.text);
    return NextResponse.json(
      { success: true, data: highlight, message: "Highlight added" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST highlight error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to add highlight",
      },
      { status: 500 }
    );
  }
}
