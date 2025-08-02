import {
  deleteDestination,
  updateDestination,
} from "@/services/destination.svc";
import { NextResponse } from "next/server";

// PUT /api/destination/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();
    const result = await updateDestination(parseInt(id), {
      name: body.name,
      country: body.country,
      description: body.description,
      overview: body.overview,
      imageUrl: body.imageUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message, success: result.success },
        { status: 409 } // Conflict
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        data: result.destination,
        success: result.success,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update destination",
        error: (error as Error).message,
        success: false,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/destination/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const deleted = await deleteDestination(Number(id));
    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    console.error("API DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
