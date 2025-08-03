import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/exclusions/:id
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid exclusion ID" },
        { status: 400 }
      );
    }

    await ItineraryService.removeExclusion(id);
    return NextResponse.json({ success: true, message: "Exclusion removed" });
  } catch (err) {
    console.error("DELETE exclusion error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to remove exclusion",
      },
      { status: 500 }
    );
  }
}
