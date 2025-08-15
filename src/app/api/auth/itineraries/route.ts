import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

/**
 * GET /api/itineraries
 * Query params:
 *   page, limit
 *   packageId
 *   day
 *   title
 *   sortBy    ('day' | 'title' | 'createdAt')
 *   sortOrder ('asc' | 'desc')
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await ItineraryService.getAll({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      packageId: searchParams.get("packageId")
        ? Number(searchParams.get("packageId"))
        : undefined,
      day: searchParams.get("day")
        ? Number(searchParams.get("day"))
        : undefined,
      title: searchParams.get("title") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "day" | "title" | "createdAt") || "day",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("GET /api/itineraries error:", err);
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

/**
 * POST /api/itineraries
 * Body: {
 *   day, title, details, packageId,
 *   highlights?: string[],
 *   inclusions?: string[],
 *   exclusions?: string[],
 *   places?: [{
 *     name, description,
 *     images?: [{ url, caption? }]
 *   }]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ["day", "title", "details", "packageId"];
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

    const itinerary = await ItineraryService.create({
      day: Number(body.day),
      title: body.title,
      details: body.details,
      packageId: Number(body.packageId),
      places: body.places,
      highlights: body.highlights,
    });

    return NextResponse.json(
      { success: true, data: itinerary, message: "Itinerary created" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/itineraries error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to create itinerary",
      },
      { status: 500 }
    );
  }
}
