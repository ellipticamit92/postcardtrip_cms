import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const [destinations, totalCount] = await Promise.all([
      prisma.destination.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.destination.count(),
    ]);

    return NextResponse.json({
      data: destinations,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

// POST a new destination
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const destination = await prisma.destination.create({ data: body });
    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
