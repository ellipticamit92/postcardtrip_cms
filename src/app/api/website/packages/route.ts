import DestinationService from "@/services/destination.service";
import PackageService from "@/services/package.service";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.PUBLIC_API_KEY;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-api-key");

    if (authHeader !== API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const result = await PackageService.getAllWebPacakges(limit, page);

    return NextResponse.json({
      success: true,
      data: result?.data ?? [],
      count: result?.count ?? 0,
    });
  } catch (err) {
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
