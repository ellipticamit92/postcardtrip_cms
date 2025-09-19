import { ItineraryDays } from "@/lib/api/itineraries";
import { prisma } from "@/lib/prisma";

export class ItineraryService {
  static async create(data: { packageId: number; days: ItineraryDays[] }) {
    try {
      if (data?.days?.length > 0) {
        // Delete existing itineraries for the package to avoid duplicates
        await prisma.itinerary.deleteMany({
          where: { packageId: data.packageId },
        });

        // Create multiple itineraries using transaction for atomic operations
        const createdItineraries = await prisma.$transaction(
          data.days.map((day: ItineraryDays) =>
            prisma.itinerary.create({
              data: {
                day: day.day,
                title: day.title,
                details: day.details,
                packageId: data.packageId,
                cities: {
                  connect:
                    day?.cities?.map((cid: number) => ({
                      cid,
                    })) || [],
                },
                highlights: {
                  connect:
                    day?.highlights?.map((hlid: number) => ({
                      hlid,
                    })) || [],
                },
              },
              include: {
                cities: true,
                highlights: true,
                package: true,
              },
            })
          )
        );

        return createdItineraries;
      }

      throw new Error("No itinerary days provided");
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
              select: {
                name: true,
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

  /**
   * Get itineraries grouped by package
   */
  static async getGroupedByPackage(
    options: {
      packageIds?: number[];
      includePackage?: boolean;
    } = {}
  ) {
    try {
      const { packageIds, includePackage = true } = options;

      const where: any = {};
      if (packageIds?.length) {
        where.packageId = { in: packageIds };
      }

      const itineraries = await prisma.itinerary.findMany({
        where,
        orderBy: { day: "asc" },
        include: {
          package: includePackage
            ? {
                select: {
                  pid: true,
                  name: true,
                  destination: {
                    select: {
                      name: true,
                    },
                  },
                },
              }
            : false,
        },
      });

      // Group itineraries by packageId
      const grouped = itineraries.reduce<Record<number, typeof itineraries>>(
        (acc, itinerary) => {
          const key = itinerary.packageId;
          if (!acc[key]) acc[key] = [];
          acc[key].push(itinerary);
          return acc;
        },
        {}
      );

      return grouped;
    } catch (error) {
      throw new Error(`Failed to fetch grouped itineraries: ${error}`);
    }
  }

  /**
   * Get all itineraries grouped by their package
   */
  static async getGroupedItineraryPackage(
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

      // Filters
      const where: any = {};
      if (packageId) where.packageId = packageId;
      if (day) where.day = day;
      if (title) where.title = { contains: title, mode: "insensitive" };

      // Count total itineraries for pagination
      const total = await prisma.itinerary.count({ where });

      // Fetch paginated itineraries
      const itineraries = await prisma.itinerary.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          package: {
            select: {
              pid: true,
              name: true,
              destination: true,
            },
          },
        },
      });

      // Group itineraries by packageId
      const grouped = itineraries.reduce<
        Record<
          number,
          {
            package: (typeof itineraries)[number]["package"];
            itineraries: typeof itineraries;
          }
        >
      >((acc, itinerary) => {
        const pkgId = itinerary.packageId;

        if (!acc[pkgId]) {
          acc[pkgId] = {
            package: itinerary.package,
            itineraries: [],
          };
        }

        acc[pkgId].itineraries.push(itinerary);
        return acc;
      }, {});

      return {
        data: grouped,
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
      throw new Error(`Failed to fetch grouped itineraries: ${error}`);
    }
  }
}

export default ItineraryService;
