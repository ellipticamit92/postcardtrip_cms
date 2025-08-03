import { NextRequest, NextResponse } from "next/server";
import { HotelService } from "@/services/hotel.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ───────────────  GET /api/hotels/:id  ─────────────── */
export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid hotel ID" },
        { status: 400 }
      );
    }

    const hotel = await HotelService.getById(id);
    return NextResponse.json({ success: true, data: hotel });
  } catch (err) {
    console.error("GET /api/hotels/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch hotel",
      },
      { status: 500 }
    );
  }
}

/* ───────────────  PUT /api/hotels/:id  ─────────────── */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid hotel ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updated = await HotelService.update(id, {
      name: body.name,
      description: body.description,
      starRating: body.starRating,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Hotel updated",
    });
  } catch (err) {
    console.error("PUT /api/hotels/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update hotel",
      },
      { status: 500 }
    );
  }
}

/* ─────────────  DELETE /api/hotels/:id  ───────────── */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid hotel ID" },
        { status: 400 }
      );
    }

    await HotelService.delete(id);
    return NextResponse.json({ success: true, message: "Hotel deleted" });
  } catch (err) {
    console.error("DELETE /api/hotels/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete hotel",
      },
      { status: 500 }
    );
  }
}
