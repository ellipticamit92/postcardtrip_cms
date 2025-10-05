import { HighlightsAIResponseType } from "@/app/api/auth/ai-generate/highlights/route";
import { getFieldOptionsNum, getNameValueOptions } from "@/lib/helper";
import { prisma } from "@/lib/prisma";

export class HighlightService {
  // Create new highlight
  // static async create(data: { tit: string }) {
  //   try {
  //     return await prisma.highlight.create({ data });
  //   } catch (error) {
  //     throw new Error(`Failed to create highlight: ${error}`);
  //   }
  // }

  static async saveAIData(data: HighlightsAIResponseType[]) {
    try {
      return await prisma.highlight.createMany({
        data: data,
        skipDuplicates: true, // optional: skips cities that already exist
      });
    } catch (error) {
      throw new Error(`Failed to create highlight: ${error}`);
    }
  }

  // Get all highlights (supports pagination and filtering)
  static async getAll(
    options: {
      page?: number;
      limit?: number;
      title?: string;
      sortBy?: "hlid" | "createdAt" | "updatedAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 20,
        title,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (title) where.title = { contains: title, mode: "insensitive" };

      const [data, total] = await Promise.all([
        prisma.highlight.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            destination: {
              select: {
                did: true,
                name: true,
              },
            },
          },
        }),
        prisma.highlight.count({ where }),
      ]);

      if (!data || data.length === 0) {
        return {
          data: [],
          message: "No highlights found.",
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: page > 1,
          },
        };
      }

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
  // static async getByText(text: string) {
  //   try {
  //     return await prisma.highlight.findUnique({ where: { text } });
  //   } catch (error) {
  //     throw new Error(`Failed to fetch highlight by text: ${error}`);
  //   }
  // }

  // Update highlight
  // static async update(hlid: number, data: { text?: string }) {
  //   try {
  //     return await prisma.highlight.update({
  //       where: { hlid },
  //       data,
  //     });
  //   } catch (error) {
  //     throw new Error(`Failed to update highlight: ${error}`);
  //   }
  // }

  // Delete highlight
  static async delete(hlid: number) {
    try {
      return await prisma.highlight.delete({ where: { hlid } });
    } catch (error) {
      throw new Error(`Failed to delete highlight: ${error}`);
    }
  }

  static async getNameId() {
    try {
      const highlight = await prisma.highlight.findMany({
        select: { hlid: true, title: true },
        orderBy: { title: "asc" },
      });

      const highlightData = getFieldOptionsNum(highlight, "hlid", "title");
      return {
        data: highlightData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch tours name and id: ${error}`);
    }
  }

  static async getNameValue() {
    try {
      const highlight = await prisma.highlight.findMany({
        select: { hlid: true, title: true },
        orderBy: { title: "asc" },
      });

      const highlightData = getNameValueOptions(highlight, "title");
      return {
        data: highlightData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch destinations name and id: ${error}`);
    }
  }
}

export default HighlightService;
