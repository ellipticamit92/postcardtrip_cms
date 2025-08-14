import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hiid = Number(params.id);
    const image = await prisma.hotelImage.findUnique({
      where: { hiid },
    });
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Hotel image not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: image });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get hotel image" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hiid = Number(params.id);
    const body = await request.json();
    const { url, caption } = body;

    const updated = await prisma.hotelImage.update({
      where: { hiid },
      data: {
        ...(url !== undefined && { url }),
        ...(caption !== undefined && { caption }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update hotel image",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hiid = Number(params.id);
    await prisma.hotelImage.delete({
      where: { hiid },
    });
    return NextResponse.json({
      success: true,
      message: "Hotel image deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete hotel image",
      },
      { status: 500 }
    );
  }
}
