import { prisma } from "@/lib/prisma";

export const getAllDestinations = async (page: number = 1) => {
  const pageSize = 2;
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
