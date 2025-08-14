import { NextRequest, NextResponse } from "next/server";
import { CityService } from "@/services/city.service";
import IEHService from "@/services/ieh.service";

// GET /api/cities - Get all cities with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const options = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      destinationId: searchParams.get("destinationId")
        ? parseInt(searchParams.get("destinationId")!)
        : undefined,
      name: searchParams.get("name") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "name" | "createdAt") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };

    const result = await CityService.getAll(options);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
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

// POST /api/cities - Create a new city
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.text) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: text",
        },
        { status: 400 }
      );
    }
    const type = body.type;

    const data = await IEHService.create(
      {
        text: body.text,
      },
      type
    );

    return NextResponse.json(
      {
        success: true,
        data: data,
        message: `${type} created successfully"`,
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
