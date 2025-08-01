import { prisma } from "@/lib/prisma";

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

export const getPaginatedDestinations = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const res = await fetch(`/api/destination?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch paginated destinations");
  return res.json(); // returns { data, totalCount, page, totalPages }
};

export const getAllDestinations = async () => {
  const res = await fetch("/api/destination");
  return res.json();
};

export const getDestinationById = async (id: string) => {
  const res = await fetch(`/api/destination/${id}`);
  return res.json();
};

export const createDestination = async (data: any) => {
  const res = await fetch("/api/destination", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateDestination = async (id: string, data: any) => {
  const res = await fetch(`/api/destination/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteDestination = async (id: string) => {
  const res = await fetch(`/api/destination/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
