import { NextRequest, NextResponse } from "next/server";
import TourService from "@/services/tours.service";

// GET /api/tours
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await TourService.getAll({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
      text: searchParams.get("text") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch tours",
      },
      { status: 500 }
    );
  }
}

// POST /api/tours
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.text || !body.description || !body.basePrice) {
      return NextResponse.json(
        { success: false, error: "Text and description are required" },
        { status: 400 }
      );
    }
    const tour = await TourService.create({
      text: body.text,
      icon: body.icon,
      description: body.description,
      basePrice: body.basePrice ?? 0,
    });
    return NextResponse.json(
      { success: true, data: tour, message: "Tour created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create tour",
      },
      { status: 500 }
    );
  }
}
