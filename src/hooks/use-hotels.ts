// hooks/use-hotels.ts
import { useState, useEffect } from "react";
import { hotelsApi } from "@/lib/api/hotels";
import { showToast } from "@/lib/toast";
import { toast } from "sonner";

interface Hotel {
  hid: number;
  name: string;
  description: string;
  starRating: number;
  cityId: number;
  city?: {
    cid: number;
    name: string;
    destination: {
      did: number;
      name: string;
      country: string;
    };
  };
  images: Array<{
    hiid: number;
    url: string;
    caption?: string;
  }>;
  prices: Array<{
    phid: number;
    price: number;
    package: {
      pid: number;
      name: string;
      durationDays: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

interface UseHotelsOptions {
  autoFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const useHotels = (options: UseHotelsOptions = {}) => {
  const { autoFetch = false, initialPage = 1, initialLimit = 10 } = options;

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch hotels with filters
  const fetchHotels = async (params?: {
    page?: number;
    limit?: number;
    cityId?: number;
    name?: string;
    starRating?: number;
    minStarRating?: number;
    maxStarRating?: number;
    sortBy?: "name" | "starRating" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await hotelsApi.getAll({
        page: initialPage,
        limit: initialLimit,
        sortBy: "name",
        sortOrder: "asc",
        ...params,
      });

      if (result.success) {
        setHotels(result.data);
        setPagination(result.pagination);
        if (params?.page) {
          setCurrentPage(params.page);
        }
      } else {
        setError(result.error || "Failed to fetch hotels");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get single hotel by ID
  const getHotel = async (id: number): Promise<Hotel | null> => {
    try {
      const result = await hotelsApi.getById(id);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || "Failed to fetch hotel");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  // Create new hotel
  const createHotel = async (data: {
    name: string;
    description: string;
    starRating: number;
    cityId: number;
    images?: { url: string; caption?: string }[];
  }): Promise<{ success: boolean; data?: Hotel; error?: string }> => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.createLoading("hotel");

    try {
      const result = await hotelsApi.create(data);

      if (result.success) {
        // Refresh the list if we're showing hotels
        if (hotels.length > 0 || autoFetch) {
          await fetchHotels({ page: currentPage });
        }
        toast.dismiss(loadingToast);
        showToast.createSuccess("Hotel");
        return { success: true, data: result.data };
      } else {
        toast.dismiss(loadingToast);
        showToast.createError("Hotel");
        setError(result.error || "Failed to create hotel");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.createError("hotel", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update hotel
  const updateHotel = async (
    id: number,
    data: {
      name?: string;
      description?: string;
      starRating?: number;
    }
  ): Promise<{ success: boolean; data?: Hotel; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.updateLoading("hotel");

    try {
      const result = await hotelsApi.update(id, data);

      if (result.success) {
        // Update the local state
        setHotels((prev) =>
          prev.map((hotel) =>
            hotel.hid === id ? { ...hotel, ...result.data } : hotel
          )
        );
        toast.dismiss(loadingToast);
        showToast.updateSuccess("hotel");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update hotel");
        toast.dismiss(loadingToast);
        showToast.updateError("Destination", "Failed to update destination");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.updateError("Destination", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete hotel
  const deleteHotel = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await hotelsApi.delete(id);

      if (result.success) {
        // Remove from local state
        setHotels((prev) => prev.filter((hotel) => hotel.hid !== id));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete hotel");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Get hotels by city
  const getHotelsByCity = async (cityId: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await hotelsApi.getByCity(cityId);
      if (result.success) {
        setHotels(result.data);
        setPagination(null); // This endpoint doesn't return pagination
      } else {
        setError(result.error || "Failed to fetch hotels");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Filter hotels by star rating
  const filterByStarRating = async (minRating: number, maxRating?: number) => {
    await fetchHotels({
      minStarRating: minRating,
      maxStarRating: maxRating,
      page: 1, // Reset to first page when filtering
    });
  };

  // Search hotels
  const searchHotels = async (searchParams: {
    name?: string;
    starRating?: number;
    minStar?: number;
    maxStar?: number;
    cityId?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await hotelsApi.search({
        page: 1,
        limit: pagination?.limit || initialLimit,
        ...searchParams,
      });

      if (result.success) {
        setHotels(result.data);
        setPagination(result.pagination);
        setCurrentPage(1);
      } else {
        setError(result.error || "Failed to search hotels");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Search hotels by name only
  const searchHotelsByName = async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await hotelsApi.searchByName(name);
      if (result.success) {
        setHotels(result.data);
        setPagination(null); // Search doesn't return pagination
      } else {
        setError(result.error || "Failed to search hotels");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get hotels by exact star rating
  const getHotelsByStarRating = async (starRating: number) => {
    await fetchHotels({ starRating, page: 1 });
  };

  // Change page
  const changePage = async (page: number) => {
    await fetchHotels({ page });
  };

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchHotels();
    }
  }, [autoFetch]);

  return {
    // State
    hotels,
    loading,
    error,
    pagination,
    currentPage,

    // Actions
    fetchHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel,
    getHotelsByCity,
    filterByStarRating,
    searchHotels,
    searchHotelsByName,
    getHotelsByStarRating,
    changePage,

    // Utilities
    clearError: () => setError(null),
    refresh: () => fetchHotels({ page: currentPage }),
  };
};
