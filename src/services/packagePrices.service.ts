import { getFieldOptions } from "@/lib/helper";
import { prisma } from "@/lib/prisma";

export class PackagePricesService {
  static async create(data: {
    basePrice: number;
    originalPrice: number;
    hotelId: number;
    packageId: number;
  }) {
    try {
      return await prisma.packageHotelPrice.create({
        data,
      });
    } catch (error) {
      throw new Error(`Failed to create package: ${error}`);
    }
  }

  static async getNameId() {
    try {
      const packages = await prisma.packageHotelPrice.findMany();
      const pagkagesData = getFieldOptions(packages, "pid");
      return {
        data: pagkagesData,
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
      minPrice?: number;
      maxPrice?: number;
      minDuration?: number;
      maxDuration?: number;
      name?: string;
      sortBy?: "name" | "basePrice" | "durationDays" | "createdAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        destinationId,
        minPrice,
        maxPrice,
        minDuration,
        maxDuration,
        name,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (destinationId) {
        where.destinationId = destinationId;
      }

      if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice.gte = minPrice;
        if (maxPrice) where.basePrice.lte = maxPrice;
      }

      if (minDuration || maxDuration) {
        where.durationDays = {};
        if (minDuration) where.durationDays.gte = minDuration;
        if (maxDuration) where.durationDays.lte = maxDuration;
      }

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const [packagesPrice, total] = await Promise.all([
        prisma.packageHotelPrice.findMany({
          where,
          skip,
          take: limit,
          include: {
            hotel: {
              select: {
                name: true,
              },
            },
            package: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.packageHotelPrice.count({ where }),
      ]);

      return {
        data: packagesPrice,
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
      throw new Error(`Failed to fetch packages: ${error}`);
    }
  }

  static async getById(phid: number) {
    try {
      const packageData = await prisma.packageHotelPrice.findUnique({
        where: { phid },
        select: {
          basePrice: true,
          originalPrice: true,
          hotelId: true,
          packageId: true,
        },
      });

      if (!packageData) {
        throw new Error("Package not found");
      }

      return packageData;
    } catch (error) {
      throw new Error(`Failed to fetch package: ${error}`);
    }
  }

  static async update(
    phid: number,
    data: {
      hotelId?: number;
      packageId?: number;
      basePrice?: number;
      originalPrice?: number;
    }
  ) {
    try {
      return await prisma.packageHotelPrice.update({
        where: { phid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update package: ${error}`);
    }
  }

  static async delete(phid: number) {
    try {
      return await prisma.packageHotelPrice.delete({
        where: { phid },
      });
    } catch (error) {
      throw new Error(`Failed to delete package: ${error}`);
    }
  }

  static async search(filters: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    starRating?: number;
    page?: number;
    limit?: number;
  }) {
    try {
      const { page = 1, limit = 10, ...searchFilters } = filters;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (searchFilters.city) {
        where.city = {
          name: {
            contains: searchFilters.city,
            mode: "insensitive",
          },
        };
      }

      if (searchFilters.minPrice || searchFilters.maxPrice) {
        where.basePrice = {};
        if (searchFilters.minPrice)
          where.basePrice.gte = searchFilters.minPrice;
        if (searchFilters.maxPrice)
          where.basePrice.lte = searchFilters.maxPrice;
      }

      if (searchFilters.minDuration || searchFilters.maxDuration) {
        where.durationDays = {};
        if (searchFilters.minDuration)
          where.durationDays.gte = searchFilters.minDuration;
        if (searchFilters.maxDuration)
          where.durationDays.lte = searchFilters.maxDuration;
      }

      if (searchFilters.starRating) {
        where.hotelPrices = {
          some: {
            hotel: {
              starRating: {
                gte: searchFilters.starRating,
              },
            },
          },
        };
      }

      const [packages, total] = await Promise.all([
        prisma.packageHotelPrice.findMany({
          where,
          skip,
          take: limit,
        }),
        prisma.packageHotelPrice.count({ where }),
      ]);

      return {
        data: packages,
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
      throw new Error(`Failed to search packages: ${error}`);
    }
  }

  static async getByPriceRange(minPrice: number, maxPrice: number) {
    try {
      return await prisma.packageHotelPrice.findMany({
        where: {
          basePrice: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch packages by price range: ${error}`);
    }
  }
}

export default PackagePricesService;
