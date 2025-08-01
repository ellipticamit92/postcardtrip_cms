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
    const newDestination = await prisma.destination.create({
      data,
    });
    return newDestination;
  } catch (error) {
    console.error("Failed to create destination:", error);
    throw error;
  }
}

export const getPaginationDestinations = async (page: number = 1) => {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.destination.count(),
  ]);

  return {
    destinations,
    totalPages: Math.ceil(total / pageSize),
    totalCount: total,
    currentPage: page,
  };
};
