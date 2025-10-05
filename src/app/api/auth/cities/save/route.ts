import { NextRequest, NextResponse } from "next/server";
import { CityService } from "@/services/city.service";

// POST /api/citie/save - Create a new city
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const city = await CityService.saveAIData(body);

    return NextResponse.json(
      {
        success: true,
        data: city,
        message: "City created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create city",
      },
      { status: 500 }
    );
  }
}
