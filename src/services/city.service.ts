import { CityAIResponseType } from "@/app/api/auth/ai-generate/cities/route";
import { CityFormValues } from "@/components/organisms/city/CityForm";
import { getFieldOptionsNum, getNameValueOptions } from "@/lib/helper";
import { prisma } from "@/lib/prisma";

export class CityService {
  static async create(data: CityFormValues) {
    try {
      return await prisma.city.create({
        data,
      });
    } catch (error) {
      throw new Error(`Failed to create city: ${error}`);
    }
  }

  static async saveAIData(data: CityAIResponseType[]) {
    try {
      return await prisma.city.createMany({
        data: data,
        skipDuplicates: true, // optional: skips cities that already exist
      });
    } catch (error) {
      throw new Error(`Failed to create city: ${error}`);
    }
  }

  static async getNameId() {
    try {
      const cities = await prisma.city.findMany({
        select: {
          cid: true,
          name: true,
          createdAt: true,
        },
      });
      const cityData = getFieldOptionsNum(cities, "cid");
      return {
        data: cityData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch destinations name and id: ${error}`);
    }
  }

  static async getNameValue() {
    try {
      const cities = await prisma.city.findMany({
        select: {
          cid: true,
          name: true,
          createdAt: true,
        },
      });
      const cityData = getNameValueOptions(cities, "name");
      return {
        data: cityData,
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
            hotels: {
              include: {
                images: true,
              },
            },
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
          hotels: {
            include: {
              images: true,
              prices: true,
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

  static async getByName(name: string) {
    try {
      return await prisma.city.findUnique({
        where: { name },
        include: {
          hotels: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch city by name: ${error}`);
    }
  }

  static async update(cid: number, data: CityFormValues) {
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
          hotels: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to search cities by name: ${error}`);
    }
  }

  static async getOptionsByDestinationId(did: number) {
    try {
      const cities = await prisma.city.findMany({
        select: { cid: true, name: true },
        orderBy: { cid: "asc" },
        where: { destinationId: did },
      });

      const citiesData = getNameValueOptions(cities, "name");
      return {
        data: citiesData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch tours name and id: ${error}`);
    }
  }
}

export default CityService;
