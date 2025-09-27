import { prisma } from "@/lib/prisma";
import { Inquiry } from "@prisma/client";

export class InquiryService {
  static async create(data: Inquiry) {
    try {
      return await prisma.inquiry.create({
        data,
      });
    } catch (error) {
      throw new Error(`Failed to create inquiry: ${error}`);
    }
  }

  static async getAll(options: {
    page?: number;
    limit?: number;
    inquryryId?: number;
    name?: string;
    sortBy?: "name" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        inquryryId,
        name,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (inquryryId) {
        where.inquryryId = inquryryId;
      }

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const [inqueries, total] = await Promise.all([
        prisma.inquiry.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.inquiry.count({ where }),
      ]);

      return {
        data: inqueries,
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
}

export default InquiryService;
