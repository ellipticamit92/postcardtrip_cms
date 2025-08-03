import { prisma } from "@/lib/prisma";

export interface CreateItineraryData {
  day: number;
  title: string;
  details: string;
  packageId: number;
}

export interface UpdateItineraryData {
  day?: number;
  title?: string;
  details?: string;
  packageId?: number;
}

export interface ItineraryFilters {
  packageId?: number;
  day?: number;
  minDay?: number;
  maxDay?: number;
  search?: string;
}

export class ItineraryService {
  // Create a new itinerary
  static async create(data: CreateItineraryData) {
    try {
      // Check if day already exists for this package
      const existingItinerary = await prisma.itinerary.findFirst({
        where: {
          packageId: data.packageId,
          day: data.day,
        },
      });

      if (existingItinerary) {
        throw new Error(`Day ${data.day} already exists for this package`);
      }

      return await prisma.itinerary.create({
        data,
        include: {
          package: {
            include: {
              destination: true,
              city: true,
            },
          },
          highlights: {
            orderBy: { hlid: "asc" },
          },
          inclusions: {
            orderBy: { lid: "asc" },
          },
          exclusions: {
            orderBy: { eid: "asc" },
          },
          places: {
            include: {
              place: true,
            },
            orderBy: { ipiid: "asc" },
          },
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to create itinerary: ${error.message}`);
    }
  }

  // Get all itineraries with filtering and pagination
  static async getAll(
    page: number = 1,
    limit: number = 10,
    filters: ItineraryFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      // Apply filters
      if (filters.packageId) {
        where.packageId = filters.packageId;
      }

      if (filters.day) {
        where.day = filters.day;
      }

      if (filters.minDay || filters.maxDay) {
        where.day = {};
        if (filters.minDay) {
          where.day.gte = filters.minDay;
        }
        if (filters.maxDay) {
          where.day.lte = filters.maxDay;
        }
      }

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { details: { contains: filters.search, mode: "insensitive" } },
          {
            package: {
              name: { contains: filters.search, mode: "insensitive" },
            },
          },
        ];
      }

      const [itineraries, total] = await Promise.all([
        prisma.itinerary.findMany({
          skip,
          take: limit,
          where,
          include: {
            package: {
              include: {
                destination: true,
                city: true,
              },
            },
            highlights: {
              take: 3,
              orderBy: { hid: "asc" },
            },
            inclusions: {
              take: 3,
              orderBy: { iid: "asc" },
            },
            exclusions: {
              take: 3,
              orderBy: { eid: "asc" },
            },
            places: {
              take: 3,
              include: {
                place: true,
              },
              orderBy: { ipid: "asc" },
            },
            _count: {
              select: {
                highlights: true,
                inclusions: true,
                exclusions: true,
                places: true,
              },
            },
          },
          orderBy: [{ packageId: "asc" }, { day: "asc" }],
        }),
        prisma.itinerary.count({ where }),
      ]);

      return {
        itineraries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch itineraries: ${error}`);
    }
  }

  // Get a specific itinerary by ID
  static async getById(itid: number) {
    try {
      return await prisma.itinerary.findUnique({
        where: { itid },
        include: {
          package: {
            include: {
              destination: true,
              city: true,
            },
          },
          highlights: {
            orderBy: { hid: "asc" },
          },
          inclusions: {
            orderBy: { iid: "asc" },
          },
          exclusions: {
            orderBy: { eid: "asc" },
          },
          places: {
            include: {
              place: {
                include: {
                  destination: true,
                },
              },
            },
            orderBy: { ipid: "asc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch itinerary: ${error}`);
    }
  }

  // Get itineraries by package
  static async getByPackage(packageId: number) {
    try {
      return await prisma.itinerary.findMany({
        where: { packageId },
        include: {
          highlights: {
            orderBy: { hid: "asc" },
          },
          inclusions: {
            orderBy: { iid: "asc" },
          },
          exclusions: {
            orderBy: { eid: "asc" },
          },
          places: {
            include: {
              place: true,
            },
            orderBy: { ipid: "asc" },
          },
          _count: {
            select: {
              highlights: true,
              inclusions: true,
              exclusions: true,
              places: true,
            },
          },
        },
        orderBy: { day: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch itineraries by package: ${error}`);
    }
  }

  // Get itinerary by package and day
  static async getByPackageAndDay(packageId: number, day: number) {
    try {
      return await prisma.itinerary.findFirst({
        where: { packageId, day },
        include: {
          package: true,
          highlights: {
            orderBy: { hid: "asc" },
          },
          inclusions: {
            orderBy: { iid: "asc" },
          },
          exclusions: {
            orderBy: { eid: "asc" },
          },
          places: {
            include: {
              place: {
                include: {
                  destination: true,
                },
              },
            },
            orderBy: { ipid: "asc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch itinerary by package and day: ${error}`);
    }
  }

  // Update an itinerary
  static async update(itid: number, data: UpdateItineraryData) {
    try {
      // If updating day, check for conflicts
      if (data.day) {
        const existingItinerary = await prisma.itinerary.findUnique({
          where: { itid },
          select: { packageId: true, day: true },
        });

        if (existingItinerary && data.day !== existingItinerary.day) {
          const conflictingItinerary = await prisma.itinerary.findFirst({
            where: {
              packageId: data.packageId || existingItinerary.packageId,
              day: data.day,
              itid: { not: itid },
            },
          });

          if (conflictingItinerary) {
            throw new Error(`Day ${data.day} already exists for this package`);
          }
        }
      }

      return await prisma.itinerary.update({
        where: { itid },
        data,
        include: {
          package: {
            include: {
              destination: true,
              city: true,
            },
          },
          highlights: {
            orderBy: { hid: "asc" },
          },
          inclusions: {
            orderBy: { iid: "asc" },
          },
          exclusions: {
            orderBy: { eid: "asc" },
          },
          places: {
            include: {
              place: true,
            },
            orderBy: { ipid: "asc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to update itinerary: ${error.message}`);
    }
  }

  // Delete an itinerary
  static async delete(itid: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Delete related records first
        await tx.highlight.deleteMany({
          where: { itineraryId: itid },
        });

        await tx.inclusion.deleteMany({
          where: { itineraryId: itid },
        });

        await tx.exclusion.deleteMany({
          where: { itineraryId: itid },
        });

        await tx.itineraryPlace.deleteMany({
          where: { itineraryId: itid },
        });

        return await tx.itinerary.delete({
          where: { itid },
        });
      });
    } catch (error) {
      throw new Error(`Failed to delete itinerary: ${error}`);
    }
  }

  // Delete all itineraries for a package
  static async deleteByPackage(packageId: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        const itineraries = await tx.itinerary.findMany({
          where: { packageId },
          select: { itid: true },
        });

        const itineraryIds = itineraries.map((it) => it.itid);

        // Delete related records
        await tx.highlight.deleteMany({
          where: { itineraryId: { in: itineraryIds } },
        });

        await tx.inclusion.deleteMany({
          where: { itineraryId: { in: itineraryIds } },
        });

        await tx.exclusion.deleteMany({
          where: { itineraryId: { in: itineraryIds } },
        });

        await tx.itineraryPlace.deleteMany({
          where: { itineraryId: { in: itineraryIds } },
        });

        return await tx.itinerary.deleteMany({
          where: { packageId },
        });
      });
    } catch (error) {
      throw new Error(`Failed to delete itineraries by package: ${error}`);
    }
  }

  // Search itineraries
  static async search(query: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [itineraries, total] = await Promise.all([
        prisma.itinerary.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { details: { contains: query, mode: "insensitive" } },
              { package: { name: { contains: query, mode: "insensitive" } } },
            ],
          },
          skip,
          take: limit,
          include: {
            package: {
              include: {
                destination: true,
                city: true,
              },
            },
            _count: {
              select: {
                highlights: true,
                inclusions: true,
                exclusions: true,
                places: true,
              },
            },
          },
          orderBy: [{ packageId: "asc" }, { day: "asc" }],
        }),
        prisma.itinerary.count({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { details: { contains: query, mode: "insensitive" } },
              { package: { name: { contains: query, mode: "insensitive" } } },
            ],
          },
        }),
      ]);

      return {
        itineraries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to search itineraries: ${error}`);
    }
  }

  // Get itinerary statistics
  static async getStatistics() {
    try {
      const [
        totalItineraries,
        itinerariesByPackage,
        averageDaysPerPackage,
        mostCommonDayCount,
        recentItineraries,
      ] = await Promise.all([
        prisma.itinerary.count(),
        prisma.itinerary.groupBy({
          by: ["packageId"],
          _count: true,
          orderBy: { _count: { packageId: "desc" } },
          take: 10,
        }),
        prisma.$queryRaw`
          SELECT AVG(day_count) as avg_days
          FROM (
            SELECT COUNT(*) as day_count
            FROM "Itinerary"
            GROUP BY "packageId"
          ) as package_days
        `,
        prisma.itinerary.groupBy({
          by: ["day"],
          _count: true,
          orderBy: { _count: { day: "desc" } },
          take: 5,
        }),
        prisma.itinerary.findMany({
          take: 5,
          include: {
            package: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        totalItineraries,
        itinerariesByPackage,
        averageDaysPerPackage: averageDaysPerPackage[0]?.avg_days || 0,
        mostCommonDayCount,
        recentItineraries,
      };
    } catch (error) {
      throw new Error(`Failed to get itinerary statistics: ${error}`);
    }
  }

  // Bulk create itineraries for a package
  static async bulkCreateForPackage(
    packageId: number,
    itineraries: Omit<CreateItineraryData, "packageId">[]
  ) {
    try {
      // Check for duplicate days
      const days = itineraries.map((it) => it.day);
      const uniqueDays = new Set(days);
      if (days.length !== uniqueDays.size) {
        throw new Error("Duplicate days found in itineraries");
      }

      // Check for existing days in the package
      const existingItineraries = await prisma.itinerary.findMany({
        where: {
          packageId,
          day: { in: days },
        },
        select: { day: true },
      });

      if (existingItineraries.length > 0) {
        const existingDays = existingItineraries.map((it) => it.day);
        throw new Error(
          `Days ${existingDays.join(", ")} already exist for this package`
        );
      }

      const data = itineraries.map((it) => ({ ...it, packageId }));
      return await prisma.itinerary.createMany({
        data,
      });
    } catch (error) {
      throw new Error(`Failed to bulk create itineraries: ${error.message}`);
    }
  }

  // Reorder itinerary days
  static async reorderDays(
    packageId: number,
    dayMapping: { oldDay: number; newDay: number }[]
  ) {
    try {
      return await prisma.$transaction(async (tx) => {
        // First, set all days to negative values to avoid conflicts
        for (const mapping of dayMapping) {
          await tx.itinerary.updateMany({
            where: { packageId, day: mapping.oldDay },
            data: { day: -mapping.newDay },
          });
        }

        // Then, set all days to positive values
        for (const mapping of dayMapping) {
          await tx.itinerary.updateMany({
            where: { packageId, day: -mapping.newDay },
            data: { day: mapping.newDay },
          });
        }

        return await tx.itinerary.findMany({
          where: { packageId },
          orderBy: { day: "asc" },
        });
      });
    } catch (error) {
      throw new Error(`Failed to reorder itinerary days: ${error}`);
    }
  }

  // Clone itinerary to another package
  static async cloneToPackage(
    sourceItineraryId: number,
    targetPackageId: number,
    newDay?: number
  ) {
    try {
      const sourceItinerary = await prisma.itinerary.findUnique({
        where: { itid: sourceItineraryId },
        include: {
          highlights: true,
          inclusions: true,
          exclusions: true,
          places: true,
        },
      });

      if (!sourceItinerary) {
        throw new Error("Source itinerary not found");
      }

      const dayToUse = newDay || sourceItinerary.day;

      // Check if day already exists in target package
      const existingItinerary = await prisma.itinerary.findFirst({
        where: { packageId: targetPackageId, day: dayToUse },
      });

      if (existingItinerary) {
        throw new Error(`Day ${dayToUse} already exists in target package`);
      }

      return await prisma.$transaction(async (tx) => {
        // Create the new itinerary
        const newItinerary = await tx.itinerary.create({
          data: {
            day: dayToUse,
            title: sourceItinerary.title,
            details: sourceItinerary.details,
            packageId: targetPackageId,
          },
        });

        // Clone highlights
        if (sourceItinerary.highlights.length > 0) {
          await tx.highlight.createMany({
            data: sourceItinerary.highlights.map((h) => ({
              description: h.description,
              itineraryId: newItinerary.itid,
            })),
          });
        }

        // Clone inclusions
        if (sourceItinerary.inclusions.length > 0) {
          await tx.inclusion.createMany({
            data: sourceItinerary.inclusions.map((i) => ({
              description: i.description,
              itineraryId: newItinerary.itid,
            })),
          });
        }

        // Clone exclusions
        if (sourceItinerary.exclusions.length > 0) {
          await tx.exclusion.createMany({
            data: sourceItinerary.exclusions.map((e) => ({
              description: e.description,
              itineraryId: newItinerary.itid,
            })),
          });
        }

        // Clone places
        if (sourceItinerary.places.length > 0) {
          await tx.itineraryPlace.createMany({
            data: sourceItinerary.places.map((p) => ({
              itineraryId: newItinerary.itid,
              placeId: p.placeId,
            })),
          });
        }

        return await tx.itinerary.findUnique({
          where: { itid: newItinerary.itid },
          include: {
            highlights: true,
            inclusions: true,
            exclusions: true,
            places: {
              include: {
                place: true,
              },
            },
          },
        });
      });
    } catch (error) {
      throw new Error(`Failed to clone itinerary: ${error.message}`);
    }
  }

  // Get itinerary with full details including all related data
  static async getFullDetails(itid: number) {
    try {
      return await prisma.itinerary.findUnique({
        where: { itid },
        include: {
          package: {
            include: {
              //   destination: {
              //     include: {
              //       country: true,
              //     },
              //   },
              city: {
                include: {
                  destination: true,
                },
              },
            },
          },
          highlights: {
            orderBy: { hlid: "asc" },
          },
          inclusions: {
            orderBy: { lid: "asc" },
          },
          exclusions: {
            orderBy: { eid: "asc" },
          },
          places: {
            include: {
              place: {
                include: {
                  destination: true,
                },
              },
            },
            orderBy: { itpid: "asc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch full itinerary details: ${error}`);
    }
  }
}
