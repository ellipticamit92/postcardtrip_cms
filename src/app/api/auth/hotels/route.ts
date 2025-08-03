import { NextRequest, NextResponse } from "next/server";
import { HotelService } from "@/services/hotel.service";

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

    const result = await HotelService.getAll({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      cityId: searchParams.get("cityId")
        ? Number(searchParams.get("cityId"))
        : undefined,
      name: searchParams.get("name") || undefined,
      starRating: searchParams.get("starRating")
        ? Number(searchParams.get("starRating"))
        : undefined,
      minStarRating: searchParams.get("minStarRating")
        ? Number(searchParams.get("minStarRating"))
        : undefined,
      maxStarRating: searchParams.get("maxStarRating")
        ? Number(searchParams.get("maxStarRating"))
        : undefined,
      sortBy:
        (searchParams.get("sortBy") as "name" | "starRating" | "createdAt") ||
        "createdAt",
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

    const required = ["name", "description", "starRating", "cityId"];
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

    const hotel = await HotelService.create({
      name: body.name,
      description: body.description,
      starRating: Number(body.starRating),
      cityId: Number(body.cityId),
      images: body.images, // optional
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
