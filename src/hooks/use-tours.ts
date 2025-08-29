import { toursApi } from "@/lib/api/tours";
import { showToast } from "@/lib/toast";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Tour {
  tid: number;
  text: string;
  icon?: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourPayload {
  text: string;
  icon?: string | null;
  description: string;
  baePrice?: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const useTours = (
  options: {
    autoFetch?: boolean;
    initialPage?: number;
    initialLimit?: number;
  } = {}
) => {
  const { autoFetch = true, initialPage = 1, initialLimit = 20 } = options;

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch Tours
  const fetchTours = async (params?: {
    page?: number;
    limit?: number;
    text?: string;
    sortBy?: "tid" | "createdAt" | "updatedAt" | "text";
    sortOrder?: "asc" | "desc";
  }) => {
    setLoading(true);
    setError(null);
    try {
      const search = new URLSearchParams();
      search.set("page", String(params?.page ?? initialPage));
      search.set("limit", String(params?.limit ?? initialLimit));
      if (params?.text) search.set("text", params.text);
      if (params?.sortBy) search.set("sortBy", params.sortBy);
      if (params?.sortOrder) search.set("sortOrder", params.sortOrder);

      const result = await toursApi.getAll(params);
      if (result.success) {
        setTours(result.data);
        setPagination(result.pagination);
        if (params?.page) setCurrentPage(params.page);
      } else {
        setError(result.error || "Failed to fetch tours");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch tours");
    } finally {
      setLoading(false);
    }
  };

  // Get single Tour
  const getTour = async (tid: number): Promise<Tour | null> => {
    try {
      const response = await fetch(`/api/tours/${tid}`);
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      setError(result.error || "Tour not found");
      return null;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tour");
      return null;
    }
  };

  // Create Tour
  const createTour = async (
    data: TourPayload
  ): Promise<{ success: boolean; data?: Tour; error?: string }> => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.createLoading("tours");
    try {
      const nameResult = await toursApi.getByName(data.text);
      if (nameResult.success) {
        const errorMsg = "Destination name already exist";
        toast.dismiss(loadingToast);
        showToast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      const result = await toursApi.create(data);
      if (result.success) {
        toast.dismiss(loadingToast);
        showToast.createSuccess("Tours");
        await fetchTours({ page: currentPage });
        return { success: true, data: result.data };
      } else {
        toast.dismiss(loadingToast);
        showToast.createError("Tours");
        setError(result.error || "Failed to create tour");
        return { success: false, error: result.error };
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("tour", errorMsg);

      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update Tour
  const updateTour = async (
    tid: number,
    data: Partial<TourPayload>
  ): Promise<{ success: boolean; data?: Tour; error?: string }> => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.createLoading("tours");
    try {
      const result = await toursApi.update(tid, data);
      if (result.success) {
        toast.dismiss(loadingToast);
        showToast.updateSuccess("Tour");
        setTours((prev) =>
          prev.map((t) => (t.tid === tid ? { ...t, ...result.data } : t))
        );
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update tour");
        toast.dismiss(loadingToast);
        setError(result.error || "Failed to update tour");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.updateError("Tour", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete Tour
  const deleteTour = async (
    tid: number
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await toursApi.delete(tid);
      if (result.success) {
        setTours((prev) => prev.filter((t) => t.tid !== tid));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete tour");
        return { success: false, error: result.error };
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete tour";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Change page
  const changePage = async (page: number) => {
    await fetchTours({ page });
  };

  useEffect(() => {
    if (autoFetch) fetchTours();
  }, [autoFetch]);

  return {
    // State
    tours,
    loading,
    error,
    pagination,
    currentPage,
    // Actions
    fetchTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    changePage,
    clearError: () => setError(null),
    refresh: () => fetchTours({ page: currentPage }),
  };
};
