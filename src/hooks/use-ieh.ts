import { IEHApi } from "@/lib/api/ieh";
import { showToast } from "@/lib/toast";
import { IEHType } from "@/types/type";
import { useState } from "react";
import { toast } from "sonner";

// interface IEH {
//   hlid?: number;
//   lid?: number;
//   eid?: number;
//   name: string;
// }

interface UseIEHOptions {
  autoFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
  type: IEHType;
}

// interface PaginationInfo {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

export const useIEH = (options: UseIEHOptions) => {
  // const {
  //   // autoFetch = false,
  //   // initialPage = 1,
  //   // initialLimit = 10,
  //   // type,
  // } = options;

  // const [ieh, setIEH] = useState<IEH[]>([]);
  const [loading, setLoading] = useState(false);
  const [_, setError] = useState<string | null>(null);
  // const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  // const [currentPage, setCurrentPage] = useState(initialPage);

  const createIEH = async (
    data: {
      text: string;
    },
    type: string
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.createLoading(type);
    try {
      const nameResult = await IEHApi.getByName(data.text, type);

      if (nameResult && nameResult?.success) {
        const errorMsg = `${type} already exist`;
        toast.dismiss(loadingToast);
        showToast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
      const updateData = {
        ...data,
        type,
      };

      const result = await IEHApi.create(updateData);
      if (result.success) {
        // Refresh the list if we're showing packages
        // if ( autoFetch) {
        //  // await fetchPackages({ page: currentPage });
        // }
        toast.dismiss(loadingToast);
        showToast.createSuccess(type);
        return { success: true, data: result.data };
      } else {
        toast.dismiss(loadingToast);
        showToast.createError(type);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      toast.dismiss(loadingToast);
      showToast.createError(type, errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateIEH = async (
    id: number,
    data: {
      text: string;
    },
    type: string
  ) => {
    setLoading(true);
    setError(null);

    const loadingToast = showToast.updateLoading(type);

    try {
      const updateData = {
        ...data,
        type,
      };

      const result = await IEHApi.update(id, updateData);

      if (result.success) {
        // Update the local state
        toast.dismiss(loadingToast);
        showToast.updateSuccess(type);
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to update");
        toast.dismiss(loadingToast);
        showToast.updateError(type, "Failed to update");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      toast.dismiss(loadingToast);
      showToast.updateError(type, errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /*
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
  const getById = async (id: number): Promise<Package | null> => {
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

  // Create new package
  const createPackage = async (data: {
    name: string;
    destinationId: number;
    description: string;
    basePrice: number;
    day: number;
    night: number;
    cityId: number;
    imageUrl: string;
  }): Promise<{ success: boolean; data?: Package; error?: string }> => {
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
    data: {
      name?: string;
      destinationId?: number;
      description?: string;
      price?: number;
      duration?: number;
      imageUrl?: string;
    }
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
  }, [autoFetch]);

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
    updatePackage,
    deletePackage,
    searchPackages,
    changePage,

    // Utilities
    clearError: () => setError(null),
    refresh: () => fetchPackages({ page: currentPage }),
  };
  */

  return {
    // State
    loading,

    // Actions
    createIEH,
    updateIEH,
  };
};
