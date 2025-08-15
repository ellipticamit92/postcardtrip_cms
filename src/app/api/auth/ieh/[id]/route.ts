import { NextRequest, NextResponse } from "next/server";
import { CityService } from "@/services/city.service";
import IEHService from "@/services/ieh.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/cities/[id] - Get city by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const city = await CityService.getById(cityId);

    return NextResponse.json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error("Error fetching city:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch city",
      },
      { status: 500 }
    );
  }
}

// PUT /api/cities/[id] - Update city by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const iehId = parseInt(id);
    const body = await request.json();

    if (isNaN(iehId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID",
        },
        { status: 400 }
      );
    }

    const updateData = await IEHService.update(
      iehId,
      {
        text: body.text,
      },
      body.type
    );

    return NextResponse.json({
      success: true,
      data: updateData,
      message: "Updated successfully",
    });
  } catch (error) {
    console.error("Error updating:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const idArray = id.split("_");
    const newId = parseInt(idArray[0]);

    if (isNaN(newId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid city ID",
        },
        { status: 400 }
      );
    }

    await IEHService.delete(id);

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
