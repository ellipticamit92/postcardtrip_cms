import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const query = searchParams.get("query")?.trim().toLowerCase() || "";

  const skip = (page - 1) * limit;

  try {
    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query || "",
              },
            },
            {
              country: {
                contains: query,
              },
            },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.destination.count({
        where: {
          OR: [
            {
              name: {
                contains: query,
              },
            },
            {
              country: {
                contains: query,
              },
            },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      data: destinations,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[DESTINATION_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
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
