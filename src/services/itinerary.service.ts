import { prisma } from "@/lib/prisma";

export class ItineraryService {
  static async create(data: {
    day: number;
    title: string;
    details: string;
    packageId: number;
    highlights: string;
    places: string;
  }) {
    try {
      return await prisma.itinerary.create({
        data,
      });
    } catch (error) {
      throw new Error(`Failed to create itinerary: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      packageId?: number;
      day?: number;
      title?: string;
      sortBy?: "day" | "title" | "createdAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        packageId,
        day,
        title,
        sortBy = "day",
        sortOrder = "asc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (packageId) {
        where.packageId = packageId;
      }

      if (day) {
        where.day = day;
      }

      if (title) {
        where.title = {
          contains: title,
          mode: "insensitive",
        };
      }

      const [itineraries, total] = await Promise.all([
        prisma.itinerary.findMany({
          where,
          skip,
          take: limit,
          include: {
            package: {
              include: {
                destination: true,
                city: true,
              },
            },
          },
          orderBy: [{ packageId: "asc" }, { [sortBy]: sortOrder }],
        }),
        prisma.itinerary.count({ where }),
      ]);

      return {
        data: itineraries,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch itineraries: ${error}`);
    }
  }

  static async getById(itid: number) {
    try {
      const itinerary = await prisma.itinerary.findUnique({
        where: { itid },
        include: {
          package: {
            include: {
              destination: true,
              city: true,
            },
          },
        },
      });

      if (!itinerary) {
        throw new Error("Itinerary not found");
      }

      return itinerary;
    } catch (error) {
      throw new Error(`Failed to fetch itinerary: ${error}`);
    }
  }

  static async getByPackage(packageId: number) {
    try {
      return await prisma.itinerary.findMany({
        where: { packageId },
        orderBy: {
          day: "asc",
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch itineraries by package: ${error}`);
    }
  }

  static async getByDay(packageId: number, day: number) {
    try {
      return await prisma.itinerary.findFirst({
        where: {
          packageId,
          day,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch itinerary by day: ${error}`);
    }
  }

  static async update(
    itid: number,
    data: {
      day?: number;
      title?: string;
      details?: string;
    }
  ) {
    try {
      return await prisma.itinerary.update({
        where: { itid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update itinerary: ${error}`);
    }
  }

  static async delete(itid: number) {
    try {
      return await prisma.itinerary.delete({
        where: { itid },
      });
    } catch (error) {
      throw new Error(`Failed to delete itinerary: ${error}`);
    }
  }

  static async searchByTitle(title: string) {
    try {
      const whereClause = title
        ? {
            OR: [{ title: { contains: title, mode: "insensitive" } }],
          }
        : {};
      return await prisma.itinerary.findMany({
        where: whereClause,
        include: {
          package: {
            include: {
              destination: true,
              city: true,
            },
          },
        },
        orderBy: {
          day: "asc",
        },
      });
    } catch (error) {
      throw new Error(`Failed to search itineraries by title: ${error}`);
    }
  }
}

export default ItineraryService;
