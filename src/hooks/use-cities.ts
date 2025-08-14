import { useState, useEffect } from "react";
import { citiesApi } from "@/lib/api/cities";
import { showToast } from "@/lib/toast";
import { toast } from "sonner";

interface City {
  cid: number;
  name: string;
  description: string;
  destinationId: number;
  destination?: {
    did: number;
    name: string;
    country: string;
  };
  hotels: Array<{
    hid: number;
    name: string;
    starRating: number;
  }>;
  packages: Array<{
    pid: number;
    name: string;
    basePrice: number;
    durationDays: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface UseCitiesOptions {
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

export const useCities = (options: UseCitiesOptions = {}) => {
  const { autoFetch = false, initialPage = 1, initialLimit = 10 } = options;

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch cities with filters
  const fetchCities = async (params?: {
    page?: number;
    limit?: number;
    destinationId?: number;
    name?: string;
    sortBy?: "name" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await citiesApi.getAll({
        page: initialPage,
        limit: initialLimit,
        sortBy: "name",
        sortOrder: "asc",
        ...params,
      });

      if (result.success) {
        setCities(result.data);
        setPagination(result.pagination);
        if (params?.page) {
          setCurrentPage(params.page);
        }
      } else {
        setError(result.error || "Failed to fetch cities");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get single city by ID
  const getCity = async (id: number): Promise<City | null> => {
    try {
      const result = await citiesApi.getById(id);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || "Failed to fetch city");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  // Create new city
  const createCity = async (data: {
    name: string;
    description: string;
    destinationId: number;
  }): Promise<{ success: boolean; data?: City; error?: string }> => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.createLoading("destination");

    try {
      const nameResult = await citiesApi.getByName(data.name);

      if (nameResult.success) {
        const errorMsg = "Destination name already exist";
        toast.dismiss(loadingToast);
        showToast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      const result = await citiesApi.create(data);

      if (result.success) {
        // Refresh the list if we're showing cities
        if (cities.length > 0 || autoFetch) {
          await fetchCities({ page: currentPage });
        }
        toast.dismiss(loadingToast);
        showToast.createSuccess("City");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to create city");
        toast.dismiss(loadingToast);
        showToast.createError("city");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("city", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update city
  const updateCity = async (
    id: number,
    data: {
      name?: string;
      description?: string;
    }
  ): Promise<{ success: boolean; data?: City; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await citiesApi.update(id, data);

      if (result.success) {
        // Update the local state
        setCities((prev) =>
          prev.map((city) =>
            city.cid === id ? { ...city, ...result.data } : city
          )
        );

        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update city");
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

  // Delete city
  const deleteCity = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await citiesApi.delete(id);

      if (result.success) {
        // Remove from local state
        setCities((prev) => prev.filter((city) => city.cid !== id));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete city");
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

  // Get cities by destination
  const getCitiesByDestination = async (destinationId: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await citiesApi.getByDestination(destinationId);
      if (result.success) {
        setCities(result.data);
      } else {
        setError(result.error || "Failed to fetch cities");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Search cities
  const searchCities = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await citiesApi.search(searchTerm);
      if (result.success) {
        setCities(result.data);
        setPagination(null); // Search doesn't return pagination
      } else {
        setError(result.error || "Failed to search cities");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Change page
  const changePage = async (page: number) => {
    await fetchCities({ page });
  };

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchCities();
    }
  }, [autoFetch]);

  return {
    // State
    cities,
    loading,
    error,
    pagination,
    currentPage,

    // Actions
    fetchCities,
    getCity,
    createCity,
    updateCity,
    deleteCity,
    getCitiesByDestination,
    searchCities,
    changePage,

    // Utilities
    clearError: () => setError(null),
    refresh: () => fetchCities({ page: currentPage }),
  };
};
