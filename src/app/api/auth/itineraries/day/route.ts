import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

// GET /api/itineraries/day?packageId=...&day=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get("packageId");
    const day = searchParams.get("day");

    if (!packageId || !day) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query parameters "packageId" and "day" are required',
        },
        { status: 400 }
      );
    }

    const itinerary = await ItineraryService.getByDay(
      Number(packageId),
      Number(day)
    );

    return NextResponse.json({ success: true, data: itinerary });
  } catch (err) {
    console.error("GET itinerary by day error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch itinerary",
      },
      { status: 500 }
    );
  }
}
