import { useState, useEffect } from "react";
import { showToast } from "@/lib/toast";
import { toast } from "sonner";
import { HooksProps } from "@/types/type";
import { DestinationAIDataTYpe } from "@/schemas/destinationName";
import { highlightsApi } from "@/lib/api/highlights";
import { HighlightsAIResponseType } from "@/app/api/auth/ai-generate/highlights/route";
import { Highlight } from "@prisma/client";
import { HighlightFormValues } from "@/components/organisms/highlights/HighlightForm";

export const useHighlights = (options: HooksProps = {}) => {
  const { autoFetch = false, initialPage = 1, initialLimit = 150 } = options;

  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch cities with filters
  const fetchHighlights = async (params?: {
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
      const result = await highlightsApi.getAll({
        page: initialPage,
        limit: initialLimit,
        sortBy: "name",
        sortOrder: "asc",
        ...params,
      });

      if (result.success) {
        setHighlights(result.data);
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
  // const getCity = async (id: number): Promise<City | null> => {
  //   try {
  //     const result = await citiesApi.getById(id);
  //     if (result.success) {
  //       return result.data;
  //     } else {
  //       setError(result.error || "Failed to fetch city");
  //       return null;
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "An error occurred");
  //     return null;
  //   }
  // };

  const createAIHighlights = async (
    data: DestinationAIDataTYpe
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.createLoading("highlights data using ai");
    try {
      const result = await highlightsApi.createAI(data);

      if (result.success) {
        toast.dismiss(loadingToast);
        showToast.createSuccess("highlights");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to create ai highlights");
        toast.dismiss(loadingToast);
        showToast.createError("highlights");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("highlights", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const saveHighlightAIData = async (data: HighlightsAIResponseType[]) => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.createLoading("save highlights ai data");
    try {
      const result = await highlightsApi.saveHighlightData(data);

      if (result.success) {
        toast.dismiss(loadingToast);
        showToast.createSuccess("Highlights");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to save ai highlights data");
        toast.dismiss(loadingToast);
        showToast.createError("highlights");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("highlights", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Create new highlight
  const createHighlight = async (
    data: HighlightFormValues
  ): Promise<{ success: boolean; data?: Highlight; error?: string }> => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.createLoading("highlight");

    try {
      const nameResult = await highlightsApi.getByTitle(data.title);

      if (nameResult.success) {
        const errorMsg = "Highlight title already exist";
        toast.dismiss(loadingToast);
        showToast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      const result = await highlightsApi.create(data);

      if (result.success) {
        // Refresh the list if we're showing cities

        toast.dismiss(loadingToast);
        showToast.createSuccess("Highlight");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to create highlight");
        toast.dismiss(loadingToast);
        showToast.createError("highlight");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("highlight", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update Highlight
  const updateHighlight = async (
    id: number,
    data: HighlightFormValues
  ): Promise<{ success: boolean; data?: Highlight; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.createLoading("highlight");
    try {
      const result = await highlightsApi.update(id, data);

      if (result.success) {
        // Update the local state
        setHighlights((prev) =>
          prev.map((hl) => (hl.hlid === id ? { ...hl, ...result.data } : hl))
        );
        toast.dismiss(loadingToast);
        showToast.updateSuccess("highlight");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update city");
        toast.dismiss(loadingToast);
        showToast.updateError("Highlight", "Failed to update higlight");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.updateError("Highlight", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // // Delete city
  // const deleteCity = async (
  //   id: number
  // ): Promise<{ success: boolean; error?: string }> => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const result = await citiesApi.delete(id);

  //     if (result.success) {
  //       // Remove from local state
  //       setCities((prev) => prev.filter((city) => city.cid !== id));
  //       return { success: true };
  //     } else {
  //       setError(result.error || "Failed to delete city");
  //       return { success: false, error: result.error };
  //     }
  //   } catch (err) {
  //     const errorMsg = err instanceof Error ? err.message : "An error occurred";
  //     setError(errorMsg);
  //     return { success: false, error: errorMsg };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Get cities by destination
  // const getCitiesByDestination = async (destinationId: number) => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const result = await citiesApi.getByDestination(destinationId);
  //     if (result.success) {
  //       setCities(result.data);
  //     } else {
  //       setError(result.error || "Failed to fetch cities");
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "An error occurred");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Search cities
  // const searchCities = async (searchTerm: string) => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const result = await citiesApi.search(searchTerm);
  //     if (result.success) {
  //       setCities(result.data);
  //       setPagination(null); // Search doesn't return pagination
  //     } else {
  //       setError(result.error || "Failed to search cities");
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "An error occurred");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Change page
  const changePage = async (page: number) => {
    await fetchHighlights({ page });
  };

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchHighlights();
    }
  }, [autoFetch, fetchHighlights]);

  return {
    // State
    highlights,
    loading,
    error,
    currentPage,

    // Actions
    createAIHighlights,
    updateHighlight,
    saveHighlightAIData,
    createHighlight,
    fetchHighlights,
    changePage,

    // Utilities
    clearError: () => setError(null),
    refresh: () => fetchHighlights({ page: currentPage }),
  };
};
