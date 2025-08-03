import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/inclusions/:id
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid inclusion ID" },
        { status: 400 }
      );
    }

    await ItineraryService.removeInclusion(id);
    return NextResponse.json({ success: true, message: "Inclusion removed" });
  } catch (err) {
    console.error("DELETE inclusion error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to remove inclusion",
      },
      { status: 500 }
    );
  }
}
