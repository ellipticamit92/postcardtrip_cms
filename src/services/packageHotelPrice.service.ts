import { prisma } from "@/lib/prisma";

export class PackageHotelPriceService {
  static async create(data: {
    packageId: number;
    hotelId: number;
    price: number;
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
            city: true,
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
            city: true,
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
            city: true,
          },
        },
      },
    });
  }

  static async getByPackageAndHotel(packageId: number, hotelId: number) {
    return await prisma.packageHotelPrice.findUnique({
      where: {
        packageId_hotelId: {
          packageId,
          hotelId,
        },
      },
      include: {
        package: true,
        hotel: true,
      },
    });
  }

  static async update(
    phid: number,
    data: {
      price: number;
    }
  ) {
    return await prisma.packageHotelPrice.update({
      where: { phid },
      data,
    });
  }

  static async delete(phid: number) {
    return await prisma.packageHotelPrice.delete({
      where: { phid },
    });
  }

  static async deleteByPackageAndHotel(packageId: number, hotelId: number) {
    return await prisma.packageHotelPrice.delete({
      where: {
        packageId_hotelId: {
          packageId,
          hotelId,
        },
      },
    });
  }

  static async bulkCreate(data: {
    packageId: number;
    hotelPrices: { hotelId: number; price: number }[];
  }) {
    return await prisma.packageHotelPrice.createMany({
      data: data.hotelPrices.map((hp) => ({
        packageId: data.packageId,
        hotelId: hp.hotelId,
        price: hp.price,
      })),
    });
  }

  static async updatePriceByPackageAndHotel(
    packageId: number,
    hotelId: number,
    price: number
  ) {
    return await prisma.packageHotelPrice.update({
      where: {
        packageId_hotelId: {
          packageId,
          hotelId,
        },
      },
      data: { price },
    });
  }
}

export default PackageHotelPriceService;
