import { NextRequest, NextResponse } from "next/server";
import { PackageService } from "@/services/package.service";

interface RouteParams {
  params: Promise<{ destinationId: string }>;
}

// GET /api/packages/destination/:destinationId
export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const destId = Number((await params).destinationId);
    if (isNaN(destId)) {
      return NextResponse.json(
        { success: false, error: "Invalid destination ID" },
        { status: 400 }
      );
    }

    const pkgs = await PackageService.getByDestination(destId);
    return NextResponse.json({ success: true, data: pkgs });
  } catch (err) {
    console.error("GET packages by destination error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch packages",
      },
      { status: 500 }
    );
  }
}
