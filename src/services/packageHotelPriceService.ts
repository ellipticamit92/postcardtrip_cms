import { prisma } from "@/lib/prisma";

export interface CreatePackageHotelPriceData {
  price: number;
  hotelId: number;
  packageId: number;
}

export interface UpdatePackageHotelPriceData {
  price?: number;
}

export interface PackageHotelPriceFilters {
  packageId?: number;
  hotelId?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  cityId?: number;
}

export class PackageHotelPriceService {
  // Create a new package hotel price
  static async create(data: CreatePackageHotelPriceData) {
    try {
      return await prisma.packageHotelPrice.create({
        data,
        include: {
          hotel: {
            include: {
              city: true,
              images: {
                take: 1,
              },
            },
          },
          package: {
            include: {
              destination: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error(
          "Price already exists for this package-hotel combination"
        );
      }
      throw new Error(`Failed to create package hotel price: ${error}`);
    }
  }

  // Get all package hotel prices with filtering and pagination
  static async getAll(
    page: number = 1,
    limit: number = 10,
    filters: PackageHotelPriceFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      // Apply filters
      if (filters.packageId) {
        where.packageId = filters.packageId;
      }

      if (filters.hotelId) {
        where.hotelId = filters.hotelId;
      }

      if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) {
          where.price.gte = filters.minPrice;
        }
        if (filters.maxPrice) {
          where.price.lte = filters.maxPrice;
        }
      }

      if (filters.starRating) {
        where.hotel = {
          starRating: filters.starRating,
        };
      }

      if (filters.cityId) {
        where.hotel = {
          ...where.hotel,
          cityId: filters.cityId,
        };
      }

      const [prices, total] = await Promise.all([
        prisma.packageHotelPrice.findMany({
          skip,
          take: limit,
          where,
          include: {
            hotel: {
              include: {
                city: true,
                images: {
                  take: 1,
                },
              },
            },
            package: {
              include: {
                destination: true,
              },
            },
          },
          orderBy: { price: "asc" },
        }),
        prisma.packageHotelPrice.count({ where }),
      ]);

      return {
        prices,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch package hotel prices: ${error}`);
    }
  }

  // Get a specific package hotel price by ID
  static async getById(phid: number) {
    try {
      return await prisma.packageHotelPrice.findUnique({
        where: { phid },
        include: {
          hotel: {
            include: {
              city: true,
              images: true,
            },
          },
          package: {
            include: {
              destination: true,
              itineraries: {
                orderBy: { day: "asc" },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch package hotel price: ${error}`);
    }
  }

  // Get all hotels and prices for a specific package
  static async getByPackage(packageId: number) {
    try {
      return await prisma.packageHotelPrice.findMany({
        where: { packageId },
        include: {
          hotel: {
            include: {
              city: true,
              images: {
                take: 3,
              },
            },
          },
        },
        orderBy: { price: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotels for package: ${error}`);
    }
  }

  // Get all packages and prices for a specific hotel
  static async getByHotel(hotelId: number) {
    try {
      return await prisma.packageHotelPrice.findMany({
        where: { hotelId },
        include: {
          package: {
            include: {
              destination: true,
            },
          },
        },
        orderBy: { price: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch packages for hotel: ${error}`);
    }
  }

  // Get cheapest hotels for a package
  static async getCheapestHotelsForPackage(
    packageId: number,
    limit: number = 5
  ) {
    try {
      return await prisma.packageHotelPrice.findMany({
        where: { packageId },
        take: limit,
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
      });
    } catch (error) {
      throw new Error(`Failed to fetch cheapest hotels for package: ${error}`);
    }
  }

  // Get hotels by star rating for a package
  static async getHotelsByStarRating(packageId: number, starRating: number) {
    try {
      return await prisma.packageHotelPrice.findMany({
        where: {
          packageId,
          hotel: {
            starRating,
          },
        },
        include: {
          hotel: {
            include: {
              city: true,
              images: {
                take: 2,
              },
            },
          },
        },
        orderBy: { price: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotels by star rating: ${error}`);
    }
  }

  // Update a package hotel price
  static async update(phid: number, data: UpdatePackageHotelPriceData) {
    try {
      return await prisma.packageHotelPrice.update({
        where: { phid },
        data,
        include: {
          hotel: {
            include: {
              city: true,
              images: {
                take: 1,
              },
            },
          },
          package: {
            include: {
              destination: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to update package hotel price: ${error}`);
    }
  }

  // Delete a package hotel price
  static async delete(phid: number) {
    try {
      return await prisma.packageHotelPrice.delete({
        where: { phid },
      });
    } catch (error) {
      throw new Error(`Failed to delete package hotel price: ${error}`);
    }
  }

  // Delete by package and hotel combination
  static async deleteByPackageAndHotel(packageId: number, hotelId: number) {
    try {
      return await prisma.packageHotelPrice.delete({
        where: {
          packageId_hotelId: {
            packageId,
            hotelId,
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to delete package hotel price: ${error}`);
    }
  }

  // Bulk create package hotel prices
  static async bulkCreate(data: CreatePackageHotelPriceData[]) {
    try {
      return await prisma.packageHotelPrice.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Failed to create package hotel prices: ${error}`);
    }
  }

  // Delete all prices for a specific package
  static async deleteByPackage(packageId: number) {
    try {
      return await prisma.packageHotelPrice.deleteMany({
        where: { packageId },
      });
    } catch (error) {
      throw new Error(`Failed to delete package hotel prices: ${error}`);
    }
  }

  // Delete all prices for a specific hotel
  static async deleteByHotel(hotelId: number) {
    try {
      return await prisma.packageHotelPrice.deleteMany({
        where: { hotelId },
      });
    } catch (error) {
      throw new Error(`Failed to delete hotel package prices: ${error}`);
    }
  }

  // Get price comparison for multiple packages
  static async getPriceComparison(packageIds: number[]) {
    try {
      const results = await Promise.all(
        packageIds.map(async (packageId) => {
          const [cheapest, mostExpensive, average, count] = await Promise.all([
            prisma.packageHotelPrice.findFirst({
              where: { packageId },
              include: {
                hotel: {
                  select: {
                    name: true,
                    starRating: true,
                  },
                },
              },
              orderBy: { price: "asc" },
            }),
            prisma.packageHotelPrice.findFirst({
              where: { packageId },
              include: {
                hotel: {
                  select: {
                    name: true,
                    starRating: true,
                  },
                },
              },
              orderBy: { price: "desc" },
            }),
            prisma.packageHotelPrice.aggregate({
              where: { packageId },
              _avg: { price: true },
            }),
            prisma.packageHotelPrice.count({
              where: { packageId },
            }),
          ]);

          return {
            packageId,
            cheapest,
            mostExpensive,
            averagePrice: average._avg.price,
            hotelCount: count,
          };
        })
      );

      return results;
    } catch (error) {
      throw new Error(`Failed to get price comparison: ${error}`);
    }
  }

  // Get statistics for package hotel prices
  static async getStatistics() {
    try {
      const [
        totalPrices,
        pricesByStarRating,
        averagePriceByStarRating,
        packageWithMostHotels,
        hotelWithMostPackages,
      ] = await Promise.all([
        prisma.packageHotelPrice.count(),
        prisma.packageHotelPrice.groupBy({
          by: ["hotelId"],
          _count: true,
          _avg: { price: true },
          orderBy: { _count: { hotelId: "desc" } },
          take: 10,
        }),
        prisma.$queryRaw`
          SELECT h."starRating", AVG(php."price") as avg_price, COUNT(*) as count
          FROM "PackageHotelPrice" php
          JOIN "Hotel" h ON php."hotelId" = h."hid"
          GROUP BY h."starRating"
          ORDER BY h."starRating"
        `,
        prisma.packageHotelPrice.groupBy({
          by: ["packageId"],
          _count: true,
          orderBy: { _count: { packageId: "desc" } },
          take: 1,
        }),
        prisma.packageHotelPrice.groupBy({
          by: ["hotelId"],
          _count: true,
          orderBy: { _count: { hotelId: "desc" } },
          take: 1,
        }),
      ]);

      return {
        totalPrices,
        pricesByStarRating,
        averagePriceByStarRating,
        packageWithMostHotels: packageWithMostHotels[0],
        hotelWithMostPackages: hotelWithMostPackages[0],
      };
    } catch (error) {
      throw new Error(`Failed to get package hotel price statistics: ${error}`);
    }
  }

  // Update prices for all hotels in a package (bulk update)
  static async bulkUpdatePackagePrices(
    packageId: number,
    priceMultiplier: number
  ) {
    try {
      const prices = await prisma.packageHotelPrice.findMany({
        where: { packageId },
        select: { phid: true, price: true },
      });

      const updatePromises = prices.map((priceRecord) =>
        prisma.packageHotelPrice.update({
          where: { phid: priceRecord.phid },
          data: { price: priceRecord.price * priceMultiplier },
        })
      );

      return await Promise.all(updatePromises);
    } catch (error) {
      throw new Error(`Failed to bulk update package prices: ${error}`);
    }
  }

  // Get price history (if you want to track price changes over time)
  static async getPriceRange(packageId?: number, hotelId?: number) {
    try {
      const where: any = {};
      if (packageId) where.packageId = packageId;
      if (hotelId) where.hotelId = hotelId;

      const result = await prisma.packageHotelPrice.aggregate({
        where,
        _min: { price: true },
        _max: { price: true },
        _avg: { price: true },
        _count: true,
      });

      return {
        minPrice: result._min.price,
        maxPrice: result._max.price,
        averagePrice: result._avg.price,
        totalRecords: result._count,
      };
    } catch (error) {
      throw new Error(`Failed to get price range: ${error}`);
    }
  }

  // Find available hotels for a package (hotels not yet associated)
  static async getAvailableHotelsForPackage(
    packageId: number,
    cityId?: number
  ) {
    try {
      // Get hotels already associated with this package
      const associatedHotelIds = await prisma.packageHotelPrice.findMany({
        where: { packageId },
        select: { hotelId: true },
      });

      const excludeIds = associatedHotelIds.map((item) => item.hotelId);

      const where: any = {
        hid: { notIn: excludeIds },
      };

      if (cityId) {
        where.cityId = cityId;
      }

      return await prisma.hotel.findMany({
        where,
        include: {
          city: true,
          images: {
            take: 1,
          },
        },
        orderBy: { starRating: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to get available hotels: ${error}`);
    }
  }
}
