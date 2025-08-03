import { prisma } from "@/lib/prisma";

export interface CreateHotelData {
  name: string;
  description: string;
  starRating: number;
  cityId: number;
}

export interface UpdateHotelData {
  name?: string;
  description?: string;
  starRating?: number;
  cityId?: number;
}

export interface HotelFilters {
  cityId?: number;
  starRating?: number;
  minStarRating?: number;
  maxStarRating?: number;
  search?: string;
}

export class HotelService {
  // Create a new hotel
  static async create(data: CreateHotelData) {
    try {
      return await prisma.hotel.create({
        data,
        include: {
          city: true,
          images: true,
          prices: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Hotel with this name already exists");
      }
      throw new Error(`Failed to create hotel: ${error}`);
    }
  }

  // Get all hotels with filtering and pagination
  static async getAll(
    page: number = 1,
    limit: number = 10,
    filters: HotelFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      // Apply filters
      if (filters.cityId) {
        where.cityId = filters.cityId;
      }

      if (filters.starRating) {
        where.starRating = filters.starRating;
      }

      if (filters.minStarRating || filters.maxStarRating) {
        where.starRating = {};
        if (filters.minStarRating) {
          where.starRating.gte = filters.minStarRating;
        }
        if (filters.maxStarRating) {
          where.starRating.lte = filters.maxStarRating;
        }
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      const [hotels, total] = await Promise.all([
        prisma.hotel.findMany({
          skip,
          take: limit,
          where,
          include: {
            city: true,
            images: {
              take: 5, // Limit images for performance
              orderBy: { hiid: "asc" },
            },
            prices: {
              take: 3, // Limit prices for performance
              orderBy: { phid: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.hotel.count({ where }),
      ]);

      return {
        hotels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch hotels: ${error}`);
    }
  }

  // Get a specific hotel by ID
  static async getById(hid: number) {
    try {
      return await prisma.hotel.findUnique({
        where: { hid },
        include: {
          city: true,
          images: {
            orderBy: { hiid: "asc" },
          },
          prices: {
            include: {
              package: true,
            },
            orderBy: { phid: "desc" },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotel: ${error}`);
    }
  }

  // Get hotel by name
  static async getByName(name: string) {
    try {
      return await prisma.hotel.findUnique({
        where: { name },
        include: {
          city: true,
          images: true,
          prices: {
            include: {
              package: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotel: ${error}`);
    }
  }

  // Get hotels by city
  static async getByCity(cityId: number, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [hotels, total] = await Promise.all([
        prisma.hotel.findMany({
          where: { cityId },
          skip,
          take: limit,
          include: {
            city: true,
            images: {
              take: 3,
            },
            prices: {
              take: 1,
              orderBy: { phid: "desc" },
            },
          },
          orderBy: { starRating: "desc" },
        }),
        prisma.hotel.count({ where: { cityId } }),
      ]);

      return {
        hotels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch hotels by city: ${error}`);
    }
  }

  // Get hotels by star rating
  static async getByStarRating(
    starRating: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      const [hotels, total] = await Promise.all([
        prisma.hotel.findMany({
          where: { starRating },
          skip,
          take: limit,
          include: {
            city: true,
            images: {
              take: 3,
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.hotel.count({ where: { starRating } }),
      ]);

      return {
        hotels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch hotels by star rating: ${error}`);
    }
  }

  // Update a hotel
  static async update(hid: number, data: UpdateHotelData) {
    try {
      return await prisma.hotel.update({
        where: { hid },
        data,
        include: {
          city: true,
          images: true,
          prices: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Hotel with this name already exists");
      }
      throw new Error(`Failed to update hotel: ${error}`);
    }
  }

  // Delete a hotel
  static async delete(hid: number) {
    try {
      // Delete related records first (if not using cascade)
      await prisma.hotelImage.deleteMany({
        where: { hotelId: hid },
      });

      await prisma.packageHotelPrice.deleteMany({
        where: { hotelId: hid },
      });

      return await prisma.hotel.delete({
        where: { hid },
      });
    } catch (error) {
      throw new Error(`Failed to delete hotel: ${error}`);
    }
  }

  // Search hotels
  static async search(query: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const whereClause = query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { city: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {};

      const [hotels, total] = await Promise.all([
        prisma.hotel.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            city: true,
            images: {
              take: 3,
            },
          },
          orderBy: { starRating: "desc" },
        }),
        prisma.hotel.count({
          where: whereClause,
        }),
      ]);

      return {
        hotels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to search hotels: ${error}`);
    }
  }

  // Get hotel statistics
  static async getStatistics() {
    try {
      const [totalHotels, hotelsByStarRating, hotelsByCity, averageStarRating] =
        await Promise.all([
          prisma.hotel.count(),
          prisma.hotel.groupBy({
            by: ["starRating"],
            _count: true,
            orderBy: { starRating: "asc" },
          }),
          prisma.hotel.groupBy({
            by: ["cityId"],
            _count: true,
            orderBy: { _count: { cityId: "desc" } },
            take: 10,
          }),
          prisma.hotel.aggregate({
            _avg: { starRating: true },
          }),
        ]);

      // Get city names for the grouped data
      const cityIds = hotelsByCity.map((item) => item.cityId);
      const cities = await prisma.city.findMany({
        where: { cid: { in: cityIds } },
        select: { cid: true, name: true },
      });

      const hotelsWithCityNames = hotelsByCity.map((item) => ({
        ...item,
        cityName:
          cities.find((city) => city.cid === item.cityId)?.name || "Unknown",
      }));

      return {
        totalHotels,
        hotelsByStarRating,
        hotelsByCity: hotelsWithCityNames,
        averageStarRating: averageStarRating._avg.starRating,
      };
    } catch (error) {
      throw new Error(`Failed to get hotel statistics: ${error}`);
    }
  }

  // Bulk create hotels
  static async bulkCreate(data: CreateHotelData[]) {
    try {
      return await prisma.hotel.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Failed to create hotels: ${error}`);
    }
  }

  // Get recently added hotels
  static async getRecent(limit: number = 5) {
    try {
      return await prisma.hotel.findMany({
        take: limit,
        include: {
          city: true,
          images: {
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch recent hotels: ${error}`);
    }
  }

  // Get top-rated hotels
  static async getTopRated(limit: number = 10) {
    try {
      return await prisma.hotel.findMany({
        take: limit,
        include: {
          city: true,
          images: {
            take: 1,
          },
        },
        orderBy: [{ starRating: "desc" }, { createdAt: "desc" }],
      });
    } catch (error) {
      throw new Error(`Failed to fetch top-rated hotels: ${error}`);
    }
  }
}
