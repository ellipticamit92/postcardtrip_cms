import { HotelImageService } from "@/services/hotelImage.svc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (hotelId) {
      const images = await HotelImageService.getByHotelId(parseInt(hotelId));
      return NextResponse.json({ success: true, data: images });
    }

    const result = await HotelImageService.getAll(page, limit);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotel images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, caption, hotelId } = body;

    if (!url || !hotelId) {
      return NextResponse.json(
        { success: false, error: "URL and hotelId are required" },
        { status: 400 }
      );
    }

    const hotelImage = await HotelImageService.create({
      url,
      caption,
      hotelId: parseInt(hotelId),
    });

    return NextResponse.json(
      { success: true, data: hotelImage },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create hotel image" },
      { status: 500 }
    );
  }
}
