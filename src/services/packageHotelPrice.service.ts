// import { prisma } from "@/lib/prisma";

// export class PackageHotelPriceService {
//   static async create(data: {
//     packageId: number;
//     hotelId: number;
//     basePrice: number;
//     originalPrice: number;
//   }) {
//     return await prisma.packageHotelPrice.create({
//       data,
//       include: {
//         package: true,
//         hotel: true,
//       },
//     });
//   }

//   static async getAll(
//     options: {
//       page?: number;
//       limit?: number;
//       basePrice?: number;
//       originalPrice?: number;
//       hotelId?: number;
//       packageId?: number;
//       maxPrice?: number;
//       minPrice?: number;
//       minDuration?: number;
//       maxDuration?: number;
//       sortBy?: "name" | "basePrice" | "durationDays" | "createdAt";
//       sortOrder?: "asc" | "desc";
//     } = {}
//   ) {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         minPrice,
//         maxPrice,
//         minDuration,
//         maxDuration,
//         sortBy = "createdAt",
//         sortOrder = "desc",
//       } = options;

//       const skip = (page - 1) * limit;
//       const where: any = {};
//       if (minPrice || maxPrice) {
//         where.basePrice = {};
//         if (minPrice) where.basePrice.gte = minPrice;
//         if (maxPrice) where.basePrice.lte = maxPrice;
//       }

//       if (minDuration || maxDuration) {
//         where.durationDays = {};
//         if (minDuration) where.durationDays.gte = minDuration;
//         if (maxDuration) where.durationDays.lte = maxDuration;
//       }

//       const [packages, total] = await Promise.all([
//         prisma.packageHotelPrice.findMany({
//           where,
//           skip,
//           take: limit,
//           include: {
//             hotel: {
//               select: {
//                 name: true,
//               },
//             },
//             package: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//           orderBy: {
//             [sortBy]: sortOrder,
//           },
//         }),
//         prisma.packageHotelPrice.count({ where }),
//       ]);

//       return {
//         data: packages,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages: Math.ceil(total / limit),
//           hasNext: page * limit < total,
//           hasPrev: page > 1,
//         },
//       };
//     } catch (error) {
//       throw new Error(`Failed to fetch packages: ${error}`);
//     }
//   }

// static async getById(phid: number) {
//   return await prisma.packageHotelPrice.findUnique({
//     where: { phid },
//     select: {
//       basePrice: true,
//       originalPrice: true,
//       hotelId: true,
//       packageId: true,
//     },
//   });
// }

//   static async getByPackage(packageId: number) {
//     return await prisma.packageHotelPrice.findMany({
//       where: { packageId },
//       include: {
//         hotel: {
//           include: {
//             images: true,
//             city: true,
//           },
//         },
//       },
//     });
//   }

//   static async getByHotel(hotelId: number) {
//     return await prisma.packageHotelPrice.findMany({
//       where: { hotelId },
//       include: {
//         package: {
//           include: {
//             destination: true,
//           },
//         },
//       },
//     });
//   }

//   static async delete(phid: number) {
//     return await prisma.packageHotelPrice.delete({
//       where: { phid },
//     });
//   }
// }

// export default PackageHotelPriceService;
