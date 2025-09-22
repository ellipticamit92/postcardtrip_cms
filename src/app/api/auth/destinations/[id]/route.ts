import { NextRequest, NextResponse } from "next/server";
import { DestinationService } from "@/services/destination.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/destinations/[id] - Get destination by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const destinationId = parseInt(id);

    if (isNaN(destinationId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid destination ID",
        },
        { status: 400 }
      );
    }

    const destination = await DestinationService.getById(destinationId);

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

// PUT /api/destinations/[id] - Update destination by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const destinationId = parseInt(id);
    const body = await request.json();

    if (isNaN(destinationId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid destination ID",
        },
        { status: 400 }
      );
    }

    const updatedDestination = await DestinationService.update(
      destinationId,
      body
    );

    return NextResponse.json({
      success: true,
      data: updatedDestination,
      message: "Destination updated successfully",
    });
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update destination",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/destinations/[id] - Delete destination by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const destinationId = parseInt(id);

    if (isNaN(destinationId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid destination ID",
        },
        { status: 400 }
      );
    }

    await DestinationService.delete(destinationId);

    return NextResponse.json({
      success: true,
      message: "Destination deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete destination",
      },
      { status: 500 }
    );
  }
}
