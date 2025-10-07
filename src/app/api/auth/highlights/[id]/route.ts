import { NextRequest, NextResponse } from "next/server";
import { CityService } from "@/services/city.service";
import HighlightService from "@/services/highlight.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/cities/[id] - Get city by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const hlid = parseInt(id);

    if (isNaN(hlid)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid city ID",
        },
        { status: 400 }
      );
    }

    const highlight = await HighlightService.getById(hlid);

    return NextResponse.json({
      success: true,
      data: highlight,
    });
  } catch (error) {
    console.error("Error fetching highlight:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch highlight",
      },
      { status: 500 }
    );
  }
}

// PUT /api/cities/[id] - Update city by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cityId = parseInt(id);
    const body = await request.json();

    if (isNaN(cityId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid highlight ID",
        },
        { status: 400 }
      );
    }

    const updatedHighlight = await HighlightService.update(cityId, body);

    return NextResponse.json({
      success: true,
      data: updatedHighlight,
      message: "highlight updated successfully",
    });
  } catch (error) {
    console.error("Error updating highlight:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update highlight",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cities/[id] - Delete city by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cityId = parseInt(id);

    if (isNaN(cityId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid city ID",
        },
        { status: 400 }
      );
    }

    await CityService.delete(cityId);

    return NextResponse.json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete city",
      },
      { status: 500 }
    );
  }
}
