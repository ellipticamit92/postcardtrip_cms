import { ReviewFormDataType } from "@/components/organisms/reviews/ReviewsForm";
import { prisma } from "@/lib/prisma";

export class ReviewService {
  static async create(data: ReviewFormDataType) {
    try {
      return await prisma.reviews.create({
        data,
        include: {
          package: true,
          destination: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create review: ${error}`);
    }
  }

  static async getAll(
    options: {
      page?: number;
      limit?: number;
      username?: string;
      packageId?: number;
      destinationId?: number;
      sortBy?: "createdAt" | "rating" | "username";
      sortOrder?: "asc" | "desc";
      include?: boolean;
    } = {}
  ) {
    try {
      const {
        page = 1,
        limit = 20,
        username,
        packageId,
        destinationId,
        sortBy = "createdAt",
        sortOrder = "desc",
        include = true,
      } = options;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (username) {
        where.username = {
          contains: username,
          mode: "insensitive",
        };
      }

      if (packageId) {
        where.packageId = packageId;
      }

      if (destinationId) {
        where.destinationId = destinationId;
      }

      const [reviews, total] = await Promise.all([
        prisma.reviews.findMany({
          where,
          skip,
          take: limit,
          include: include
            ? {
                package: {
                  select: {
                    pid: true,
                    name: true,
                    imageUrl: true,
                  },
                },
                destination: {
                  select: {
                    did: true,
                    name: true,
                    imageUrl: true,
                    country: true,
                  },
                },
              }
            : undefined,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.reviews.count({ where }),
      ]);

      return {
        data: reviews,
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
      throw new Error(`Failed to fetch reviews: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const review = await prisma.reviews.findUnique({
        where: { id },
        include: {
          package: true,
          destination: true,
        },
      });

      if (!review) {
        throw new Error("Review not found");
      }

      return review;
    } catch (error) {
      throw new Error(`Failed to fetch review: ${error}`);
    }
  }

  static async getByPackage(packageId: number) {
    try {
      return await prisma.reviews.findMany({
        where: { packageId },
        include: {
          package: true,
          destination: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch reviews by package: ${error}`);
    }
  }

  static async getByDestination(destinationId: number) {
    try {
      return await prisma.reviews.findMany({
        where: { destinationId },
        include: {
          package: true,
          destination: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch reviews by destination: ${error}`);
    }
  }

  static async update(id: number, data: ReviewFormDataType) {
    try {
      return await prisma.reviews.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update review: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await prisma.reviews.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete review: ${error}`);
    }
  }

  static async getAllWebReviews(limit: number, page: number) {
    try {
      const skip = (page - 1) * limit;
      return await prisma.reviews.findMany({
        skip,
        take: limit,
        orderBy: [
          { year: "desc" }, // newest year first
          { month: "desc" }, // within the same year, newest month first
        ],
        select: {
          id: true,
          username: true,
          rating: true,
          review: true,
          year: true,
          month: true,
          package: {
            select: {
              pid: true,
              name: true,
            },
          },
          destination: {
            select: {
              did: true,
              name: true,
              country: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch web reviews: ${error}`);
    }
  }

  static async getRecent(limit = 5) {
    try {
      return await prisma.reviews.findMany({
        take: limit,
        orderBy: [
          { year: "desc" }, // newest year first
          { month: "desc" }, // within the same year, newest month first
        ],
        select: {
          id: true,
          username: true,
          rating: true,
          review: true,
          year: true,
          month: true,
          package: {
            select: {
              pid: true,
              name: true,
            },
          },
          destination: {
            select: {
              did: true,
              name: true,
              country: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch recent reviews: ${error}`);
    }
  }
}

export default ReviewService;
