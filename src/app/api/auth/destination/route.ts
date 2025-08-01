import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all destinations
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const skip = (page - 1) * limit;

  console.log("DEBUG page number = ", page);
  console.log("DEBUG limit number = ", limit);
  console.log("DEBUG skip = ", skip);

  try {
    // Fetch paginated destinations
    const destinations = await prisma.destination.findMany({
      skip,
      take: limit,
      orderBy: { name: "asc" },
      include: { packages: true, cities: true },
    });

    // Fetch total count of destinations
    const totalCount = await prisma.destination.count();

    return NextResponse.json({
      data: destinations,
      totalCount,
      page,
      limit,
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
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, country, overview, imageUrl } = body;

    const destination = await prisma.destination.create({
      data: { name, country, overview, imageUrl },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
