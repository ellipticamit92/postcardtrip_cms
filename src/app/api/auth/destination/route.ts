import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all destinations
export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      include: { packages: true, cities: true },
    });
    return NextResponse.json(destinations);
  } catch (error) {
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
    const { name, country, description, overview, imageUrl } = body;

    const destination = await prisma.destination.create({
      data: { name, country, description, overview, imageUrl },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
