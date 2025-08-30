import { getFieldOptionsNum } from "@/lib/helper";
import { prisma } from "@/lib/prisma";

export class ExclusionService {
  static async create(data: { text: string }) {
    try {
      return await prisma.exclusion.create({ data });
    } catch (error) {
      throw new Error(`Failed to create exclusion: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      text?: string;
      sortBy?: "eid" | "createdAt" | "updatedAt" | "text";
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
        prisma.exclusion.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.exclusion.count({ where }),
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
      throw new Error(`Failed to fetch exclusions: ${error}`);
    }
  }

  static async getById(eid: number) {
    try {
      return await prisma.exclusion.findUnique({ where: { eid } });
    } catch (error) {
      throw new Error(`Failed to fetch exclusion: ${error}`);
    }
  }

  static async getByText(text: string) {
    try {
      return await prisma.exclusion.findUnique({ where: { text } });
    } catch (error) {
      throw new Error(`Failed to fetch exclusion by text: ${error}`);
    }
  }

  static async update(eid: number, data: { text?: string }) {
    try {
      return await prisma.exclusion.update({
        where: { eid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update exclusion: ${error}`);
    }
  }

  static async delete(eid: number) {
    try {
      return await prisma.exclusion.delete({ where: { eid } });
    } catch (error) {
      throw new Error(`Failed to delete exclusion: ${error}`);
    }
  }

  static async getNameId() {
    try {
      const exclusion = await prisma.exclusion.findMany({
        select: { eid: true, text: true },
        orderBy: { text: "asc" },
      });

      const exclusionData = getFieldOptionsNum(exclusion, "eid", "text");
      return {
        data: exclusionData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch tours name and id: ${error}`);
    }
  }
}

export default ExclusionService;
