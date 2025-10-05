import { prisma } from "@/lib/prisma";
import { IEHType } from "@/types/type";

export class IEHService {
  static async getAll(
    options: {
      page?: number;
      limit?: number;
      title?: string;
      sortBy?: "hlid" | "createdAt" | "updatedAt" | "text";
      sortOrder?: "asc" | "desc";
      type: IEHType;
    } = {
      type: "inclusion",
    }
  ) {
    try {
      const {
        page = 1,
        limit = 20,
        title,
        sortBy = "createdAt",
        sortOrder = "desc",
        type,
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (title) where.text = { contains: title, mode: "insensitive" };

      let updateData;
      let updateTotal = 0;
      if (type === "inclusion") {
        const [data, total] = await Promise.all([
          prisma.inclusion.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
          }),
          prisma.highlight.count({ where }),
        ]);
        updateData = data;
        updateTotal = total;
      }

      if (type === "exclusion") {
        const [data, total] = await Promise.all([
          prisma.exclusion.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
          }),
          prisma.highlight.count({ where }),
        ]);
        updateData = data;
        updateTotal = total;
      }

      if (type === "highlight") {
        const [data, total] = await Promise.all([
          prisma.highlight.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
          }),
          prisma.highlight.count({ where }),
        ]);
        updateData = data;
        updateTotal = total;
      }

      return {
        data: updateData,
        pagination: {
          page,
          limit,
          total: updateTotal,
          totalPages: Math.ceil(updateTotal / limit),
          hasNext: page * limit < updateTotal,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch highlights: ${error}`);
    }
  }

  static async create(data: { text: string }, type: string) {
    try {
      if (type.toLowerCase() === "inclusion") {
        return await prisma.inclusion.create({ data });
      } else if (type.toLowerCase() === "exclusion") {
        return await prisma.exclusion.create({ data });
      } else if (type.toLowerCase() === "highlight") {
        return await prisma.highlight.create({ data });
      }
    } catch (error) {
      throw new Error(`Failed to create highlight: ${error}`);
    }
  }

  static async getByName(data: string) {
    try {
      const getNameType = data.split("_");
      const text = getNameType[0];
      const type = getNameType[1];

      if (type.toLowerCase() === "inclusion") {
        return await prisma.inclusion.findUnique({
          where: { text },
        });
      } else if (type.toLowerCase() === "exclusion") {
        return await prisma.exclusion.findUnique({
          where: { text },
        });
      } else if (type.toLowerCase() === "highlight") {
        return await prisma.highlight.findUnique({
          where: { text },
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to fetch package by name: ${error}`);
    }
  }

  static async getByid(id: number, type: string) {
    try {
      if (type === "inclusion") {
        return await prisma.inclusion.findUnique({ where: { lid: id } });
      } else if (type === "exclusion") {
        return await prisma.exclusion.findUnique({ where: { eid: id } });
      } else if (type === "highlight") {
        return await prisma.highlight.findUnique({ where: { hlid: id } });
      }
    } catch (error) {
      throw new Error(`Failed to fetch highlight: ${error}`);
    }
  }

  static async update(id: number, data: { text?: string }, type: string) {
    try {
      if (type === "inclusion") {
        return await prisma.inclusion.update({
          where: { lid: id },
          data,
        });
      } else if (type === "exclusion") {
        return await prisma.exclusion.update({
          where: { eid: id },
          data,
        });
      } else if (type === "highlight") {
        return await prisma.highlight.update({
          where: { hlid: id },
          data,
        });
      }
    } catch (error) {
      throw new Error(`Failed to update highlight: ${error}`);
    }
  }

  static async delete(id: string) {
    try {
      const idArray = id.split("_");
      const newId = parseInt(idArray[0]);
      const type = idArray[1];

      if (type === "inclusion") {
        return await prisma.inclusion.delete({ where: { lid: newId } });
      } else if (type === "exclusion") {
        return await prisma.exclusion.delete({ where: { eid: newId } });
      } else if (type === "highlight") {
        return await prisma.highlight.delete({ where: { hlid: newId } });
      }
    } catch (error) {
      throw new Error(`Failed to delete: ${error}`);
    }
  }

  /*
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
  */
}

export default IEHService;
