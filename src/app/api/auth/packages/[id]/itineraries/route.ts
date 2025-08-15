import PackageService from "@/services/package.service";
import { NextRequest, NextResponse } from "next/server";
interface RouteParams {
  params: Promise<{ id: string }>;
}

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

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const packageId = Number(params.id);
//     const { days } = await request.json();

//     if (!packageId || !Array.isArray(days) || days.length === 0) {
//       return NextResponse.json(
//         { success: false, error: "Invalid data" },
//         { status: 400 }
//       );
//     }

//     // Attach packageId to each day
//     const records = days.map((day: any) => ({
//       ...day,
//       packageId,
//     }));

//     // Bulk create
//     await prisma.itinerary.createMany({
//       data: records,
//       skipDuplicates: true, // optional
//     });

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
