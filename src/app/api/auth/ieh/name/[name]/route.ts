import { NextRequest, NextResponse } from "next/server";
import IEHService from "@/services/ieh.service";

interface RouteParams {
  params: Promise<{ name: string }>;
}

// GET /api/cities/name/[name] - Get destination by name
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const city = await IEHService.getByName(decodedName);

    if (!city) {
      return NextResponse.json(
        {
          success: false,
          error: "City not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error("Error fetching city by name:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch destination",
      },
      { status: 500 }
    );
  }
}
