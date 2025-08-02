import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const cityService = {
  // Create
  async createCity(data: {
    name: string;
    description: string;
    destinationId: number;
  }) {
    try {
      const existing = await prisma.city.findUnique({
        where: { name: data.name },
      });

      if (existing) {
        return {
          success: false,
          message: "City with this name already exists.",
        };
      }

      const city = await prisma.city.create({
        data,
      });

      return {
        success: true,
        message: "City created successfully.",
        data: city,
      };
    } catch (error) {
      console.error("Create City Error:", error);
      throw new Error("Failed to create city");
    }
  },

  // Get All
  async getAllCities() {
    try {
      const cities = await prisma.city.findMany({
        include: {
          destination: true,
          packages: true,
          hotels: true,
        },
        orderBy: {
          cid: "desc",
        },
      });

      return {
        success: true,
        data: cities,
      };
    } catch (error) {
      console.error("Get All Cities Error:", error);
      throw new Error("Failed to fetch cities");
    }
  },

  // Get by ID
  async getCityById(id: number) {
    try {
      const city = await prisma.city.findUnique({
        where: { cid: id },
        include: {
          destination: true,
          packages: true,
          hotels: true,
        },
      });

      if (!city) {
        return {
          success: false,
          message: "City not found",
        };
      }

      return {
        success: true,
        data: city,
      };
    } catch (error) {
      console.error("Get City Error:", error);
      throw new Error("Failed to get city");
    }
  },

  // Update
  async updateCity(
    id: number,
    data: Partial<{ name: string; description: string; destinationId: number }>
  ) {
    try {
      const city = await prisma.city.update({
        where: { cid: id },
        data,
      });

      return {
        success: true,
        message: "City updated successfully.",
        data: city,
      };
    } catch (error) {
      console.error("Update City Error:", error);
      throw new Error("Failed to update city");
    }
  },

  // Delete
  async deleteCity(id: number) {
    try {
      const city = await prisma.city.delete({
        where: { cid: id },
      });

      return {
        success: true,
        message: "City deleted successfully.",
        data: city,
      };
    } catch (error) {
      console.error("Delete City Error:", error);
      throw new Error("Failed to delete city");
    }
  },
};
