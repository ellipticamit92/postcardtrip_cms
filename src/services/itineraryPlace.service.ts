// import { prisma } from "@/lib/prisma";

// export class ItineraryPlaceService {
//   static async create(data: {
//     name: string;
//     description: string;
//     itineraryId: number;
//     images?: { url: string; caption?: string }[];
//   }) {
//     try {
//       const { images, ...placeData } = data;
//       return await prisma.itineraryPlace.create({
//         data: {
//           ...placeData,
//           images: images
//             ? {
//                 create: images,
//               }
//             : undefined,
//         },
//         include: {
//           itinerary: {
//             include: {
//               package: true,
//             },
//           },
//           images: true,
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to create itinerary place: ${error}`);
//     }
//   }

//   static async getAll(
//     options: {
//       page?: number;
//       limit?: number;
//       itineraryId?: number;
//       name?: string;
//       sortBy?: "name" | "createdAt";
//       sortOrder?: "asc" | "desc";
//     } = {}
//   ) {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         itineraryId,
//         name,
//         sortBy = "createdAt",
//         sortOrder = "desc",
//       } = options;

//       const skip = (page - 1) * limit;
//       const where: any = {};

//       if (itineraryId) {
//         where.itineraryId = itineraryId;
//       }

//       if (name) {
//         where.name = {
//           contains: name,
//           mode: "insensitive",
//         };
//       }

//       const [places, total] = await Promise.all([
//         prisma.itineraryPlace.findMany({
//           where,
//           skip,
//           take: limit,
//           include: {
//             itinerary: {
//               include: {
//                 package: {
//                   include: {
//                     destination: true,
//                     city: true,
//                   },
//                 },
//               },
//             },
//             images: true,
//           },
//           orderBy: {
//             [sortBy]: sortOrder,
//           },
//         }),
//         prisma.itineraryPlace.count({ where }),
//       ]);

//       return {
//         data: places,
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
//       throw new Error(`Failed to fetch itinerary places: ${error}`);
//     }
//   }

//   static async getById(itpid: number) {
//     try {
//       const place = await prisma.itineraryPlace.findUnique({
//         where: { itpid },
//         include: {
//           itinerary: {
//             include: {
//               package: {
//                 include: {
//                   destination: true,
//                   city: true,
//                 },
//               },
//             },
//           },
//           images: true,
//         },
//       });

//       if (!place) {
//         throw new Error("Itinerary place not found");
//       }

//       return place;
//     } catch (error) {
//       throw new Error(`Failed to fetch itinerary place: ${error}`);
//     }
//   }

//   static async getByItinerary(itineraryId: number) {
//     try {
//       return await prisma.itineraryPlace.findMany({
//         where: { itineraryId },
//         include: {
//           images: true,
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to fetch places by itinerary: ${error}`);
//     }
//   }

//   static async update(
//     itpid: number,
//     data: {
//       name?: string;
//       description?: string;
//     }
//   ) {
//     try {
//       return await prisma.itineraryPlace.update({
//         where: { itpid },
//         data,
//       });
//     } catch (error) {
//       throw new Error(`Failed to update itinerary place: ${error}`);
//     }
//   }

//   static async delete(itpid: number) {
//     try {
//       return await prisma.itineraryPlace.delete({
//         where: { itpid },
//       });
//     } catch (error) {
//       throw new Error(`Failed to delete itinerary place: ${error}`);
//     }
//   }

//   static async searchByName(name: string) {
//     try {
//       const whereClause = name
//         ? {
//             OR: [{ name: { contains: name, mode: "insensitive" } }],
//           }
//         : {};
//       return await prisma.itineraryPlace.findMany({
//         where: whereClause,
//         include: {
//           itinerary: {
//             include: {
//               package: true,
//             },
//           },
//           images: true,
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to search places by name: ${error}`);
//     }
//   }

//   static async getByPackage(packageId: number) {
//     try {
//       return await prisma.itineraryPlace.findMany({
//         where: {
//           itinerary: {
//             packageId,
//           },
//         },
//         include: {
//           itinerary: true,
//           images: true,
//         },
//         orderBy: {
//           itinerary: {
//             day: "asc",
//           },
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to fetch places by package: ${error}`);
//     }
//   }
// }

// export default ItineraryPlaceService;
