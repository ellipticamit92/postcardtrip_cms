import { getFieldOptions } from "@/lib/helper";
import { prisma } from "@/lib/prisma";

export class PackageService {
  static async create(data: {
    name: string;
    basePrice: number;
    day: number;
    night: number;
    description: string;
    destinationId: number;
    hotelPrices?: { hotelId: number; price: number }[];
    imageUrl?: string;
    popular?: boolean;
    overview?: string;
    originalPrice?: number;
    featured?: boolean;
    heroTitle?: string;
    text?: string;
    rating?: string;
    tours: number[];
  }) {
    try {
      const { hotelPrices, ...packageData } = data;
      return await prisma.package.create({
        data: {
          ...packageData,
          tours: {
            connect: data.tours.map((tid) => ({ tid })), // 👈 connect multiple tours
          },
          hotelPrices: hotelPrices
            ? {
                create: hotelPrices,
              }
            : undefined,
        },
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
      throw new Error(`Failed to create package: ${error}`);
    }
  }

  static async getNameId() {
    try {
      const packages = await prisma.package.findMany();
      const pagkagesData = getFieldOptions(packages, "pid");
      return {
        data: pagkagesData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch destinations name and id: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      destinationId?: number;
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
            itineraries: true,
            tours: true,
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
          itineraries: true,
          tours: true,
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
          itineraries: true,
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

  static async getByName(name: string) {
    try {
      return await prisma.package.findUnique({
        where: { name },
        select: {
          name: true,
          pid: true,
          basePrice: true,
          originalPrice: true,
          day: true,
          night: true,
          description: true,
          imageUrl: true,
          popular: true,
          overview: true,
          featured: true,
          rating: true,
          heroTitle: true,
          destination: {
            select: {
              country: true,
            },
          },
          itineraries: true,
          hotelPrices: true,
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
      popular?: boolean;
      tourId: number;
      destinationId?: number;
      imageUrl?: string;
      day?: number;
      night?: number;
      overview?: string;
      originalPrice?: number;
      featured?: boolean;
      heroTitle?: string;
      text?: string;
      rating?: string;
      tours: string[];
    }
  ) {
    try {
      return await prisma.package.update({
        where: { pid },
        data: {
          ...data,
          tours: {
            set: [],
            connect: data.tours?.map((id: string) => ({
              tid: Number(id),
            })),
          },
        },
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
          itineraries: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch packages by duration: ${error}`);
    }
  }

  static async getPopular() {
    try {
      return await prisma.package.findMany({
        where: { popular: true },
        orderBy: {
          updatedAt: "desc",
        },
        take: 3,
      });
    } catch (error) {
      throw new Error(`Failed to fetch popular packages: ${error}`);
    }
  }
}

export default PackageService;
