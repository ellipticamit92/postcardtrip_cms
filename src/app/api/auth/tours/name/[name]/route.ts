import { NextRequest, NextResponse } from "next/server";
import { toursApi } from "@/lib/api/tours";

interface RouteParams {
  params: Promise<{ name: string }>;
}

// GET /api/destinations/name/[name] - Get destination by name
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const tour = await toursApi.getByName(decodedName);

    if (!tour) {
      return NextResponse.json(
        {
          success: false,
          error: "Tour not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tour,
    });
  } catch (error) {
    console.error("Error fetching tour by name:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch tour",
      },
      { status: 500 }
    );
  }
}
