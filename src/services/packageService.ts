import { prisma } from "@/lib/prisma";

export interface CreatePackageData {
  name: string;
  basePrice: number;
  durationDays: number;
  description: string;
  destinationId: number;
  cityId: number;
}

export interface UpdatePackageData {
  name?: string;
  basePrice?: number;
  durationDays?: number;
  description?: string;
  destinationId?: number;
  cityId?: number;
}

export interface PackageFilters {
  destinationId?: number;
  cityId?: number;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  search?: string;
}

export class PackageService {
  // Create a new package
  static async create(data: CreatePackageData) {
    try {
      return await prisma.package.create({
        data,
        include: {
          destination: true,
          city: true,
          itineraries: {
            orderBy: { day: "asc" },
          },
          hotelPrices: {
            include: {
              hotel: {
                include: {
                  city: true,
                },
              },
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Package with this name already exists");
      }
      throw new Error(`Failed to create package: ${error}`);
    }
  }

  // Get all packages with filtering and pagination
  static async getAll(
    page: number = 1,
    limit: number = 10,
    filters: PackageFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      // Apply filters
      if (filters.destinationId) {
        where.destinationId = filters.destinationId;
      }

      if (filters.cityId) {
        where.cityId = filters.cityId;
      }

      if (filters.minPrice || filters.maxPrice) {
        where.basePrice = {};
        if (filters.minPrice) {
          where.basePrice.gte = filters.minPrice;
        }
        if (filters.maxPrice) {
          where.basePrice.lte = filters.maxPrice;
        }
      }

      if (filters.minDuration || filters.maxDuration) {
        where.durationDays = {};
        if (filters.minDuration) {
          where.durationDays.gte = filters.minDuration;
        }
        if (filters.maxDuration) {
          where.durationDays.lte = filters.maxDuration;
        }
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
          {
            destination: {
              name: { contains: filters.search, mode: "insensitive" },
            },
          },
          { city: { name: { contains: filters.search, mode: "insensitive" } } },
        ];
      }

      const [packages, total] = await Promise.all([
        prisma.package.findMany({
          skip,
          take: limit,
          where,
          include: {
            destination: true,
            city: true,
            itineraries: {
              take: 3, // Limit for performance
              orderBy: { day: "asc" },
            },
            hotelPrices: {
              take: 3, // Limit for performance
              include: {
                hotel: {
                  select: {
                    hid: true,
                    name: true,
                    starRating: true,
                  },
                },
              },
              orderBy: { price: "asc" },
            },
          },
          orderBy: { pid: "desc" },
        }),
        prisma.package.count({ where }),
      ]);

      return {
        packages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch packages: ${error}`);
    }
  }

  // Get a specific package by ID
  static async getById(pid: number) {
    try {
      return await prisma.package.findUnique({
        where: { pid },
        include: {
          destination: true,
          city: true,
          itineraries: {
            orderBy: { day: "asc" },
          },
          hotelPrices: {
            include: {
              hotel: {
                include: {
                  city: true,
                  images: {
                    take: 1,
                  },
                },
              },
            },
            orderBy: { price: "asc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch package: ${error}`);
    }
  }

  // Get package by name
  static async getByName(name: string) {
    try {
      return await prisma.package.findUnique({
        where: { name },
        include: {
          destination: true,
          city: true,
          itineraries: {
            orderBy: { day: "asc" },
          },
          hotelPrices: {
            include: {
              hotel: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch package: ${error}`);
    }
  }

  // Get packages by destination
  static async getByDestination(
    destinationId: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      const [packages, total] = await Promise.all([
        prisma.package.findMany({
          where: { destinationId },
          skip,
          take: limit,
          include: {
            destination: true,
            city: true,
            itineraries: {
              take: 2,
            },
            hotelPrices: {
              take: 2,
              include: {
                hotel: {
                  select: {
                    name: true,
                    starRating: true,
                  },
                },
              },
            },
          },
          orderBy: { basePrice: "asc" },
        }),
        prisma.package.count({ where: { destinationId } }),
      ]);

      return {
        packages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch packages by destination: ${error}`);
    }
  }

  // Get packages by city
  static async getByCity(cityId: number, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [packages, total] = await Promise.all([
        prisma.package.findMany({
          where: { cityId },
          skip,
          take: limit,
          include: {
            destination: true,
            city: true,
            itineraries: {
              take: 2,
            },
          },
          orderBy: { basePrice: "asc" },
        }),
        prisma.package.count({ where: { cityId } }),
      ]);

      return {
        packages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch packages by city: ${error}`);
    }
  }

  // Get packages by duration range
  static async getByDuration(
    minDays: number,
    maxDays: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      const [packages, total] = await Promise.all([
        prisma.package.findMany({
          where: {
            durationDays: {
              gte: minDays,
              lte: maxDays,
            },
          },
          skip,
          take: limit,
          include: {
            destination: true,
            city: true,
          },
          orderBy: { durationDays: "asc" },
        }),
        prisma.package.count({
          where: {
            durationDays: {
              gte: minDays,
              lte: maxDays,
            },
          },
        }),
      ]);

      return {
        packages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch packages by duration: ${error}`);
    }
  }

  // Get packages by price range
  static async getByPriceRange(
    minPrice: number,
    maxPrice: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      const [packages, total] = await Promise.all([
        prisma.package.findMany({
          where: {
            basePrice: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
          skip,
          take: limit,
          include: {
            destination: true,
            city: true,
          },
          orderBy: { basePrice: "asc" },
        }),
        prisma.package.count({
          where: {
            basePrice: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
        }),
      ]);

      return {
        packages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch packages by price range: ${error}`);
    }
  }

  // Update a package
  static async update(pid: number, data: UpdatePackageData) {
    try {
      return await prisma.package.update({
        where: { pid },
        data,
        include: {
          destination: true,
          city: true,
          itineraries: {
            orderBy: { day: "asc" },
          },
          hotelPrices: {
            include: {
              hotel: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Package with this name already exists");
      }
      throw new Error(`Failed to update package: ${error}`);
    }
  }

  // Delete a package
  static async delete(pid: number) {
    try {
      // Delete related records first (if not using cascade)
      await prisma.itinerary.deleteMany({
        where: { packageId: pid },
      });

      await prisma.packageHotelPrice.deleteMany({
        where: { packageId: pid },
      });

      return await prisma.package.delete({
        where: { pid },
      });
    } catch (error) {
      throw new Error(`Failed to delete package: ${error}`);
    }
  }

  // Search packages
  static async search(query: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const whereClause = query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              {
                destination: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
              { city: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {};

      const [packages, total] = await Promise.all([
        prisma.package.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            destination: true,
            city: true,
            itineraries: {
              take: 2,
            },
          },
          orderBy: { basePrice: "asc" },
        }),
        prisma.package.count({
          where: whereClause,
        }),
      ]);

      return {
        packages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to search packages: ${error}`);
    }
  }

  // Get package statistics
  static async getStatistics() {
    try {
      const [
        totalPackages,
        packagesByDestination,
        packagesByDuration,
        packagesByPriceRange,
        averagePrice,
        averageDuration,
      ] = await Promise.all([
        prisma.package.count(),
        prisma.package.groupBy({
          by: ["destinationId"],
          _count: true,
          orderBy: { _count: { destinationId: "desc" } },
          take: 10,
        }),
        prisma.package.groupBy({
          by: ["durationDays"],
          _count: true,
          orderBy: { durationDays: "asc" },
        }),
        prisma.$queryRaw`
          SELECT 
            CASE 
              WHEN "basePrice" < 1000 THEN 'Under $1000'
              WHEN "basePrice" < 2000 THEN '$1000-$2000'
              WHEN "basePrice" < 5000 THEN '$2000-$5000'
              ELSE 'Over $5000'
            END as price_range,
            COUNT(*) as count
          FROM "Package"
          GROUP BY price_range
          ORDER BY MIN("basePrice")
        `,
        prisma.package.aggregate({
          _avg: { basePrice: true },
        }),
        prisma.package.aggregate({
          _avg: { durationDays: true },
        }),
      ]);

      // Get destination names for the grouped data
      const destinationIds = packagesByDestination.map(
        (item) => item.destinationId
      );
      const destinations = await prisma.destination.findMany({
        where: { did: { in: destinationIds } },
        select: { did: true, name: true },
      });

      const packagesWithDestinationNames = packagesByDestination.map(
        (item) => ({
          ...item,
          destinationName:
            destinations.find((dest) => dest.did === item.destinationId)
              ?.name || "Unknown",
        })
      );

      return {
        totalPackages,
        packagesByDestination: packagesWithDestinationNames,
        packagesByDuration,
        packagesByPriceRange,
        averagePrice: averagePrice._avg.basePrice,
        averageDuration: averageDuration._avg.durationDays,
      };
    } catch (error) {
      throw new Error(`Failed to get package statistics: ${error}`);
    }
  }

  // Get featured/popular packages
  static async getFeatured(limit: number = 6) {
    try {
      // You can customize this logic based on your business needs
      // For now, we'll get packages with most itineraries or lowest price
      return await prisma.package.findMany({
        take: limit,
        include: {
          destination: true,
          city: true,
          itineraries: {
            take: 1,
          },
          hotelPrices: {
            take: 1,
            orderBy: { price: "asc" },
            include: {
              hotel: {
                select: {
                  name: true,
                  starRating: true,
                },
              },
            },
          },
        },
        orderBy: [{ basePrice: "asc" }, { durationDays: "desc" }],
      });
    } catch (error) {
      throw new Error(`Failed to fetch featured packages: ${error}`);
    }
  }

  // Bulk create packages
  static async bulkCreate(data: CreatePackageData[]) {
    try {
      return await prisma.package.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Failed to create packages: ${error}`);
    }
  }

  // Get package with full details including all relations
  static async getFullDetails(pid: number) {
    try {
      return await prisma.package.findUnique({
        where: { pid },
        include: {
          // destination: {
          //   include: {
          //     country: true,
          //   },
          // },
          // city: {
          //   include: {
          //     country: true,
          //   },
          // },
          // itineraries: {
          //   orderBy: { day: "asc" },
          //   include: {
          //     activities: true,
          //   },
          // },
          hotelPrices: {
            include: {
              hotel: {
                include: {
                  city: true,
                  images: true,
                },
              },
            },
            orderBy: { price: "asc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch package details: ${error}`);
    }
  }

  // Get recommended packages based on a package
  static async getRecommended(pid: number, limit: number = 4) {
    try {
      const currentPackage = await prisma.package.findUnique({
        where: { pid },
        select: {
          destinationId: true,
          cityId: true,
          basePrice: true,
          durationDays: true,
        },
      });

      if (!currentPackage) {
        throw new Error("Package not found");
      }

      return await prisma.package.findMany({
        where: {
          pid: { not: pid },
          OR: [
            { destinationId: currentPackage.destinationId },
            { cityId: currentPackage.cityId },
            {
              basePrice: {
                gte: currentPackage.basePrice * 0.8,
                lte: currentPackage.basePrice * 1.2,
              },
            },
          ],
        },
        take: limit,
        include: {
          destination: true,
          city: true,
          itineraries: {
            take: 1,
          },
        },
        orderBy: { basePrice: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch recommended packages: ${error}`);
    }
  }
}
