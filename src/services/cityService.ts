import { prisma } from "@/lib/prisma";

export interface CreateCityData {
  name: string;
  description: string;
  destinationId: number;
}

export interface UpdateCityData {
  name?: string;
  description?: string;
  destinationId?: number;
}

export interface CityFilters {
  destinationId?: number;
  search?: string;
  hasPackages?: boolean;
  hasHotels?: boolean;
}

export class CityService {
  // Create a new city
  static async create(data: CreateCityData) {
    try {
      return await prisma.city.create({
        data,
        include: {
          destination: true,
          packages: {
            take: 5,
            orderBy: { basePrice: "asc" },
          },
          hotels: {
            take: 5,
            orderBy: { starRating: "desc" },
          },
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("City with this name already exists");
      }
      throw new Error(`Failed to create city: ${error}`);
    }
  }

  // Get all cities with filtering and pagination
  static async getAll(
    page: number = 1,
    limit: number = 10,
    filters: CityFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      // Apply filters
      if (filters.destinationId) {
        where.destinationId = filters.destinationId;
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
        ];
      }

      if (filters.hasPackages) {
        where.packages = {
          some: {},
        };
      }

      if (filters.hasHotels) {
        where.hotels = {
          some: {},
        };
      }

      const [cities, total] = await Promise.all([
        prisma.city.findMany({
          skip,
          take: limit,
          where,
          include: {
            destination: true,
            packages: {
              take: 3,
              orderBy: { basePrice: "asc" },
              select: {
                pid: true,
                name: true,
                basePrice: true,
                durationDays: true,
              },
            },
            hotels: {
              take: 3,
              orderBy: { starRating: "desc" },
              select: {
                hid: true,
                name: true,
                starRating: true,
              },
            },
            _count: {
              select: {
                packages: true,
                hotels: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.city.count({ where }),
      ]);

      return {
        cities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch cities: ${error}`);
    }
  }

  // Get a specific city by ID
  static async getById(cid: number) {
    try {
      return await prisma.city.findUnique({
        where: { cid },
        include: {
          // destination: {
          //   include: {
          //     country: true,
          //   },
          // },
          packages: {
            include: {
              destination: true,
            },
            orderBy: { basePrice: "asc" },
          },
          hotels: {
            include: {
              images: {
                take: 1,
              },
            },
            orderBy: { starRating: "desc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch city: ${error}`);
    }
  }

  // Get city by name
  static async getByName(name: string) {
    try {
      return await prisma.city.findUnique({
        where: { name },
        include: {
          destination: true,
          packages: {
            take: 10,
            orderBy: { basePrice: "asc" },
          },
          hotels: {
            take: 10,
            orderBy: { starRating: "desc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch city: ${error}`);
    }
  }

  // Get cities by destination
  static async getByDestination(
    destinationId: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      const [cities, total] = await Promise.all([
        prisma.city.findMany({
          where: { destinationId },
          skip,
          take: limit,
          include: {
            destination: true,
            _count: {
              select: {
                packages: true,
                hotels: true,
              },
            },
          },
          orderBy: { name: "asc" },
        }),
        prisma.city.count({ where: { destinationId } }),
      ]);

      return {
        cities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch cities by destination: ${error}`);
    }
  }

  // Update a city
  static async update(cid: number, data: UpdateCityData) {
    try {
      return await prisma.city.update({
        where: { cid },
        data,
        include: {
          destination: true,
          packages: {
            take: 5,
            orderBy: { basePrice: "asc" },
          },
          hotels: {
            take: 5,
            orderBy: { starRating: "desc" },
          },
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("City with this name already exists");
      }
      throw new Error(`Failed to update city: ${error}`);
    }
  }

  // Delete a city
  static async delete(cid: number) {
    try {
      // Check if city has packages or hotels
      const cityWithRelations = await prisma.city.findUnique({
        where: { cid },
        include: {
          _count: {
            select: {
              packages: true,
              hotels: true,
            },
          },
        },
      });

      if (cityWithRelations && cityWithRelations?._count.packages > 0) {
        throw new Error("Cannot delete city with existing packages");
      }

      if (cityWithRelations && cityWithRelations?._count.hotels > 0) {
        throw new Error("Cannot delete city with existing hotels");
      }

      return await prisma.city.delete({
        where: { cid },
      });
    } catch (error) {
      throw new Error(`Failed to delete city: ${error}`);
    }
  }

  // Force delete a city (with cascading deletes)
  static async forceDelete(cid: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Delete related records
        await tx.packageHotelPrice.deleteMany({
          where: {
            OR: [{ package: { cityId: cid } }, { hotel: { cityId: cid } }],
          },
        });

        await tx.hotelImage.deleteMany({
          where: { hotel: { cityId: cid } },
        });

        await tx.itinerary.deleteMany({
          where: { package: { cityId: cid } },
        });

        await tx.package.deleteMany({
          where: { cityId: cid },
        });

        await tx.hotel.deleteMany({
          where: { cityId: cid },
        });

        return await tx.city.delete({
          where: { cid },
        });
      });
    } catch (error) {
      throw new Error(`Failed to force delete city: ${error}`);
    }
  }

  // Search cities
  static async search(query: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const whereClause = query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              {
                destination: { name: { contains: query, mode: "insensitive" } },
              },
            ],
          }
        : {};

      const [cities, total] = await Promise.all([
        prisma.city.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            destination: true,
            _count: {
              select: {
                packages: true,
                hotels: true,
              },
            },
          },
          orderBy: { name: "asc" },
        }),
        prisma.city.count({
          where: whereClause,
        }),
      ]);

      return {
        cities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to search cities: ${error}`);
    }
  }

  // Get city statistics
  static async getStatistics() {
    try {
      const [
        totalCities,
        citiesByDestination,
        citiesWithMostPackages,
        citiesWithMostHotels,
        averagePackagesPerCity,
        averageHotelsPerCity,
      ] = await Promise.all([
        prisma.city.count(),
        prisma.city.groupBy({
          by: ["destinationId"],
          _count: true,
          orderBy: { _count: { destinationId: "desc" } },
          take: 10,
        }),
        prisma.city.findMany({
          take: 5,
          include: {
            _count: {
              select: { packages: true },
            },
          },
          orderBy: {
            packages: {
              _count: "desc",
            },
          },
        }),
        prisma.city.findMany({
          take: 5,
          include: {
            _count: {
              select: { hotels: true },
            },
          },
          orderBy: {
            hotels: {
              _count: "desc",
            },
          },
        }),
        prisma.$queryRaw`
          SELECT AVG(package_count) as avg_packages
          FROM (
            SELECT COUNT(p."pid") as package_count
            FROM "City" c
            LEFT JOIN "Package" p ON c."cid" = p."cityId"
            GROUP BY c."cid"
          ) as city_packages
        `,
        prisma.$queryRaw`
          SELECT AVG(hotel_count) as avg_hotels
          FROM (
            SELECT COUNT(h."hid") as hotel_count
            FROM "City" c
            LEFT JOIN "Hotel" h ON c."cid" = h."cityId"
            GROUP BY c."cid"
          ) as city_hotels
        `,
      ]);

      // Get destination names for grouped data
      const destinationIds = citiesByDestination.map(
        (item) => item.destinationId
      );
      const destinations = await prisma.destination.findMany({
        where: { did: { in: destinationIds } },
        select: { did: true, name: true },
      });

      const citiesWithDestinationNames = citiesByDestination.map((item) => ({
        ...item,
        destinationName:
          destinations.find((dest) => dest.did === item.destinationId)?.name ||
          "Unknown",
      }));

      return {
        totalCities,
        citiesByDestination: citiesWithDestinationNames,
        citiesWithMostPackages,
        citiesWithMostHotels,
        // averagePackagesPerCity: averagePackagesPerCity[0]?.avg_packages || 0,
        // averageHotelsPerCity: averageHotelsPerCity[0]?.avg_hotels || 0,
      };
    } catch (error) {
      throw new Error(`Failed to get city statistics: ${error}`);
    }
  }

  // Get popular cities (based on packages and hotels count)
  static async getPopular(limit: number = 10) {
    try {
      const cities = await prisma.city.findMany({
        include: {
          destination: true,
          packages: {
            take: 1,
            select: {
              pid: true,
              name: true,
              basePrice: true,
            },
            orderBy: { basePrice: "asc" },
          },
          hotels: {
            take: 1,
            select: {
              hid: true,
              name: true,
              starRating: true,
            },
            orderBy: { starRating: "desc" },
          },
          _count: {
            select: {
              packages: true,
              hotels: true,
            },
          },
        },
        orderBy: [
          {
            packages: {
              _count: "desc",
            },
          },
          {
            hotels: {
              _count: "desc",
            },
          },
        ],
        take: limit,
      });

      return cities.filter(
        (city) => city._count.packages > 0 || city._count.hotels > 0
      );
    } catch (error) {
      throw new Error(`Failed to fetch popular cities: ${error}`);
    }
  }

  // Bulk create cities
  static async bulkCreate(data: CreateCityData[]) {
    try {
      return await prisma.city.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Failed to create cities: ${error}`);
    }
  }

  // Get recently added cities
  static async getRecent(limit: number = 5) {
    try {
      return await prisma.city.findMany({
        take: limit,
        include: {
          destination: true,
          _count: {
            select: {
              packages: true,
              hotels: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch recent cities: ${error}`);
    }
  }

  // Get cities with packages in price range
  static async getCitiesWithPackagesPriceRange(
    minPrice: number,
    maxPrice: number
  ) {
    try {
      return await prisma.city.findMany({
        where: {
          packages: {
            some: {
              basePrice: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
          },
        },
        include: {
          destination: true,
          packages: {
            where: {
              basePrice: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
            orderBy: { basePrice: "asc" },
          },
          _count: {
            select: {
              packages: true,
              hotels: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch cities with packages in price range: ${error}`
      );
    }
  }

  // Get cities with hotels by star rating
  static async getCitiesWithHotelsByStarRating(starRating: number) {
    try {
      return await prisma.city.findMany({
        where: {
          hotels: {
            some: {
              starRating,
            },
          },
        },
        include: {
          destination: true,
          hotels: {
            where: { starRating },
            include: {
              images: {
                take: 1,
              },
            },
          },
          _count: {
            select: {
              packages: true,
              hotels: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch cities with hotels by star rating: ${error}`
      );
    }
  }

  // Get city with full details
  static async getFullDetails(cid: number) {
    try {
      return await prisma.city.findUnique({
        where: { cid },
        include: {
          // destination: {
          //   include: {
          //     country: true,
          //   },
          // },
          packages: {
            include: {
              destination: true,
              itineraries: {
                orderBy: { day: "asc" },
              },
              hotelPrices: {
                include: {
                  hotel: {
                    select: {
                      name: true,
                      starRating: true,
                    },
                  },
                },
                orderBy: { price: "asc" },
              },
            },
            orderBy: { basePrice: "asc" },
          },
          hotels: {
            include: {
              images: true,
              prices: {
                include: {
                  package: {
                    select: {
                      name: true,
                      durationDays: true,
                    },
                  },
                },
              },
            },
            orderBy: { starRating: "desc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch city details: ${error}`);
    }
  }
}
