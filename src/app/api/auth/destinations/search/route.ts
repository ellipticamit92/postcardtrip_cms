import { NextRequest, NextResponse } from "next/server";
import { DestinationService } from "@/services/destination.service";

// GET /api/destinations/search - Search destinations by country
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");

    if (!country) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query parameter "country" is required',
        },
        { status: 400 }
      );
    }

    const destinations = await DestinationService.searchByCountry(country);

    return NextResponse.json({
      success: true,
      data: destinations,
    });
  } catch (error) {
    console.error("Error searching destinations:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to search destinations",
      },
      { status: 500 }
    );
  }
}
