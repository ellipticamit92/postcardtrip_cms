import { prisma } from "@/lib/prisma";

export class PackageHotelPriceService {
  static async create(data: {
    packageId: number;
    hotelId: number;
    basePrice: number;
    originalPrice: number;
  }) {
    return await prisma.packageHotelPrice.create({
      data,
      include: {
        package: true,
        hotel: true,
      },
    });
  }

  static async getAll() {
    return await prisma.packageHotelPrice.findMany({
      include: {
        package: {
          include: {
            destination: true,
          },
        },
        hotel: {
          include: {
            city: true,
            images: true,
          },
        },
      },
    });
  }

  static async getById(phid: number) {
    return await prisma.packageHotelPrice.findUnique({
      where: { phid },
      include: {
        package: {
          include: {
            destination: true,
          },
        },
        hotel: {
          include: {
            city: true,
            images: true,
          },
        },
      },
    });
  }

  static async getByPackage(packageId: number) {
    return await prisma.packageHotelPrice.findMany({
      where: { packageId },
      include: {
        hotel: {
          include: {
            images: true,
            city: true,
          },
        },
      },
    });
  }

  static async getByHotel(hotelId: number) {
    return await prisma.packageHotelPrice.findMany({
      where: { hotelId },
      include: {
        package: {
          include: {
            destination: true,
          },
        },
      },
    });
  }

  static async delete(phid: number) {
    return await prisma.packageHotelPrice.delete({
      where: { phid },
    });
  }
}

export default PackageHotelPriceService;
