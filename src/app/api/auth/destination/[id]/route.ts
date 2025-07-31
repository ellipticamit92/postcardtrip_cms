import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/destination/:id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: params.id },
      include: { packages: true, cities: true },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 }
    );
  }
}

// PUT /api/destination/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, country, description, overview, imageUrl } = body;

    const updated = await prisma.destination.update({
      where: { id: params.id },
      data: { name, country, description, overview, imageUrl },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update destination" },
      { status: 500 }
    );
  }
}

// DELETE /api/destination/:id
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.destination.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Destination deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}
