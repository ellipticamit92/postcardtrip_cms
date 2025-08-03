// app/api/cities/destination/[destinationId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CityService } from "@/services/city.service";

interface RouteParams {
  params: Promise<{ destinationId: string }>;
}

// GET /api/cities/destination/[destinationId] - Get cities by destination
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { destinationId } = await params;
    const destId = parseInt(destinationId);

    if (isNaN(destId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid destination ID",
        },
        { status: 400 }
      );
    }

    const cities = await CityService.getByDestination(destId);

    return NextResponse.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Error fetching cities by destination:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch cities",
      },
      { status: 500 }
    );
  }
}
