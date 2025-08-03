import { NextRequest, NextResponse } from "next/server";
import { PackageService } from "@/services/package.service";

// GET /api/packages/search?destination=...&city=...&minPrice=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await PackageService.search({
      destination: searchParams.get("destination") || undefined,
      city: searchParams.get("city") || undefined,
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
      starRating: searchParams.get("starRating")
        ? Number(searchParams.get("starRating"))
        : undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("Package search error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to search packages",
      },
      { status: 500 }
    );
  }
}
