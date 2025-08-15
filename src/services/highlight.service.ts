import { prisma } from "@/lib/prisma";

export class HighlightService {
  // Create new highlight
  static async create(data: { text: string }) {
    try {
      return await prisma.highlight.create({ data });
    } catch (error) {
      throw new Error(`Failed to create highlight: ${error}`);
    }
  }

  // Get all highlights (supports pagination and filtering)
  static async getAll(
    options: {
      page?: number;
      limit?: number;
      text?: string;
      sortBy?: "hlid" | "createdAt" | "updatedAt" | "text";
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
        prisma.highlight.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.highlight.count({ where }),
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
      throw new Error(`Failed to fetch highlights: ${error}`);
    }
  }

  // Get single highlight by ID
  static async getById(hlid: number) {
    try {
      return await prisma.highlight.findUnique({ where: { hlid } });
    } catch (error) {
      throw new Error(`Failed to fetch highlight: ${error}`);
    }
  }

  // Get single highlight by text
  static async getByText(text: string) {
    try {
      return await prisma.highlight.findUnique({ where: { text } });
    } catch (error) {
      throw new Error(`Failed to fetch highlight by text: ${error}`);
    }
  }

  // Update highlight
  static async update(hlid: number, data: { text?: string }) {
    try {
      return await prisma.highlight.update({
        where: { hlid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update highlight: ${error}`);
    }
  }

  // Delete highlight
  static async delete(hlid: number) {
    try {
      return await prisma.highlight.delete({ where: { hlid } });
    } catch (error) {
      throw new Error(`Failed to delete highlight: ${error}`);
    }
  }
}

export default HighlightService;
