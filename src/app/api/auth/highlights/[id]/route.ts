import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/highlights/:id
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid highlight ID" },
        { status: 400 }
      );
    }

    await ItineraryService.removeHighlight(id);
    return NextResponse.json({ success: true, message: "Highlight removed" });
  } catch (err) {
    console.error("DELETE highlight error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to remove highlight",
      },
      { status: 500 }
    );
  }
}
