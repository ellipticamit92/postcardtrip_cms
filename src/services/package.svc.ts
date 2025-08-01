import { prisma } from "@/lib/prisma";

export const getAllPackages = async (page: number = 1) => {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [packages, total] = await Promise.all([
    prisma.package.findMany({
      skip,
      take: pageSize,
      orderBy: { name: "desc" },
    }),
    prisma.package.count(),
  ]);

  return {
    packages,
    totalPages: Math.ceil(total / pageSize),
    totalCount: total,
    currentPage: page,
  };
};
