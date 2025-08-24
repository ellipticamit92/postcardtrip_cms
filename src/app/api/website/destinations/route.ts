import { NextRequest, NextResponse } from "next/server";
import { DestinationService } from "@/services/destination.service";

const API_KEY = process.env.PUBLIC_API_KEY;
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
    const authHeader = req.headers.get("x-api-key");

    if (authHeader !== API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
