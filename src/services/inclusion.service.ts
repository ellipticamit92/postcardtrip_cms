import { prisma } from "@/lib/prisma";

export class InclusionService {
  static async create(data: { text: string }) {
    try {
      return await prisma.inclusion.create({ data });
    } catch (error) {
      throw new Error(`Failed to create inclusion: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      text?: string;
      sortBy?: "lid" | "createdAt" | "updatedAt" | "text";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 20,
        text,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (text) where.text = { contains: text, mode: "insensitive" };

      const [data, total] = await Promise.all([
        prisma.inclusion.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.inclusion.count({ where }),
      ]);

      return {
        data,
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
      throw new Error(`Failed to fetch inclusions: ${error}`);
    }
  }

  static async getById(lid: number) {
    try {
      return await prisma.inclusion.findUnique({ where: { lid } });
    } catch (error) {
      throw new Error(`Failed to fetch inclusion: ${error}`);
    }
  }

  static async getByText(text: string) {
    try {
      return await prisma.inclusion.findUnique({ where: { text } });
    } catch (error) {
      throw new Error(`Failed to fetch inclusion by text: ${error}`);
    }
  }

  static async update(lid: number, data: { text?: string }) {
    try {
      return await prisma.inclusion.update({
        where: { lid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update inclusion: ${error}`);
    }
  }

  static async delete(lid: number) {
    try {
      return await prisma.inclusion.delete({ where: { lid } });
    } catch (error) {
      throw new Error(`Failed to delete inclusion: ${error}`);
    }
  }
}

export default InclusionService;
