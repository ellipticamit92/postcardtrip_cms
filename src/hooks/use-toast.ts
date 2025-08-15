import { showToast } from "@/lib/toast";
import { useCallback } from "react";

export function useToast() {
  const handleAsyncWithPromise = useCallback(
    async <T>(
      operation: () => Promise<T>,
      entity: string,
      successMessage?: (data: T) => string
    ) => {
      return showToast.promise(operation(), {
        loading: `Processing ${entity}...`,
        success: successMessage || (() => `${entity} processed successfully`),
        error: (err) => `Failed to process ${entity}: ${err.message}`,
      });
    },
    []
  );

  const handleAsyncOperation = useCallback(
    async (
      operation: () => Promise<any>,
      entity: string,
      action: "create" | "update" | "delete" | "fetch"
    ) => {
      const loadingToast = showToast[`${action}Loading`](entity);

      try {
        const result = await operation();
        showToast.dismiss(loadingToast);
        showToast[`${action}Success`](entity);
        return result;
      } catch (error: any) {
        showToast.dismiss(loadingToast);
        showToast[`${action}Error`](entity, error.message);
        throw error;
      }
    },
    []
  );

  return {
    handleAsyncOperation,
    handleAsyncWithPromise,
    ...showToast,
  };
}
