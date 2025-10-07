import { NextRequest, NextResponse } from "next/server";
import HighlightService from "@/services/highlight.service";

interface RouteParams {
  params: Promise<{ name: string }>;
}

// GET /api/packges/name/[name] - Get destination by name
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const destination = await HighlightService.getByTitle(decodedName);

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          error: "Highlight not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: destination,
    });
  } catch (error) {
    console.error("Error fetching Highlight by title:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch Highlight",
      },
      { status: 500 }
    );
  }
}
