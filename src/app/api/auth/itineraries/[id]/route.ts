import { NextRequest, NextResponse } from "next/server";
import { ItineraryService } from "@/services/itinerary.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ─────────────────  GET /api/itineraries/:id  ──────────────── */
export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid itinerary ID" },
        { status: 400 }
      );
    }

    const itinerary = await ItineraryService.getById(id);
    return NextResponse.json({ success: true, data: itinerary });
  } catch (err) {
    console.error("GET /api/itineraries/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch itinerary",
      },
      { status: 500 }
    );
  }
}

/* ─────────────────  PUT /api/itineraries/:id  ──────────────── */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid itinerary ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updated = await ItineraryService.update(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Itinerary updated",
    });
  } catch (err) {
    console.error("PUT /api/itineraries/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to update itinerary",
      },
      { status: 500 }
    );
  }
}

/* ───────────────  DELETE /api/itineraries/:id  ────────────── */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid itinerary ID" },
        { status: 400 }
      );
    }

    await ItineraryService.delete(id);
    return NextResponse.json({ success: true, message: "Itinerary deleted" });
  } catch (err) {
    console.error("DELETE /api/itineraries/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to delete itinerary",
      },
      { status: 500 }
    );
  }
}
