import { NextRequest, NextResponse } from "next/server";
import { DestinationService } from "@/services/destination.service";

/**
 * GET /api/destinations
 * Query params:
 *  - page, limit
 *  - name      (partial match, case-insensitive)
 *  - country   (partial match, case-insensitive)
 *  - sortBy    ('name' | 'country' | 'createdAt')
 *  - sortOrder ('asc' | 'desc')
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await DestinationService.getAll({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      name: searchParams.get("name") || undefined,
      country: searchParams.get("country") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "name" | "country" | "createdAt") ||
        "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("GET /api/destinations error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to fetch destinations",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/destinations
 * Body: { name, country, overview?, imageUrl? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.country) {
      return NextResponse.json(
        { success: false, error: 'Fields "name" and "country" are required' },
        { status: 400 }
      );
    }

    const destination = await DestinationService.create({
      name: body.name,
      country: body.country,
      overview: body.overview,
      imageUrl: body.imageUrl,
      trending: body.trending,
      heading: body.heading,
      basePrice: body.basePrice,
    });

    return NextResponse.json(
      { success: true, data: destination, message: "Destination created" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/destinations error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to create destination",
      },
      { status: 500 }
    );
  }
}
