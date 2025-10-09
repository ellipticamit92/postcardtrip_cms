import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

interface RouteParams {
  params: Promise<{ packageId: string }>;
}

// GET /api/itineraries/package/:packageId
export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const packageId = Number((await params).packageId);

    if (isNaN(packageId)) {
      return NextResponse.json(
        { success: false, error: "Invalid package ID" },
        { status: 400 }
      );
    }

    const itineraries = await ItineraryService.getByPackageId(packageId);
    if (itineraries && itineraries?.length === 0) {
      return NextResponse.json({ success: false, data: itineraries });
    }
    return NextResponse.json({ success: true, data: itineraries });
  } catch (err) {
    console.error("GET itineraries by package error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to fetch itineraries",
      },
      { status: 500 }
    );
  }
}
