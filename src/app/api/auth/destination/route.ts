import { NextRequest, NextResponse } from "next/server";
import {
  createDestination,
  getPaginationDestinations,
} from "@/services/destination.svc";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";

    const paginationData = await getPaginationDestinations({
      page,
      limit,
      query,
    });

    return NextResponse.json(paginationData);
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

    const { name, country, description, overview, imageUrl } = body;

    // Basic validation
    if (!name || !country) {
      return new Response(
        JSON.stringify({ error: "Name and country are required" }),
        { status: 400 }
      );
    }

    const newDestination = await createDestination({
      name,
      country,
      description,
      overview,
      imageUrl,
    });

    return new Response(JSON.stringify(newDestination), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/destinations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create destination" }),
      { status: 500 }
    );
  }
}
