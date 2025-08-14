import { prisma } from "@/lib/prisma";

export class ItineraryService {
  static async create(data: {
    day: number;
    title: string;
    details: string;
    packageId: number;
    highlights?: string[];
    inclusions?: string[];
    exclusions?: string[];
    places?: {
      name: string;
      description: string;
      images?: { url: string; caption?: string }[];
    }[];
  }) {
    try {
      const { highlights, inclusions, exclusions, places, ...itineraryData } =
        data;

      return await prisma.itinerary.create({
        data: {
          ...itineraryData,
          highlights: highlights
            ? {
                create: highlights.map((text) => ({ text })),
              }
            : undefined,
          inclusions: inclusions
            ? {
                create: inclusions.map((text) => ({ text })),
              }
            : undefined,
          exclusions: exclusions
            ? {
                create: exclusions.map((text) => ({ text })),
              }
            : undefined,
          places: places
            ? {
                create: places.map((place) => ({
                  name: place.name,
                  description: place.description,
                  images: place.images
                    ? {
                        create: place.images,
                      }
                    : undefined,
                })),
              }
            : undefined,
        },
        include: {
          package: true,
          highlights: true,
          inclusions: true,
          exclusions: true,
          places: {
            include: {
              images: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to create itinerary: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      packageId?: number;
      day?: number;
      title?: string;
      sortBy?: "day" | "title" | "createdAt";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        packageId,
        day,
        title,
        sortBy = "day",
        sortOrder = "asc",
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (packageId) {
        where.packageId = packageId;
      }

      if (day) {
        where.day = day;
      }

      if (title) {
        where.title = {
          contains: title,
          mode: "insensitive",
        };
      }

      const [itineraries, total] = await Promise.all([
        prisma.itinerary.findMany({
          where,
          skip,
          take: limit,
          include: {
            package: {
              include: {
                destination: true,
                city: true,
              },
            },
            highlights: true,
            inclusions: true,
            exclusions: true,
            places: {
              include: {
                images: true,
              },
            },
          },
          orderBy: [{ packageId: "asc" }, { [sortBy]: sortOrder }],
        }),
        prisma.itinerary.count({ where }),
      ]);

      return {
        data: itineraries,
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
      throw new Error(`Failed to fetch itineraries: ${error}`);
    }
  }

  static async getById(itid: number) {
    try {
      const itinerary = await prisma.itinerary.findUnique({
        where: { itid },
        include: {
          package: {
            include: {
              destination: true,
              city: true,
            },
          },
          highlights: true,
          inclusions: true,
          exclusions: true,
          places: {
            include: {
              images: true,
            },
          },
        },
      });

      if (!itinerary) {
        throw new Error("Itinerary not found");
      }

      return itinerary;
    } catch (error) {
      throw new Error(`Failed to fetch itinerary: ${error}`);
    }
  }

  static async getByPackage(packageId: number) {
    try {
      return await prisma.itinerary.findMany({
        where: { packageId },
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
        orderBy: {
          day: "asc",
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch itineraries by package: ${error}`);
    }
  }

  static async getByDay(packageId: number, day: number) {
    try {
      return await prisma.itinerary.findFirst({
        where: {
          packageId,
          day,
        },
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
      });
    } catch (error) {
      throw new Error(`Failed to fetch itinerary by day: ${error}`);
    }
  }

  static async update(
    itid: number,
    data: {
      day?: number;
      title?: string;
      details?: string;
    }
  ) {
    try {
      return await prisma.itinerary.update({
        where: { itid },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update itinerary: ${error}`);
    }
  }

  static async delete(itid: number) {
    try {
      return await prisma.itinerary.delete({
        where: { itid },
      });
    } catch (error) {
      throw new Error(`Failed to delete itinerary: ${error}`);
    }
  }

  static async addHighlight(itineraryId: number, text: string) {
    try {
      return await prisma.highlight.create({
        data: {
          text,
          itineraryId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to add highlight: ${error}`);
    }
  }

  static async addInclusion(itineraryId: number, text: string) {
    try {
      return await prisma.inclusion.create({
        data: {
          text,
          itineraryId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to add inclusion: ${error}`);
    }
  }

  static async addExclusion(itineraryId: number, text: string) {
    try {
      return await prisma.exclusion.create({
        data: {
          text,
          itineraryId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to add exclusion: ${error}`);
    }
  }

  static async removeHighlight(hlid: number) {
    try {
      return await prisma.highlight.delete({
        where: { hlid },
      });
    } catch (error) {
      throw new Error(`Failed to remove highlight: ${error}`);
    }
  }

  static async removeInclusion(lid: number) {
    try {
      return await prisma.inclusion.delete({
        where: { lid },
      });
    } catch (error) {
      throw new Error(`Failed to remove inclusion: ${error}`);
    }
  }

  static async removeExclusion(eid: number) {
    try {
      return await prisma.exclusion.delete({
        where: { eid },
      });
    } catch (error) {
      throw new Error(`Failed to remove exclusion: ${error}`);
    }
  }

  static async searchByTitle(title: string) {
    try {
      const whereClause = title
        ? {
            OR: [{ title: { contains: title, mode: "insensitive" } }],
          }
        : {};
      return await prisma.itinerary.findMany({
        where: whereClause,
        include: {
          package: {
            include: {
              destination: true,
              city: true,
            },
          },
          highlights: true,
          inclusions: true,
          exclusions: true,
          places: {
            include: {
              images: true,
            },
          },
        },
        orderBy: {
          day: "asc",
        },
      });
    } catch (error) {
      throw new Error(`Failed to search itineraries by title: ${error}`);
    }
  }
}

export default ItineraryService;
