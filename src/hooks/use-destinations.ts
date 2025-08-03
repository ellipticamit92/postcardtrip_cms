import { destinationsApi } from "@/lib/api/destinations";
import { showToast } from "@/lib/toast";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Destination {
  did: number;
  name: string;
  country: string;
  overview?: string;
  imageUrl?: string;
  cities: any[];
  packages: any[];
  createdAt: string;
  updatedAt: string;
}

interface UseDestinationsOptions {
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

export const useDestinations = (options: UseDestinationsOptions = {}) => {
  const { autoFetch = true, initialPage = 1, initialLimit = 10 } = options;

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch destinations with filters
  const fetchDestinations = async (params?: {
    page?: number;
    limit?: number;
    name?: string;
    country?: string;
    sortBy?: "name" | "country" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await destinationsApi.getAll({
        page: initialPage,
        limit: initialLimit,
        sortBy: "name",
        sortOrder: "asc",
        ...params,
      });

      if (result.success) {
        //setDestinations(result.data);
        // setPagination(result.pagination);
        if (params?.page) {
          setCurrentPage(params.page);
        }
      } else {
        setError(result.error || "Failed to fetch destinations");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get single destination by ID
  const getDestination = async (id: number): Promise<Destination | null> => {
    try {
      const result = await destinationsApi.getById(id);
      if (result.success) {
        return result.data as Destination | null;
      } else {
        setError(result.error || "Failed to fetch destination");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  // Create new destination
  const createDestination = async (data: {
    name: string;
    country: string;
    overview?: string;
    imageUrl?: string;
  }): Promise<{ success: boolean; data?: Destination; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.createLoading("destination");
    console.log("DEBUG  loadingToast = ", loadingToast);

    try {
      const checkName = await destinationsApi.getByName(data.name);

      console.log("DEBUG check name = ", checkName);

      const result = await destinationsApi.create(data);

      console.log("DEBUG 115 result= ", result);

      if (result.success) {
        console.log("DEBUG 119= ", result);

        // Refresh the list if we're showing destinations
        if (destinations.length > 0 || autoFetch) {
          await fetchDestinations({ page: currentPage });
        }
        toast.dismiss(loadingToast);
        showToast.createSuccess("hotel");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to create destination");
        console.log("DEBUG line 127= ", result);

        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      console.log("error message  134  = ", errorMsg);
      toast.dismiss(loadingToast);
      showToast.createError("destination", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update destination
  const updateDestination = async (
    id: number,
    data: {
      name?: string;
      country?: string;
      overview?: string;
      imageUrl?: string;
    }
  ): Promise<{ success: boolean; data?: Destination; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await destinationsApi.update(id, data);

      if (result.success) {
        // Update the local state
        setDestinations((prev) =>
          prev.map((dest) =>
            dest.did === id ? { ...dest, ...result.data } : dest
          )
        );
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update destination");
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

  // Delete destination
  const deleteDestination = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await destinationsApi.delete(id);

      if (result.success) {
        // Remove from local state
        setDestinations((prev) => prev.filter((dest) => dest.did !== id));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete destination");
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

  // Search destinations
  const searchDestinations = async (searchTerm: string) => {
    await fetchDestinations({
      page: 1,
      name: searchTerm,
    });
  };

  // Change page
  const changePage = async (page: number) => {
    await fetchDestinations({ page });
  };

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchDestinations();
    }
  }, [autoFetch]);

  return {
    // State
    destinations,
    loading,
    error,
    pagination,
    currentPage,

    // Actions
    fetchDestinations,
    getDestination,
    createDestination,
    updateDestination,
    deleteDestination,
    searchDestinations,
    changePage,

    // Utilities
    clearError: () => setError(null),
    refresh: () => fetchDestinations({ page: currentPage }),
  };
};
