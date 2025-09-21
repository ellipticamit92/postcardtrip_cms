import { NextRequest, NextResponse } from "next/server";
import { PackageService } from "@/services/package.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ─────────────────────────  GET /api/packages/:id  ───────────────────────── */
export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid package ID" },
        { status: 400 }
      );
    }

    const pkg = await PackageService.getById(id);
    return NextResponse.json({ success: true, data: pkg });
  } catch (err) {
    console.error("GET /api/packages/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch package",
      },
      { status: 500 }
    );
  }
}

/* ─────────────────────────  PUT /api/packages/:id  ───────────────────────── */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid package ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updated = await PackageService.update(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Package updated",
    });
  } catch (err) {
    console.error("PUT /api/packages/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update package",
      },
      { status: 500 }
    );
  }
}

/* ────────────────────────  DELETE /api/packages/:id  ─────────────────────── */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid package ID" },
        { status: 400 }
      );
    }

    await PackageService.delete(id);
    return NextResponse.json({ success: true, message: "Package deleted" });
  } catch (err) {
    console.error("DELETE /api/packages/:id error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete package",
      },
      { status: 500 }
    );
  }
}
