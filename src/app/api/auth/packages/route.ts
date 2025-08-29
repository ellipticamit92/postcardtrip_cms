import { NextRequest, NextResponse } from "next/server";
import { PackageService } from "@/services/package.service";

/**
 * GET /api/auth/packages
 * Query params:
 *  - page, limit
 *  - destinationId, cityId
 *  - name
 *  - minPrice, maxPrice
 *  - minDuration, maxDuration
 *  - sortBy    ('name' | 'basePrice' | 'durationDays' | 'createdAt')
 *  - sortOrder ('asc' | 'desc')
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await PackageService.getAll({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      destinationId: searchParams.get("destinationId")
        ? Number(searchParams.get("destinationId"))
        : undefined,
      name: searchParams.get("name") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      minDuration: searchParams.get("minDuration")
        ? Number(searchParams.get("minDuration"))
        : undefined,
      maxDuration: searchParams.get("maxDuration")
        ? Number(searchParams.get("maxDuration"))
        : undefined,
      sortBy:
        (searchParams.get("sortBy") as
          | "name"
          | "basePrice"
          | "durationDays"
          | "createdAt") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("GET /api/packages error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch packages",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/packages
 * Body: {
 *   name, basePrice, durationDays, description,
 *   destinationId, cityId,
 *   hotelPrices?: [{ hotelId, price }]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = [
      "name",
      "basePrice",
      "day",
      "night",
      "description",
      "destinationId",
      "imageUrl",
    ];
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

    const pkg = await PackageService.create({
      name: body.name,
      basePrice: Number(body.basePrice),
      day: Number(body.day),
      night: Number(body.night),
      description: body.description,
      destinationId: Number(body.destinationId),
      hotelPrices: body.hotelPrices,
      imageUrl: body.imageUrl,
      popular: body.popular || false,
      tours: body.tours || [],
      rating: body.rating ?? "1.0",
      overview: body.overview || "",
      featured: body.featured || false,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : 0,
      heroTitle: body.heroTitle || "",
      text: body.text || "",
    });

    return NextResponse.json(
      { success: true, data: pkg, message: "Package created" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/packages error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create package",
      },
      { status: 500 }
    );
  }
}
