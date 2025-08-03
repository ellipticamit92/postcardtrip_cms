import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/itineraries/:id/inclusions
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

    const inclusion = await ItineraryService.addInclusion(id, body.text);
    return NextResponse.json(
      { success: true, data: inclusion, message: "Inclusion added" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST inclusion error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to add inclusion",
      },
      { status: 500 }
    );
  }
}
