import { prisma } from "@/lib/prisma";

export class CityService {
  static async create(data: {
    name: string;
    description: string;
    destinationId: number;
  }) {
    try {
      return await prisma.city.create({
        data,
        include: {
          destination: true,
          hotels: true,
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create city: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      destinationId?: number;
      name?: string;
      sortBy?: "name" | "createdAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        destinationId,
        name,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (destinationId) {
        where.destinationId = destinationId;
      }

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const [cities, total] = await Promise.all([
        prisma.city.findMany({
          where,
          skip,
          take: limit,
          include: {
            destination: true,
            hotels: {
              include: {
                images: true,
              },
            },
            packages: true,
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.city.count({ where }),
      ]);

      return {
        data: cities,
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
      throw new Error(`Failed to fetch cities: ${error}`);
    }
  }

  static async getById(cid: number) {
    try {
      const city = await prisma.city.findUnique({
        where: { cid },
        include: {
          destination: true,
          hotels: {
            include: {
              images: true,
              prices: true,
            },
          },
          packages: {
            include: {
              itineraries: true,
            },
          },
        },
      });

      if (!city) {
        throw new Error("City not found");
      }

      return city;
    } catch (error) {
      throw new Error(`Failed to fetch city: ${error}`);
    }
  }

  static async getByDestination(destinationId: number) {
    try {
      return await prisma.city.findMany({
        where: { destinationId },
        include: {
          hotels: {
            include: {
              images: true,
            },
          },
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch cities by destination: ${error}`);
    }
  }

  static async getByName(name: string) {
    try {
      return await prisma.city.findUnique({
        where: { name },
        include: {
          destination: true,
          hotels: true,
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch city by name: ${error}`);
    }
  }

  static async update(
    cid: number,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    try {
      return await prisma.city.update({
        where: { cid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update city: ${error}`);
    }
  }

  static async delete(cid: number) {
    try {
      return await prisma.city.delete({
        where: { cid },
      });
    } catch (error) {
      throw new Error(`Failed to delete city: ${error}`);
    }
  }

  static async searchByName(name: string) {
    try {
      const whereClause = name
        ? {
            OR: [{ name: { contains: name, mode: "insensitive" } }],
          }
        : {};

      return await prisma.city.findMany({
        where: whereClause,
        include: {
          destination: true,
          hotels: true,
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to search cities by name: ${error}`);
    }
  }
}

export default CityService;
