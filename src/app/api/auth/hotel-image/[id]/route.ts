import { HotelImageService } from "@/services/hotelImage.svc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hiid = parseInt(params.id);
    const hotelImage = await HotelImageService.getById(hiid);

    if (!hotelImage) {
      return NextResponse.json(
        { success: false, error: "Hotel image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: hotelImage });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotel image" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hiid = parseInt(params.id);
    const body = await request.json();
    const { url, caption } = body;

    const hotelImage = await HotelImageService.update(hiid, {
      url,
      caption,
    });

    return NextResponse.json({ success: true, data: hotelImage });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update hotel image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hiid = parseInt(params.id);
    await HotelImageService.delete(hiid);

    return NextResponse.json({
      success: true,
      message: "Hotel image deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete hotel image" },
      { status: 500 }
    );
  }
}
