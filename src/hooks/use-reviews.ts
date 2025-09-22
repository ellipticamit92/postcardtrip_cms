import { ReviewFormDataType } from "@/components/organisms/reviews/ReviewsForm";
import { reviewsApi } from "@/lib/api/reviews";
import { showToast } from "@/lib/toast";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Review {
  id: string;
  username: string;
  places: string;
  review: string;
  rating: number;
  packageId: number;
  destinationId: number;
  createdAt: string;
  updatedAt: string;
}

interface UseReviewsOptions {
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

export const useReviews = (options: UseReviewsOptions = {}) => {
  const { autoFetch = false, initialPage = 1, initialLimit = 20 } = options;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch reviews with filters
  const fetchReviews = async (params?: {
    page?: number;
    limit?: number;
    packageId?: number;
    destinationId?: number;
    sortBy?: "createdAt" | "rating";
    sortOrder?: "asc" | "desc";
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await reviewsApi.getAll({
        page: initialPage,
        limit: initialLimit,
        sortBy: "createdAt",
        sortOrder: "desc",
        ...params,
      });

      if (result.success) {
        setReviews(result.data);
        // setPagination(result.pagination);
        if (params?.page) {
          setCurrentPage(params.page);
        }
      } else {
        setError(result.error || "Failed to fetch reviews");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get single review
  const getReview = async (id: string): Promise<Review | null> => {
    try {
      const result = await reviewsApi.getById(id);
      if (result.success) {
        return result.data as Review | null;
      } else {
        setError(result.error || "Failed to fetch review");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  // Create review
  const createReview = async (
    data: ReviewFormDataType
  ): Promise<{ success: boolean; data?: Review; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.createLoading("review");

    try {
      const result = await reviewsApi.create(data);

      if (result.success) {
        if (reviews.length > 0 || autoFetch) {
          await fetchReviews({ page: currentPage });
        }
        toast.dismiss(loadingToast);
        showToast.createSuccess("Review");
        return { success: true, data: result.data };
      } else {
        toast.dismiss(loadingToast);
        showToast.createError("Review");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("review", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update review
  const updateReview = async (
    id: string,
    data: ReviewFormDataType
  ): Promise<{ success: boolean; data?: Review; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.updateLoading("review");

    try {
      const result = await reviewsApi.update(id, data);

      if (result.success) {
        setReviews((prev) =>
          prev.map((rev) => (rev.id === id ? { ...rev, ...result.data } : rev))
        );
        toast.dismiss(loadingToast);
        showToast.updateSuccess("Review");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update review");
        toast.dismiss(loadingToast);
        showToast.updateError("Review", "Failed to update review");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.updateError("Review", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete review
  const deleteReview = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await reviewsApi.delete(id);

      if (result.success) {
        setReviews((prev) => prev.filter((rev) => rev.id !== id));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete review");
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

  // Search reviews (by places or username)
  const searchReviews = async () => {
    await fetchReviews({
      page: 1,
    });
  };

  // Change page
  const changePage = async (page: number) => {
    await fetchReviews({ page });
  };

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchReviews();
    }
  }, [autoFetch]);

  return {
    reviews,
    loading,
    error,
    pagination,
    currentPage,

    fetchReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    searchReviews,
    changePage,

    clearError: () => setError(null),
    refresh: () => fetchReviews({ page: currentPage }),
  };
};
