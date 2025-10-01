import { NextRequest, NextResponse } from "next/server";
import { unslugify } from "@/lib/helper";
import PackageService from "@/services/package.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/destinations/[id] - Get destination by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const packagesData = await PackageService.getByName(id);

    return NextResponse.json({
      success: true,
      data: packagesData,
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
