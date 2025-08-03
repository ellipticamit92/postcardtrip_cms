import { prisma } from "@/lib/prisma";

export interface CreateHotelImageData {
  url: string;
  caption?: string;
  hotelId: number;
}

export interface UpdateHotelImageData {
  url?: string;
  caption?: string;
}

export class HotelImageService {
  // Create a new hotel image
  static async create(data: CreateHotelImageData) {
    try {
      return await prisma.hotelImage.create({
        data,
        include: {
          hotel: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create hotel image: ${error}`);
    }
  }

  // Get all images for a specific hotel
  static async getByHotelId(hotelId: number) {
    try {
      return await prisma.hotelImage.findMany({
        where: { hotelId },
        orderBy: { hiid: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotel images: ${error}`);
    }
  }

  // Get a specific hotel image by ID
  static async getById(hiid: number) {
    try {
      return await prisma.hotelImage.findUnique({
        where: { hiid },
        include: {
          hotel: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch hotel image: ${error}`);
    }
  }

  // Update a hotel image
  static async update(hiid: number, data: UpdateHotelImageData) {
    try {
      return await prisma.hotelImage.update({
        where: { hiid },
        data,
        include: {
          hotel: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update hotel image: ${error}`);
    }
  }

  // Delete a hotel image
  static async delete(hiid: number) {
    try {
      return await prisma.hotelImage.delete({
        where: { hiid },
      });
    } catch (error) {
      throw new Error(`Failed to delete hotel image: ${error}`);
    }
  }

  // Get all hotel images with pagination
  static async getAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [images, total] = await Promise.all([
        prisma.hotelImage.findMany({
          skip,
          take: limit,
          include: {
            hotel: true,
          },
          orderBy: { hiid: "desc" },
        }),
        prisma.hotelImage.count(),
      ]);

      return {
        images,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch hotel images: ${error}`);
    }
  }

  // Bulk create hotel images
  static async bulkCreate(data: CreateHotelImageData[]) {
    try {
      return await prisma.hotelImage.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Failed to create hotel images: ${error}`);
    }
  }

  // Delete all images for a specific hotel
  static async deleteByHotelId(hotelId: number) {
    try {
      return await prisma.hotelImage.deleteMany({
        where: { hotelId },
      });
    } catch (error) {
      throw new Error(`Failed to delete hotel images: ${error}`);
    }
  }
}
