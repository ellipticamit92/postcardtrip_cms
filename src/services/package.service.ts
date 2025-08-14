import { prisma } from "@/lib/prisma";

export class PackageService {
  static async create(data: {
    name: string;
    basePrice: number;
    day: number;
    night: number;
    description: string;
    destinationId: number;
    cityId: number;
    hotelPrices?: { hotelId: number; price: number }[];
    imageUrl?: string;
  }) {
    try {
      const { hotelPrices, ...packageData } = data;
      return await prisma.package.create({
        data: {
          ...packageData,
          hotelPrices: hotelPrices
            ? {
                create: hotelPrices,
              }
            : undefined,
        },
        include: {
          destination: true,
          city: true,
          itineraries: true,
          hotelPrices: {
            include: {
              hotel: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to create package: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      destinationId?: number;
      cityId?: number;
      minPrice?: number;
      maxPrice?: number;
      minDuration?: number;
      maxDuration?: number;
      name?: string;
      sortBy?: "name" | "basePrice" | "durationDays" | "createdAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        destinationId,
        cityId,
        minPrice,
        maxPrice,
        minDuration,
        maxDuration,
        name,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (destinationId) {
        where.destinationId = destinationId;
      }

      if (cityId) {
        where.cityId = cityId;
      }

      if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice.gte = minPrice;
        if (maxPrice) where.basePrice.lte = maxPrice;
      }

      if (minDuration || maxDuration) {
        where.durationDays = {};
        if (minDuration) where.durationDays.gte = minDuration;
        if (maxDuration) where.durationDays.lte = maxDuration;
      }

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const [packages, total] = await Promise.all([
        prisma.package.findMany({
          where,
          skip,
          take: limit,
          include: {
            destination: true,
            city: true,
            itineraries: {
              include: {
                highlights: true,
                inclusions: true,
                exclusions: true,
                places: {
                  include: {
                    images: true,
                  },
                },
              },
            },
            hotelPrices: {
              include: {
                hotel: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.package.count({ where }),
      ]);

      return {
        data: packages,
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
      throw new Error(`Failed to fetch packages: ${error}`);
    }
  }

  static async getById(pid: number) {
    try {
      const packageData = await prisma.package.findUnique({
        where: { pid },
        include: {
          destination: true,
          city: true,
          itineraries: {
            include: {
              highlights: true,
              inclusions: true,
              exclusions: true,
              places: {
                include: {
                  images: true,
                },
              },
            },
            orderBy: {
              day: "asc",
            },
          },
          hotelPrices: {
            include: {
              hotel: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });

      if (!packageData) {
        throw new Error("Package not found");
      }

      return packageData;
    } catch (error) {
      throw new Error(`Failed to fetch package: ${error}`);
    }
  }

  static async getByDestination(destinationId: number) {
    try {
      return await prisma.package.findMany({
        where: { destinationId },
        include: {
          city: true,
          itineraries: {
            include: {
              highlights: true,
              inclusions: true,
              exclusions: true,
              places: {
                include: {
                  images: true,
                },
              },
            },
          },
          hotelPrices: {
            include: {
              hotel: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch packages by destination: ${error}`);
    }
  }

  static async getByCity(cityId: number) {
    try {
      return await prisma.package.findMany({
        where: { cityId },
        include: {
          destination: true,
          itineraries: true,
          hotelPrices: {
            include: {
              hotel: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch packages by city: ${error}`);
    }
  }

  static async getByName(name: string) {
    try {
      return await prisma.package.findUnique({
        where: { name },
        include: {
          destination: true,
          city: true,
          itineraries: true,
          hotelPrices: {
            include: {
              hotel: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch package by name: ${error}`);
    }
  }

  static async update(
    pid: number,
    data: {
      name?: string;
      basePrice?: number;
      durationDays?: number;
      description?: string;
    }
  ) {
    try {
      return await prisma.package.update({
        where: { pid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update package: ${error}`);
    }
  }

  static async delete(pid: number) {
    try {
      return await prisma.package.delete({
        where: { pid },
      });
    } catch (error) {
      throw new Error(`Failed to delete package: ${error}`);
    }
  }

  static async search(filters: {
    destination?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    starRating?: number;
    page?: number;
    limit?: number;
  }) {
    try {
      const { page = 1, limit = 10, ...searchFilters } = filters;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (searchFilters.destination) {
        where.destination = {
          name: {
            contains: searchFilters.destination,
            mode: "insensitive",
          },
        };
      }

      if (searchFilters.city) {
        where.city = {
          name: {
            contains: searchFilters.city,
            mode: "insensitive",
          },
        };
      }

      if (searchFilters.minPrice || searchFilters.maxPrice) {
        where.basePrice = {};
        if (searchFilters.minPrice)
          where.basePrice.gte = searchFilters.minPrice;
        if (searchFilters.maxPrice)
          where.basePrice.lte = searchFilters.maxPrice;
      }

      if (searchFilters.minDuration || searchFilters.maxDuration) {
        where.durationDays = {};
        if (searchFilters.minDuration)
          where.durationDays.gte = searchFilters.minDuration;
        if (searchFilters.maxDuration)
          where.durationDays.lte = searchFilters.maxDuration;
      }

      if (searchFilters.starRating) {
        where.hotelPrices = {
          some: {
            hotel: {
              starRating: {
                gte: searchFilters.starRating,
              },
            },
          },
        };
      }

      const [packages, total] = await Promise.all([
        prisma.package.findMany({
          where,
          skip,
          take: limit,
          include: {
            destination: true,
            city: true,
            hotelPrices: {
              include: {
                hotel: {
                  include: {
                    images: true,
                  },
                },
              },
            },
            itineraries: {
              take: 1,
              include: {
                highlights: true,
              },
            },
          },
        }),
        prisma.package.count({ where }),
      ]);

      return {
        data: packages,
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
      throw new Error(`Failed to search packages: ${error}`);
    }
  }

  static async getByPriceRange(minPrice: number, maxPrice: number) {
    try {
      return await prisma.package.findMany({
        where: {
          basePrice: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
        include: {
          destination: true,
          city: true,
          hotelPrices: {
            include: {
              hotel: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch packages by price range: ${error}`);
    }
  }

  static async getByDay(day: number) {
    try {
      return await prisma.package.findMany({
        where: { day },
        include: {
          destination: true,
          city: true,
          itineraries: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch packages by duration: ${error}`);
    }
  }
}

export default PackageService;
