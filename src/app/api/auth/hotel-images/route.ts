import { NextRequest, NextResponse } from "next/server";
import { HotelService } from "@/services/hotel.service";
import HotelImageService from "@/services/hotelImage.service";

/**
 * GET /api/hotels
 * Query params:
 *   page, limit
 *   cityId
 *   name
 *   starRating       (exact)
 *   minStarRating, maxStarRating
 *   sortBy    ('name' | 'starRating' | 'createdAt')
 *   sortOrder ('asc' | 'desc')
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await HotelImageService.getAll({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      hotelId: searchParams.get("hotelId")
        ? Number(searchParams.get("hotelId"))
        : undefined,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("GET /api/hotels error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch hotels",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/hotels
 * Body: {
 *   name, description, starRating, cityId,
 *   images?: [{ url, caption? }]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ["caption", "url", "hotelId"];
    const missing = required.filter((k) => body[k] === undefined);

    if (missing.length) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const hotel = await HotelImageService.create({
      hotelId: Number(body.hotelId),
      url: body.url,
      caption: body.caption,
    });

    return NextResponse.json(
      { success: true, data: hotel, message: "Hotel created" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/hotels error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create hotel",
      },
      { status: 500 }
    );
  }
}
