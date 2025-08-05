import { getDestinationDropdown } from "@/lib/helper";
import { prisma } from "@/lib/prisma";

export class DestinationService {
  static async create(data: {
    name: string;
    country: string;
    overview?: string;
    imageUrl?: string;
  }) {
    try {
      return await prisma.destination.create({
        data,
        include: {
          cities: true,
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create destination: ${error}`);
    }
  }

  static async getNameId() {
    try {
      const destinations = await prisma.destination.findMany();
      const destinationsData = getDestinationDropdown(destinations);
      return {
        data: destinationsData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch destinations name and id: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      country?: string;
      name?: string;
      sortBy?: "name" | "country" | "createdAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        country,
        name,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (country) {
        where.country = {
          contains: country,
          mode: "insensitive",
        };
      }

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const [destinations, total] = await Promise.all([
        prisma.destination.findMany({
          where,
          skip,
          take: limit,
          include: {
            cities: true,
            packages: {
              include: {
                city: true,
                hotelPrices: {
                  include: {
                    hotel: true,
                  },
                },
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.destination.count({ where }),
      ]);

      return {
        data: destinations,
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
      throw new Error(`Failed to fetch destinations: ${error}`);
    }
  }

  static async getById(did: number) {
    try {
      const destination = await prisma.destination.findUnique({
        where: { did },
        include: {
          cities: {
            include: {
              hotels: true,
              packages: true,
            },
          },
          packages: {
            include: {
              city: true,
              itineraries: {
                include: {
                  highlights: true,
                  inclusions: true,
                  exclusions: true,
                  places: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
              hotelPrices: {
                include: {
                  hotel: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!destination) {
        throw new Error("Destination not found");
      }

      return destination;
    } catch (error) {
      throw new Error(`Failed to fetch destination: ${error}`);
    }
  }

  static async getByName(name: string) {
    try {
      return await prisma.destination.findUnique({
        where: { name },
        include: {
          cities: true,
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch destination by name: ${error}`);
    }
  }

  static async update(
    did: number,
    data: {
      name?: string;
      country?: string;
      overview?: string;
      imageUrl?: string;
    }
  ) {
    try {
      return await prisma.destination.update({
        where: { did },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update destination: ${error}`);
    }
  }

  static async delete(did: number) {
    try {
      return await prisma.destination.delete({
        where: { did },
      });
    } catch (error) {
      throw new Error(`Failed to delete destination: ${error}`);
    }
  }

  static async searchByCountry(country: string) {
    try {
      const whereClause = country
        ? {
            OR: [{ country: { contains: country, mode: "insensitive" } }],
          }
        : {};

      return await prisma.destination.findMany({
        where: whereClause,
        include: {
          cities: true,
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to search destinations by country: ${error}`);
    }
  }
}

export default DestinationService;
