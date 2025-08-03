import { NextRequest, NextResponse } from "next/server";
import { PackageService } from "@/services/package.service";

interface RouteParams {
  params: Promise<{ cityId: string }>;
}

// GET /api/packages/city/:cityId
export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const cityId = Number((await params).cityId);
    if (isNaN(cityId)) {
      return NextResponse.json(
        { success: false, error: "Invalid city ID" },
        { status: 400 }
      );
    }

    const pkgs = await PackageService.getByCity(cityId);
    return NextResponse.json({ success: true, data: pkgs });
  } catch (err) {
    console.error("GET packages by city error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch packages",
      },
      { status: 500 }
    );
  }
}
