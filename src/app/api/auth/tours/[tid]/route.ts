import { NextRequest, NextResponse } from "next/server";
import TourService from "@/services/tours.service";

interface Params {
  params: Promise<{ tid: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const tid = Number((await params).tid);
    if (isNaN(tid)) {
      return NextResponse.json(
        { success: false, error: "Invalid tour ID" },
        { status: 400 }
      );
    }
    const tour = await TourService.getById(tid);
    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: tour });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const tid = Number((await params).tid);
    if (isNaN(tid)) {
      return NextResponse.json(
        { success: false, error: "Invalid tour ID" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const updated = await TourService.update(tid, {
      text: body.text,
      icon: body.icon,
      description: body.description,
      basePrice: body.basePrice,
    });
    return NextResponse.json({
      success: true,
      data: updated,
      message: "Tour updated",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Update failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const tid = Number((await params).tid);
    if (isNaN(tid)) {
      return NextResponse.json(
        { success: false, error: "Invalid tour ID" },
        { status: 400 }
      );
    }
    await TourService.delete(tid);
    return NextResponse.json({ success: true, message: "Tour deleted" });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      },
      { status: 500 }
    );
  }
}
