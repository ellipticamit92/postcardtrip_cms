import { cityService } from "@/services/city.svc";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const result = await cityService.getCityById(id);
    const status = result.success ? 200 : 404;
    return NextResponse.json(result, { status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const result = await cityService.updateCity(id, body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const result = await cityService.deleteCity(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
