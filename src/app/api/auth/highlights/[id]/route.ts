import { NextRequest, NextResponse } from "next/server";
import HighlightService from "@/services/highlight.service";

interface Params {
  params: Promise<{ hlid: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const hlid = Number((await params).hlid);
    if (isNaN(hlid))
      return NextResponse.json(
        { success: false, error: "Invalid highlight ID" },
        { status: 400 }
      );
    const highlight = await HighlightService.getById(hlid);
    if (!highlight)
      return NextResponse.json(
        { success: false, error: "Highlight not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: highlight });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const hlid = Number((await params).hlid);
    if (isNaN(hlid))
      return NextResponse.json(
        { success: false, error: "Invalid highlight ID" },
        { status: 400 }
      );
    const body = await req.json();
    const highlight = await HighlightService.update(hlid, { text: body.text });
    return NextResponse.json({
      success: true,
      data: highlight,
      message: "Highlight updated",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const hlid = Number((await params).hlid);
    if (isNaN(hlid))
      return NextResponse.json(
        { success: false, error: "Invalid highlight ID" },
        { status: 400 }
      );
    await HighlightService.delete(hlid);
    return NextResponse.json({ success: true, message: "Highlight deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "" },
      { status: 500 }
    );
  }
}
