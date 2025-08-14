import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const packageId = Number(params.id);
    const { days } = await request.json();

    if (!packageId || !Array.isArray(days) || days.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    // Attach packageId to each day
    const records = days.map((day: any) => ({
      ...day,
      packageId,
    }));

    // Bulk create
    await prisma.itinerary.createMany({
      data: records,
      skipDuplicates: true, // optional
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
