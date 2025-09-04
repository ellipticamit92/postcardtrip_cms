import { packagePricesApi } from "@/lib/api/packagePrices";
import { showToast } from "@/lib/toast";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface PackagePrice {
  phid: number;
  basePrice: number;
  originalPrice: number;
  hotelId: number;
  PackagePriceId: number;
  createdAt: string;
  updatedAt: string;
}

interface UsePackagePricesOptions {
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

export const usePackagePrice = (options: UsePackagePricesOptions = {}) => {
  const { autoFetch = false, initialPage = 1, initialLimit = 150 } = options;

  const [packagePrices, setPackagePrices] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch packages with filters
  const fetchPackagePrices = async (params?: {
    page?: number;
    limit?: number;
    name?: string;
    destinationId?: number;
    sortBy?: "name" | "basePrice" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await packagePricesApi.getAll({
        page: initialPage,
        limit: initialLimit,
        sortBy: "name",
        sortOrder: "asc",
        ...params,
      });

      if (result.success) {
        setPackagePrices(result.data);
        setPagination(result.pagination);
        if (params?.page) {
          setCurrentPage(params.page);
        }
      } else {
        setError(result.error || "Failed to fetch PackagePrices");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get single PackagePrice by ID
  const getPackagePrice = async (id: number): Promise<PackagePrice | null> => {
    try {
      const result = await packagePricesApi.getById(id);
      if (result.success) {
        return result.data as PackagePrice | null;
      } else {
        setError(result.error || "Failed to fetch PackagePrice");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  // Create new PackagePrice
  const createPackagePrice = async (data: {
    basePrice: number;
    originalPrice: number;
    hotelId: number;
    packageId: number;
  }): Promise<{ success: boolean; data?: PackagePrice; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.createLoading("PackagePrice");

    try {
      const result = await packagePricesApi.create(data);

      if (result.success) {
        // Refresh the list if we're showing PackagePrices
        if (packagePrices.length > 0 || autoFetch) {
          await fetchPackagePrices({ page: currentPage });
        }
        toast.dismiss(loadingToast);
        showToast.createSuccess("PackagePrices");
        return { success: true, data: result.data };
      } else {
        toast.dismiss(loadingToast);
        showToast.createError("PackagePrices");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("PackagePrice", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update PackagePrice
  const updatePackagePrice = async (
    id: number,
    data: {
      basePrice: number;
      originalPrice: number;
      hotelId: number;
      packageId: number;
    }
  ): Promise<{ success: boolean; data?: PackagePrice; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.updateLoading("PackagePrice");

    try {
      const result = await packagePricesApi.update(id, data);

      if (result.success) {
        // Update the local state
        setPackagePrices((prev) =>
          prev.map((pkg) =>
            pkg.phid === id ? { ...pkg, ...result.data } : pkg
          )
        );
        toast.dismiss(loadingToast);
        showToast.updateSuccess("PackagePrices");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update PackagePrice");
        toast.dismiss(loadingToast);
        showToast.updateError("PackagePrice", "Failed to update PackagePrice");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.updateError("PackagePrice", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete PackagePrice
  const deletePackagePrice = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await packagePricesApi.delete(id);

      if (result.success) {
        // Remove from local state
        setPackagePrices((prev) => prev.filter((pkg) => pkg.phid !== id));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete PackagePrice");
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

  // Search PackagePrices
  const searchPackagePrices = async (searchTerm: string) => {
    await fetchPackagePrices({
      page: 1,
      name: searchTerm,
    });
  };

  // Change page
  const changePage = async (page: number) => {
    await fetchPackagePrices({ page });
  };

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchPackagePrices();
    }
  }, [autoFetch, fetchPackagePrices]);

  return {
    // State
    packagePrices,
    loading,
    error,
    pagination,
    currentPage,

    // Actions
    fetchPackagePrices,
    getPackagePrice,
    createPackagePrice,
    updatePackagePrice,
    deletePackagePrice,
    searchPackagePrices,
    changePage,

    // Utilities
    clearError: () => setError(null),
    refresh: () => fetchPackagePrices({ page: currentPage }),
  };
};
