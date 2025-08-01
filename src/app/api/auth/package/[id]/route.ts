import {
  getPackageById,
  updatePackage,
  deletePackage,
} from "@/services/package.svc";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const pkg = await getPackageById(params.id);
  return NextResponse.json(pkg);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const updated = await updatePackage(params.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const deleted = await deletePackage(params.id);
  return NextResponse.json(deleted);
}
