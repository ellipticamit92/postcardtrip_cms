// import { prisma } from "@/lib/prisma";

// export class ItineraryPlaceImageService {
//   static async create(data: {
//     url: string;
//     caption?: string;
//     placeId: number;
//   }) {
//     try {
//       return await prisma.itineraryPlaceImage.create({
//         data,
//         include: {
//           place: {
//             include: {
//               itinerary: {
//                 include: {
//                   package: true,
//                 },
//               },
//             },
//           },
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to create itinerary place image: ${error}`);
//     }
//   }

//   static async getAll(
//     options: {
//       page?: number;
//       limit?: number;
//       placeId?: number;
//       url?: string;
//       sortBy?: "ipiid" | "createdAt";
//       sortOrder?: "asc" | "desc";
//     } = {}
//   ) {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         placeId,
//         url,
//         sortBy = "ipiid",
//         sortOrder = "desc",
//       } = options;

//       const skip = (page - 1) * limit;
//       const where: any = {};

//       if (placeId) {
//         where.placeId = placeId;
//       }

//       if (url) {
//         where.url = {
//           contains: url,
//           mode: "insensitive",
//         };
//       }

//       const [images, total] = await Promise.all([
//         prisma.itineraryPlaceImage.findMany({
//           where,
//           skip,
//           take: limit,
//           include: {
//             place: {
//               include: {
//                 itinerary: {
//                   include: {
//                     package: {
//                       include: {
//                         destination: true,
//                         city: true,
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//           orderBy: {
//             [sortBy]: sortOrder,
//           },
//         }),
//         prisma.itineraryPlaceImage.count({ where }),
//       ]);

//       return {
//         data: images,
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
//       throw new Error(`Failed to fetch itinerary place images: ${error}`);
//     }
//   }

//   static async getById(ipiid: number) {
//     try {
//       const image = await prisma.itineraryPlaceImage.findUnique({
//         where: { ipiid },
//         include: {
//           place: {
//             include: {
//               itinerary: {
//                 include: {
//                   package: {
//                     include: {
//                       destination: true,
//                       city: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });

//       if (!image) {
//         throw new Error("Itinerary place image not found");
//       }

//       return image;
//     } catch (error) {
//       throw new Error(`Failed to fetch itinerary place image: ${error}`);
//     }
//   }

//   static async getByPlace(placeId: number) {
//     try {
//       return await prisma.itineraryPlaceImage.findMany({
//         where: { placeId },
//         orderBy: {
//           ipiid: "asc",
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to fetch images by place: ${error}`);
//     }
//   }

//   static async update(
//     ipiid: number,
//     data: {
//       url?: string;
//       caption?: string;
//     }
//   ) {
//     try {
//       return await prisma.itineraryPlaceImage.update({
//         where: { ipiid },
//         data,
//       });
//     } catch (error) {
//       throw new Error(`Failed to update itinerary place image: ${error}`);
//     }
//   }

//   static async delete(ipiid: number) {
//     try {
//       return await prisma.itineraryPlaceImage.delete({
//         where: { ipiid },
//       });
//     } catch (error) {
//       throw new Error(`Failed to delete itinerary place image: ${error}`);
//     }
//   }

//   static async bulkCreate(
//     placeId: number,
//     images: { url: string; caption?: string }[]
//   ) {
//     try {
//       return await prisma.itineraryPlaceImage.createMany({
//         data: images.map((img) => ({
//           ...img,
//           placeId,
//         })),
//       });
//     } catch (error) {
//       throw new Error(`Failed to bulk create itinerary place images: ${error}`);
//     }
//   }

//   static async deleteByPlace(placeId: number) {
//     try {
//       return await prisma.itineraryPlaceImage.deleteMany({
//         where: { placeId },
//       });
//     } catch (error) {
//       throw new Error(`Failed to delete images by place: ${error}`);
//     }
//   }

//   static async getByItinerary(itineraryId: number) {
//     try {
//       return await prisma.itineraryPlaceImage.findMany({
//         where: {
//           place: {
//             itineraryId,
//           },
//         },
//         include: {
//           place: true,
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to fetch images by itinerary: ${error}`);
//     }
//   }

//   static async getByPackage(packageId: number) {
//     try {
//       return await prisma.itineraryPlaceImage.findMany({
//         where: {
//           place: {
//             itinerary: {
//               packageId,
//             },
//           },
//         },
//         include: {
//           place: {
//             include: {
//               itinerary: true,
//             },
//           },
//         },
//         orderBy: {
//           place: {
//             itinerary: {
//               day: "asc",
//             },
//           },
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to fetch images by package: ${error}`);
//     }
//   }

//   static async searchByCaption(caption: string) {
//     try {
//       const whereClause = caption
//         ? {
//             OR: [{ caption: { contains: caption, mode: "insensitive" } }],
//           }
//         : {};

//       return await prisma.itineraryPlaceImage.findMany({
//         where: whereClause,
//         include: {
//           place: {
//             include: {
//               itinerary: {
//                 include: {
//                   package: true,
//                 },
//               },
//             },
//           },
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to search images by caption: ${error}`);
//     }
//   }
// }

// export default ItineraryPlaceImageService;
