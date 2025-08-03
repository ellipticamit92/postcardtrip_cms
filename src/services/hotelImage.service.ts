import { prisma } from "@/lib/prisma";

export class HotelImageService {
  static async create(data: {
    url: string;
    caption?: string;
    hotelId: number;
  }) {
    try {
      return await prisma.hotelImage.create({
        data,
        include: {
          hotel: {
            include: {
              city: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to create hotel image: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      hotelId?: number;
      url?: string;
      sortBy?: "hiid" | "createdAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        hotelId,
        url,
        sortBy = "hiid",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (hotelId) {
        where.hotelId = hotelId;
      }

      if (url) {
        where.url = {
          contains: url,
          mode: "insensitive",
        };
      }

      const [images, total] = await Promise.all([
        prisma.hotelImage.findMany({
          where,
          skip,
          take: limit,
          include: {
            hotel: {
              include: {
                city: {
                  include: {
                    destination: true,
                  },
                },
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.hotelImage.count({ where }),
      ]);

      return {
        data: images,
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
      throw new Error(`Failed to fetch hotel images: ${error}`);
    }
  }

  static async getById(hiid: number) {
    try {
      const image = await prisma.hotelImage.findUnique({
        where: { hiid },
        include: {
          hotel: {
            include: {
              city: {
                include: {
                  destination: true,
                },
              },
            },
          },
        },
      });

      if (!image) {
        throw new Error("Hotel image not found");
      }

      return image;
    } catch (error) {
      throw new Error(`Failed to fetch hotel image: ${error}`);
    }
  }

  static async getByHotel(hotelId: number) {
    try {
      return await prisma.hotelImage.findMany({
        where: { hotelId },
        orderBy: {
          hiid: "asc",
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch images by hotel: ${error}`);
    }
  }

  static async update(
    hiid: number,
    data: {
      url?: string;
      caption?: string;
    }
  ) {
    try {
      return await prisma.hotelImage.update({
        where: { hiid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update hotel image: ${error}`);
    }
  }

  static async delete(hiid: number) {
    try {
      return await prisma.hotelImage.delete({
        where: { hiid },
      });
    } catch (error) {
      throw new Error(`Failed to delete hotel image: ${error}`);
    }
  }

  static async bulkCreate(
    hotelId: number,
    images: { url: string; caption?: string }[]
  ) {
    try {
      return await prisma.hotelImage.createMany({
        data: images.map((img) => ({
          ...img,
          hotelId,
        })),
      });
    } catch (error) {
      throw new Error(`Failed to bulk create hotel images: ${error}`);
    }
  }

  static async deleteByHotel(hotelId: number) {
    try {
      return await prisma.hotelImage.deleteMany({
        where: { hotelId },
      });
    } catch (error) {
      throw new Error(`Failed to delete images by hotel: ${error}`);
    }
  }

  static async getByCity(cityId: number) {
    try {
      return await prisma.hotelImage.findMany({
        where: {
          hotel: {
            cityId,
          },
        },
        include: {
          hotel: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotel images by city: ${error}`);
    }
  }

  static async searchByCaption(caption: string) {
    try {
      const whereClause = caption
        ? {
            OR: [{ caption: { contains: caption, mode: "insensitive" } }],
          }
        : {};
      return await prisma.hotelImage.findMany({
        where: whereClause,
        include: {
          hotel: {
            include: {
              city: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to search images by caption: ${error}`);
    }
  }
}

export default HotelImageService;
