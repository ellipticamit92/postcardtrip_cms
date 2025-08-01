import { createPackage, getPaginatedPackages } from "@/services/package.svc";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const result = await getPaginatedPackages({ page, limit, search });
    return Response.json(result);
  } catch (error) {
    console.error("Error in GET /api/packages:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch packages" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      basePrice,
      durationDays,
      description,
      destinationId,
      cityId,
    } = body;

    // Basic validation (you can use Zod or Yup for stricter validation)
    if (!name || !basePrice || !durationDays || !destinationId || !cityId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const newPackage = await createPackage({
      name,
      basePrice,
      durationDays,
      description,
      destinationId,
      cityId,
    });

    return new Response(JSON.stringify(newPackage), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/packages:", error);
    return new Response(JSON.stringify({ error: "Failed to create package" }), {
      status: 500,
    });
  }
}
