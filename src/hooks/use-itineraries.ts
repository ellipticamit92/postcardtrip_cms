import { ItinerariesFormData } from "@/components/organisms/itineraries/ItinerariesForm";
import { ApiResponse, itinerariesApi } from "@/lib/api/itineraries";
import { showToast } from "@/lib/toast";
import { Itinerary } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ItineraryFilters {
  packageId?: number;
  day?: number;
  minDay?: number;
  maxDay?: number;
  search?: string;
  page?: number;
  limit?: number;
  autoFetch: boolean;
}

export function useItineraries(
  initialFilters: ItineraryFilters = {
    autoFetch: false,
  }
) {
  const { autoFetch } = initialFilters;
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApiResponse["pagination"]>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState<ItineraryFilters>(initialFilters);

  // Fetch list with filters
  const fetchItineraries = async (page?: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await itinerariesApi.getAll({
        ...filters,
        page: page ?? filters.page ?? 1,
        limit: filters.limit ?? 10,
      });
      if (res.success) {
        setItineraries(res.data || []);
        setPagination(res.pagination || pagination);
      } else {
        setError(res.error || "Failed to load itineraries");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to fetch itineraries");
    } finally {
      setLoading(false);
    }
  };

  // Fetch one by ID
  const fetchItinerary = async (itid: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await itinerariesApi.getById(itid);
      if (res.success) {
        setItinerary(res.data || null);
      } else {
        setError(res.error || "Itinerary not found");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to fetch itinerary");
    } finally {
      setLoading(false);
    }
  };

  // Create
  const createItinerary = async (data: ItinerariesFormData) => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.createLoading("itinerary");
    try {
      const nameResult = await itinerariesApi.getByPackageId(data.packageId);

      if (nameResult.success) {
        const errorMsg = "Package Itinerary already exists";
        toast.dismiss(loadingToast);
        showToast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      const res = await itinerariesApi.create(data);
      if (res.success) {
        fetchItineraries();
        toast.dismiss(loadingToast);
        showToast.createSuccess("Itinerary");
        return res.data;
      } else {
        toast.dismiss(loadingToast);
        showToast.createError("itinerary");
        setError(res.error || "Failed to create itinerary");
        throw new Error(res.error || "Failed to create itinerary");
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to create itinerary";
      toast.dismiss(loadingToast);
      showToast.createError("itinerary", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Update
  const updateItinerary = async (
    pkgId: number,
    data: Partial<ItinerariesFormData>
  ) => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.updateLoading("itinerary");
    try {
      const res = await itinerariesApi.update(pkgId, data);
      if (res.success) {
        fetchItineraries();
        toast.dismiss(loadingToast);
        showToast.updateSuccess("itinerary");
        return res.data;
      } else {
        setError(res.error || "Failed to update itinerary");
        toast.dismiss(loadingToast);
        showToast.updateError("Itinerary", "Failed to update itinerary");
        return { success: false, error: res.error };
      }
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.updateError("Itinerary", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const deleteItinerary = async (itid: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await itinerariesApi.delete(itid);
      if (res.success) {
        setItineraries((prev) => prev.filter((it) => it.itid !== itid));
      } else {
        setError(res.error || "Failed to delete itinerary");
        throw new Error(res.error || "Failed to delete itinerary");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to delete itinerary");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Search (by title/details/etc)
  const searchItineraries = async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await itinerariesApi.search(search);
      if (res.success) {
        setItineraries(res.data || []);
        setPagination(res.pagination || pagination);
      } else {
        setError(res.error || "Failed to search itineraries");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to search itineraries");
    } finally {
      setLoading(false);
    }
  };

  // Filter setter
  const updateFilters = (newFilters: ItineraryFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    if (autoFetch) {
      fetchItineraries();
    }

    // eslint-disable-next-line
  }, [autoFetch]);

  return {
    itineraries,
    itinerary,
    loading,
    error,
    pagination,
    filters,
    fetchItineraries,
    fetchItinerary,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    searchItineraries,
    updateFilters,
  };
}
