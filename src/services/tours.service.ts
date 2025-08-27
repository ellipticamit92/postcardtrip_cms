import { prisma } from "@/lib/prisma";

export class TourService {
  // Create a new tour
  static async create(data: {
    text: string;
    icon?: string;
    description: string;
  }) {
    try {
      return await prisma.tours.create({ data });
    } catch (error) {
      throw new Error(`Failed to create tour: ${error}`);
    }
  }

  // List tours with pagination, optional text filter, and sorting
  static async getAll(
    options: {
      page?: number;
      limit?: number;
      text?: string;
      sortBy?: "tid" | "createdAt" | "updatedAt" | "text";
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
      const where: Record<string, any> = {};
      if (text) where.text = { contains: text, mode: "insensitive" };

      const [data, total] = await Promise.all([
        prisma.tours.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.tours.count({ where }),
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
      throw new Error(`Failed to fetch tours: ${error}`);
    }
  }

  // Get a single tour by ID
  static async getById(tid: number) {
    try {
      return await prisma.tours.findUnique({ where: { tid } });
    } catch (error) {
      throw new Error(`Failed to fetch tour: ${error}`);
    }
  }

  // Get a single tour by exact text (optional, if you support)
  static async getByText(text: string) {
    try {
      return await prisma.tours.findUnique({ where: { text } });
    } catch (error) {
      throw new Error(`Failed to fetch tour by text: ${error}`);
    }
  }

  // Update tour
  static async update(
    tid: number,
    data: { text?: string; icon?: string; description?: string }
  ) {
    try {
      return await prisma.tours.update({
        where: { tid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update tour: ${error}`);
    }
  }

  // Delete a tour by ID
  static async delete(tid: number) {
    try {
      return await prisma.tours.delete({ where: { tid } });
    } catch (error) {
      throw new Error(`Failed to delete tour: ${error}`);
    }
  }
}

export default TourService;
