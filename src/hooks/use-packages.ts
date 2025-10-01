import { PackageAIFormDataType } from "@/components/organisms/packages/PackageAIForm";
import { PackageFormDataType } from "@/components/organisms/packages/PackageForm";
import { packagesApi } from "@/lib/api/packages";
import { showToast } from "@/lib/toast";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Package {
  pid: number;
  name: string;
  destinationId: number;
  description?: string;
  basePrice: number;
  day: number;
  night: number;
  imageUrl?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsePackagesOptions {
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

export const usePackages = (options: UsePackagesOptions = {}) => {
  const { autoFetch = false, initialPage = 1, initialLimit = 150 } = options;

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch packages with filters
  const fetchPackages = async (params?: {
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
      const result = await packagesApi.getAll({
        page: initialPage,
        limit: initialLimit,
        sortBy: "name",
        sortOrder: "asc",
        ...params,
      });

      if (result.success) {
        setPackages(result.data);
        setPagination(result.pagination);
        if (params?.page) {
          setCurrentPage(params.page);
        }
      } else {
        setError(result.error || "Failed to fetch packages");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get single package by ID
  const getPackage = async (id: number): Promise<Package | null> => {
    try {
      const result = await packagesApi.getById(id);
      if (result.success) {
        return result.data as Package | null;
      } else {
        setError(result.error || "Failed to fetch package");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  const createAIPackage = async (
    data: PackageAIFormDataType
  ): Promise<{ success: boolean; data?: Package; error?: string }> => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.createLoading("package");
    try {
      const result = await packagesApi.createAI(data);
      if (result.success) {
        // Refresh the list if we're showing packages
        if (packages.length > 0 || autoFetch) {
          await fetchPackages({ page: currentPage });
        }
        toast.dismiss(loadingToast);
        showToast.createSuccess("Packages");
        return { success: true, data: result.data };
      } else {
        toast.dismiss(loadingToast);
        showToast.createError("Packages");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("package", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Create new package
  const createPackage = async (
    data: PackageFormDataType
  ): Promise<{ success: boolean; data?: Package; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.createLoading("package");

    try {
      const nameResult = await packagesApi.getByName(data.name);

      if (nameResult.success) {
        const errorMsg = "Package name already exists";
        toast.dismiss(loadingToast);
        showToast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      const result = await packagesApi.create(data);

      if (result.success) {
        // Refresh the list if we're showing packages
        if (packages.length > 0 || autoFetch) {
          await fetchPackages({ page: currentPage });
        }
        toast.dismiss(loadingToast);
        showToast.createSuccess("Packages");
        return { success: true, data: result.data };
      } else {
        toast.dismiss(loadingToast);
        showToast.createError("Packages");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError("package", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update package
  const updatePackage = async (
    id: number,
    data: PackageFormDataType
  ): Promise<{ success: boolean; data?: Package; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.updateLoading("package");

    try {
      const result = await packagesApi.update(id, data);

      if (result.success) {
        // Update the local state
        setPackages((prev) =>
          prev.map((pkg) => (pkg.pid === id ? { ...pkg, ...result.data } : pkg))
        );
        toast.dismiss(loadingToast);
        showToast.updateSuccess("Packages");
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update package");
        toast.dismiss(loadingToast);
        showToast.updateError("Package", "Failed to update package");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.updateError("Package", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete package
  const deletePackage = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await packagesApi.delete(id);

      if (result.success) {
        // Remove from local state
        setPackages((prev) => prev.filter((pkg) => pkg.pid !== id));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete package");
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

  // Search packages
  const searchPackages = async (searchTerm: string) => {
    await fetchPackages({
      page: 1,
      name: searchTerm,
    });
  };

  // Change page
  const changePage = async (page: number) => {
    await fetchPackages({ page });
  };

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchPackages();
    }
  }, [autoFetch, fetchPackages]);

  return {
    // State
    packages,
    loading,
    error,
    pagination,
    currentPage,

    // Actions
    fetchPackages,
    getPackage,
    createPackage,
    createAIPackage,
    updatePackage,
    deletePackage,
    searchPackages,
    changePage,

    // Utilities
    clearError: () => setError(null),
    refresh: () => fetchPackages({ page: currentPage }),
  };
};
