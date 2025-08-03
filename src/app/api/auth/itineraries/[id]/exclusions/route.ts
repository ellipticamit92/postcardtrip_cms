import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/itineraries/:id/exclusions
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

    const exclusion = await ItineraryService.addExclusion(id, body.text);
    return NextResponse.json(
      { success: true, data: exclusion, message: "Exclusion added" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST exclusion error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to add exclusion",
      },
      { status: 500 }
    );
  }
}
