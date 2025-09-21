import ReviewService from "@/services/reviews.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reviews
 * Query params:
 *  - page, limit
 *  - packageId      (filter by package)
 *  - destinationId  (filter by destination)
 *  - sortBy         ('createdAt' | 'rating')
 *  - sortOrder      ('asc' | 'desc')
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await ReviewService.getAll({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      packageId: searchParams.get("packageId")
        ? Number(searchParams.get("packageId"))
        : undefined,
      destinationId: searchParams.get("destinationId")
        ? Number(searchParams.get("destinationId"))
        : undefined,
      sortBy:
        (searchParams.get("sortBy") as "createdAt" | "rating") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Body: { username, places, review, rating, packageId, destinationId }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (
      !body.username ||
      !body.places ||
      !body.review ||
      !body.rating ||
      !body.packageId ||
      !body.destinationId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Fields "username", "places", "review", "rating", "packageId", and "destinationId" are required',
        },
        { status: 400 }
      );
    }

    const review = await ReviewService.create(body);

    return NextResponse.json(
      { success: true, data: review, message: "Review created" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create review",
      },
      { status: 500 }
    );
  }
}
