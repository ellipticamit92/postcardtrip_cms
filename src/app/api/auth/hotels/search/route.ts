import { NextRequest, NextResponse } from "next/server";
import { HotelService } from "@/services/hotel.service";

// GET /api/hotels/search?name=...&minStar=...&maxStar=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const hotels = await HotelService.getAll({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      name: searchParams.get("name") || undefined,
      starRating: searchParams.get("starRating")
        ? Number(searchParams.get("starRating"))
        : undefined,
      minStarRating: searchParams.get("minStar")
        ? Number(searchParams.get("minStar"))
        : undefined,
      maxStarRating: searchParams.get("maxStar")
        ? Number(searchParams.get("maxStar"))
        : undefined,
      cityId: searchParams.get("cityId")
        ? Number(searchParams.get("cityId"))
        : undefined,
    });

    return NextResponse.json({ success: true, ...hotels });
  } catch (err) {
    console.error("Hotel search error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to search hotels",
      },
      { status: 500 }
    );
  }
}
