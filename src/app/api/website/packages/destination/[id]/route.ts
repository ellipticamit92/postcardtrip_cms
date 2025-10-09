import { NextRequest, NextResponse } from "next/server";
import PackageService from "@/services/package.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/destinations/[id] - Get destination by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const ids = id.split("_");

    const did = Number(ids[0]);
    const pid = Number(ids[1]);
    const packagesData = await PackageService.getDestinationPackage(did, pid);

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
