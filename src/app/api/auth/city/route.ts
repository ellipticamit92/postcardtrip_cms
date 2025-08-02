import { cityService } from "@/services/city.svc";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const updateBody = {
      ...body,
      destinationId: Number(body.destinationId),
    };
    const result = await cityService.createCity(updateBody);

    const status = result.success ? 201 : 409;
    return NextResponse.json(result, { status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await cityService.getAllCities();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
