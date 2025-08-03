import { prisma } from "@/lib/prisma";

// CREATE
export async function createDestination(data: {
  name: string;
  country: string;
  description?: string;
  overview?: string;
  imageUrl?: string;
}) {
  try {
    // Check if a destination with the same name already exists
    const existing = await prisma.destination.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existing) {
      return {
        success: false,
        message: "Destination with this name already exists.",
      };
    }

    const newDestination = await prisma.destination.create({ data });

    return {
      success: true,
      message: "Destination created successfully.",
      destination: newDestination,
    };
  } catch (error) {
    console.error("Failed to create destination:", error);
    throw new Error("Internal Server Error");
  }
}

export const getPaginationDestinations = async ({
  page = 1,
  limit = 10,
  query = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
}) => {
  try {
    const skip = (page - 1) * limit;

    const whereClause = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { country: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: "desc" },
      }),
      prisma.destination.count({ where: whereClause }),
    ]);

    return {
      destinations,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch paginated destinations:", error);
    throw new Error("Could not fetch destinations");
  }
};

export const getDestinationById = async (id: number) => {
  try {
    return await prisma.destination.findUnique({
      where: { did: id },
      include: {
        packages: true,
        cities: true,
      },
    });
  } catch (error) {
    console.error("Error fetching destination by ID:", error);
    throw new Error("Failed to fetch destination");
  }
};

export async function updateDestination(
  id: number,
  data: Partial<{
    name: string;
    country: string;
    description?: string;
    overview?: string;
    imageUrl?: string;
  }>
) {
  try {
    // Optional: Check if name is being updated and already exists for another destination
    if (data.name) {
      const existing = await prisma.destination.findFirst({
        where: {
          name: data.name,
          NOT: { did: id }, // exclude current destination
        },
      });

      if (existing) {
        return {
          success: false,
          message: "Another destination with this name already exists.",
        };
      }
    }

    const updatedDestination = await prisma.destination.update({
      where: { did: id },
      data,
    });

    return {
      success: true,
      message: "Destination updated successfully.",
      destination: updatedDestination,
    };
  } catch (error) {
    console.error("Failed to update destination:", error);
    throw new Error("Internal Server Error");
  }
}

export const deleteDestination = async (id: number) => {
  try {
    const deleted = await prisma.destination.delete({
      where: { did: id },
    });
    return deleted; // or return { success: true } if you don’t need the full object
  } catch (error: any) {
    console.error("Failed to delete destination:", error);
    throw new Error("Unable to delete destination");
  }
};
