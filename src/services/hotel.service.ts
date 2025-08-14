import { getFieldOptions } from "@/lib/helper";
import { prisma } from "@/lib/prisma";

export class HotelService {
  static async create(data: {
    name: string;
    description: string;
    starRating: number;
    cityId: number;
    images?: { url: string; caption?: string }[];
  }) {
    try {
      const { images, ...hotelData } = data;
      return await prisma.hotel.create({
        data: {
          ...hotelData,
          images: images
            ? {
                create: images,
              }
            : undefined,
        },
        include: {
          city: true,
          images: true,
          prices: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create hotel: ${error}`);
    }
  }

  static async getNameId() {
    try {
      const hotels = await prisma.hotel.findMany();
      const hotelData = getFieldOptions(hotels, "hid");
      return {
        data: hotelData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch destinations name and id: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      cityId?: number;
      starRating?: number;
      minStarRating?: number;
      maxStarRating?: number;
      name?: string;
      sortBy?: "name" | "starRating" | "createdAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        cityId,
        starRating,
        minStarRating,
        maxStarRating,
        name,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (cityId) {
        where.cityId = cityId;
      }

      if (starRating) {
        where.starRating = starRating;
      } else {
        if (minStarRating || maxStarRating) {
          where.starRating = {};
          if (minStarRating) where.starRating.gte = minStarRating;
          if (maxStarRating) where.starRating.lte = maxStarRating;
        }
      }

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const [hotels, total] = await Promise.all([
        prisma.hotel.findMany({
          where,
          skip,
          take: limit,
          include: {
            city: {
              include: {
                destination: true,
              },
            },
            images: true,
            prices: {
              include: {
                package: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.hotel.count({ where }),
      ]);

      return {
        data: hotels,
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
      throw new Error(`Failed to fetch hotels: ${error}`);
    }
  }

  static async getById(hid: number) {
    try {
      const hotel = await prisma.hotel.findUnique({
        where: { hid },
        include: {
          city: {
            include: {
              destination: true,
            },
          },
          images: true,
          prices: {
            include: {
              package: true,
            },
          },
        },
      });

      if (!hotel) {
        throw new Error("Hotel not found");
      }

      return hotel;
    } catch (error) {
      throw new Error(`Failed to fetch hotel: ${error}`);
    }
  }

  static async getByCity(cityId: number) {
    try {
      return await prisma.hotel.findMany({
        where: { cityId },
        include: {
          images: true,
          prices: {
            include: {
              package: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotels by city: ${error}`);
    }
  }

  static async getByStarRating(starRating: number) {
    try {
      return await prisma.hotel.findMany({
        where: { starRating },
        include: {
          city: true,
          images: true,
          prices: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotels by star rating: ${error}`);
    }
  }

  static async getByName(name: string) {
    try {
      return await prisma.hotel.findMany({
        where: { name },
        include: {
          city: true,
          images: true,
          prices: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotel by name: ${error}`);
    }
  }

  static async update(
    hid: number,
    data: {
      name?: string;
      description?: string;
      starRating?: number;
    }
  ) {
    try {
      return await prisma.hotel.update({
        where: { hid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update hotel: ${error}`);
    }
  }

  static async delete(hid: number) {
    try {
      return await prisma.hotel.delete({
        where: { hid },
      });
    } catch (error) {
      throw new Error(`Failed to delete hotel: ${error}`);
    }
  }

  static async searchByName(name: string) {
    try {
      const whereClause = name
        ? {
            OR: [{ name: { contains: name, mode: "insensitive" } }],
          }
        : {};
      return await prisma.hotel.findMany({
        where: whereClause,
        include: {
          city: true,
          images: true,
          prices: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to search hotels by name: ${error}`);
    }
  }

  static async filterByStarRating(minRating: number, maxRating?: number) {
    try {
      const where: any = {
        starRating: {
          gte: minRating,
        },
      };

      if (maxRating) {
        where.starRating.lte = maxRating;
      }

      return await prisma.hotel.findMany({
        where,
        include: {
          city: true,
          images: true,
          prices: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to filter hotels by star rating: ${error}`);
    }
  }
}

export default HotelService;
