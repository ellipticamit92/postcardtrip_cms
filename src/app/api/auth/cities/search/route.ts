// app/api/cities/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CityService } from "@/services/city.service";

// GET /api/cities/search - Search cities by name
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query parameter "name" is required',
        },
        { status: 400 }
      );
    }

    const cities = await CityService.searchByName(name);

    return NextResponse.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Error searching cities:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to search cities",
      },
      { status: 500 }
    );
  }
}
