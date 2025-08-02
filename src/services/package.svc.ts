import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// CREATE
export async function createPackage(data: {
  name: string;
  basePrice: number;
  durationDays: number;
  description: string;
  destinationId: string;
  cityId: string;
}) {
  try {
    const newPackage = await prisma.package.create({
      data,
    });
    return newPackage;
  } catch (error) {
    console.error("Failed to create package:", error);
    throw error;
  }
}

// UPDATE
export const updatePackage = async (
  id: string,
  data: Prisma.PackageUpdateInput
) => {
  try {
    return await prisma.package.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Failed to update package");
  }
};

// DELETE
export const deletePackage = async (id: string) => {
  try {
    return await prisma.package.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    throw new Error("Failed to delete package");
  }
};

// GET BY ID
export const getPackageById = async (id: string) => {
  try {
    return await prisma.package.findUnique({
      where: { pid },
      include: {
        destination: true,
        city: true,
        itineraries: true,
        hotelPrices: {
          include: {
            hotel: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    throw new Error("Failed to fetch package");
  }
};

// PAGINATED FETCH
export const getPaginatedPackages = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const skip = (page - 1) * limit;

    const [packages, total] = await prisma.$transaction([
      prisma.package.findMany({
        skip,
        take: limit,
        where: {
          name: {
            contains: search,
          },
        },
        include: {
          destination: true,
          city: true,
        },
        orderBy: {
          name: "desc",
        },
      }),
      prisma.package.count({
        where: {
          name: {
            contains: search,
          },
        },
      }),
    ]);

    return {
      packages,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching paginated packages:", error);
    throw new Error("Failed to fetch packages");
  }
};
