import { NextRequest, NextResponse } from "next/server";
import { DestinationService } from "@/services/destination.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/destinations/[id] - Get destination by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const destinaionName = id;
    const destination = await DestinationService.getByName(destinaionName);

    return NextResponse.json({
      success: true,
      data: destination,
    });
  } catch (error) {
    console.error("Error fetching destination:", error);
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
