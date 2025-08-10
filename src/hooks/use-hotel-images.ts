// import { useState, useEffect } from "react";
// import type {
//   HotelImage,
//   HotelImagePayload,
//   ApiResponse,
// } from "@/lib/api/hotelImages";
// import { hotelImagesApi } from "@/lib/api/hotelImages";

// // Optional filter interface for listing images
// interface HotelImageFilters {
//   hotelId?: number;
//   caption?: string;
//   autoFetch?: boolean;
//   initialPage?: number;
//   initialLimit?: number;
// }

// // The hook returns list, single image, loading, error, pagination, CRUD functions
// export function useHotelImages(initialFilters: HotelImageFilters = {}) {
//   const { autoFetch = false } = initialFilters;
//   const [images, setImages] = useState<HotelImage[]>([]);
//   const [image, setImage] = useState<HotelImage | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState<ApiResponse["pagination"]>({
//     page: 1,
//     limit: 12,
//     total: 0,
//     totalPages: 1,
//     hasNext: false,
//     hasPrev: false,
//   });
//   const [filters, setFilters] = useState<HotelImageFilters>(initialFilters);

//   // Fetch list of hotel images
//   const fetchImages = async (page?: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await hotelImagesApi.getAll({
//         ...filters,
//         page: page ?? filters.initialPage ?? 1,
//         limit: filters.initialLimit ?? 12,
//       });
//       if (res.success) {
//         setImages(res.data || []);
//         setPagination(res.pagination || pagination);
//       } else {
//         setError(res.error || "Failed to load images");
//       }
//     } catch (e: any) {
//       setError(e?.message || "Failed to fetch hotel images");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch a single image by id
//   const fetchImage = async (hiid: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await hotelImagesApi.getById(hiid);
//       if (res.success) {
//         setImage(res.data || null);
//       } else {
//         setError(res.error || "Image not found");
//       }
//     } catch (e: any) {
//       setError(e?.message || "Failed to fetch image");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create a hotel image
//   const createImage = async (data: HotelImagePayload) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await hotelImagesApi.create(data);
//       if (res.success) {
//         fetchImages(); // refresh list
//         return res.data;
//       } else {
//         setError(res.error || "Failed to create image");
//         throw new Error(res.error || "Failed to create image");
//       }
//     } catch (e: any) {
//       setError(e?.message || "Failed to create image");
//       throw e;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update a hotel image
//   const updateImage = async (
//     hiid: number,
//     data: Partial<Omit<HotelImagePayload, "hotelId">>
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await hotelImagesApi.update(hiid, data);
//       if (res.success) {
//         fetchImages();
//         return res.data;
//       } else {
//         setError(res.error || "Failed to update image");
//         throw new Error(res.error || "Failed to update image");
//       }
//     } catch (e: any) {
//       setError(e?.message || "Failed to update image");
//       throw e;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete a hotel image
//   const deleteImage = async (hiid: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await hotelImagesApi.delete(hiid);
//       if (res.success) {
//         setImages((prev) => prev.filter((img) => img.hiid !== hiid));
//         // Optionally fetchImages() for up-to-date pagination
//       } else {
//         setError(res.error || "Failed to delete image");
//         throw new Error(res.error || "Failed to delete image");
//       }
//     } catch (e: any) {
//       setError(e?.message || "Failed to delete image");
//       throw e;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Bulk create hotel images (optional)
//   const bulkCreateImages = async (images: HotelImagePayload[]) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await hotelImagesApi.bulkCreate(images);
//       if (res.success) {
//         fetchImages();
//         return true;
//       } else {
//         setError(res.error || "Failed to create images");
//         throw new Error(res.error || "Failed to create images");
//       }
//     } catch (e: any) {
//       setError(e?.message || "Failed to create images");
//       throw e;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Change filters
//   const updateFilters = (newFilters: HotelImageFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }));
//   };

//   useEffect(() => {
//     if (autoFetch) {
//       fetchImages();
//     }
//   }, [autoFetch]);

//   return {
//     images,
//     image,
//     loading,
//     error,
//     pagination,
//     filters,
//     fetchImages,
//     fetchImage,
//     createImage,
//     updateImage,
//     deleteImage,
//     bulkCreateImages,
//     updateFilters,
//   };
// }
