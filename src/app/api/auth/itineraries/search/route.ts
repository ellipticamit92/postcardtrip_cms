import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

// GET /api/itineraries/search?title=...&packageId=...&day=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Search query parameter "title" is required' },
        { status: 400 }
      );
    }

    const itineraries = await ItineraryService.searchByTitle(title);
    return NextResponse.json({ success: true, data: itineraries });
  } catch (err) {
    console.error("Itinerary search error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to search itineraries",
      },
      { status: 500 }
    );
  }
}
