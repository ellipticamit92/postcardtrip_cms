import { NextRequest, NextResponse } from "next/server";
import { HotelService } from "@/services/hotel.service";

interface RouteParams {
  params: Promise<{ cityId: string }>;
}

// GET /api/hotels/city/:cityId
export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const cityId = Number((await params).cityId);
    if (isNaN(cityId)) {
      return NextResponse.json(
        { success: false, error: "Invalid city ID" },
        { status: 400 }
      );
    }

    const hotels = await HotelService.getByCity(cityId);
    return NextResponse.json({ success: true, data: hotels });
  } catch (err) {
    console.error("GET hotels by city error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch hotels",
      },
      { status: 500 }
    );
  }
}
