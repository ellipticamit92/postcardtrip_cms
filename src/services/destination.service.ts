import { getFieldOptions } from "@/lib/helper";
import { prisma } from "@/lib/prisma";

export class DestinationService {
  static async create(data: {
    name: string;
    country: string;
    overview?: string;
    imageUrl?: string;
    trending?: boolean;
    heading: string;
    basePrice?: number;
    originalPrice?: number;
    heroTitle?: string;
    description?: string;
    text?: string;
    rating?: string;
  }) {
    try {
      return await prisma.destination.create({
        data,
        include: {
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create destination: ${error}`);
    }
  }

  static async getNameId() {
    try {
      const destinations = await prisma.destination.findMany({
        select: {
          did: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      const destinationsData = getFieldOptions(destinations, "did");
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
      include?: boolean;
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 150,
        country,
        name,
        sortBy = "createdAt",
        sortOrder = "desc",
        include = true,
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
          include: include
            ? {
                packages: {
                  include: {
                    hotelPrices: {
                      include: {
                        hotel: true,
                      },
                    },
                  },
                },
              }
            : undefined,
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
        where: { did: did },
        include: {
          packages: {
            include: {
              itineraries: true,
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
        select: {
          did: true,
          name: true,
          description: true,
          country: true,
          imageUrl: true,
          heroTitle: true,
          packages: {
            select: {
              name: true,
              featured: true,
              popular: true,
              rating: true,
              day: true,
              night: true,
              imageUrl: true,
              description: true,
              basePrice: true,
              originalPrice: true,
              text: true,
              cities: {
                select: {
                  name: true,
                },
              },
              highlights: {
                select: {
                  text: true,
                },
              },
            },
          },
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
      trending?: boolean;
      heading?: string;
      basePrice?: number;
      originalPrice?: number;
      heroTitle?: string;
      description?: string;
      text?: string;
      rating?: string;
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
          packages: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to search destinations by country: ${error}`);
    }
  }

  static async getTrending() {
    try {
      const data = await prisma.destination.findMany({
        where: {
          trending: true,
        },
        include: {
          packages: true, // we need it temporarily to count
        },
        take: 4,
      });

      const updatedData = data.map(({ packages, ...destination }) => ({
        ...destination,
        packagesCount: packages.length,
      }));

      return updatedData;
    } catch (error) {
      throw new Error(`Failed to fetch destination by name: ${error}`);
    }
  }

  static async getWebAll() {
    try {
      const destinations = await prisma.destination.findMany({
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      });

      return destinations;
    } catch (error) {
      throw new Error(`Failed to fetch destinations: ${error}`);
    }
  }
}

export default DestinationService;
