import { prisma } from "@/lib/prisma";

export const getAllDestinations = async () => {
  const destinations = await prisma.destination.findMany({
    include: { packages: true, cities: true },
  });

  return destinations;
};
