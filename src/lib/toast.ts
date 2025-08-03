import { TOAST_MESSAGES } from "@/consttants/toast-message";
import { toast } from "sonner";

export const showToast = {
  // CREATE operations
  createSuccess: (entity: string) =>
    toast.success(TOAST_MESSAGES.CREATE.SUCCESS(entity)),
  createError: (entity: string, error?: string) =>
    toast.error(error || TOAST_MESSAGES.CREATE.ERROR(entity)),
  createLoading: (entity: string) =>
    toast.loading(TOAST_MESSAGES.CREATE.LOADING(entity)),

  // UPDATE operations
  updateSuccess: (entity: string) =>
    toast.success(TOAST_MESSAGES.UPDATE.SUCCESS(entity)),
  updateError: (entity: string, error?: string) =>
    toast.error(error || TOAST_MESSAGES.UPDATE.ERROR(entity)),
  updateLoading: (entity: string) =>
    toast.loading(TOAST_MESSAGES.UPDATE.LOADING(entity)),

  // DELETE operations
  deleteSuccess: (entity: string) =>
    toast.success(TOAST_MESSAGES.DELETE.SUCCESS(entity)),
  deleteError: (entity: string, error?: string) =>
    toast.error(error || TOAST_MESSAGES.DELETE.ERROR(entity)),
  deleteLoading: (entity: string) =>
    toast.loading(TOAST_MESSAGES.DELETE.LOADING(entity)),

  // FETCH operations
  fetchSuccess: (entity: string) =>
    toast.success(TOAST_MESSAGES.FETCH.SUCCESS(entity)),
  fetchError: (entity: string, error?: string) =>
    toast.error(error || TOAST_MESSAGES.FETCH.ERROR(entity)),
  fetchLoading: (entity: string) =>
    toast.loading(TOAST_MESSAGES.FETCH.LOADING(entity)),

  // BULK operations
  bulkCreateSuccess: (count: number, entity: string) =>
    toast.success(TOAST_MESSAGES.BULK.CREATE_SUCCESS(count, entity)),
  bulkUpdateSuccess: (count: number, entity: string) =>
    toast.success(TOAST_MESSAGES.BULK.UPDATE_SUCCESS(count, entity)),
  bulkDeleteSuccess: (count: number, entity: string) =>
    toast.success(TOAST_MESSAGES.BULK.DELETE_SUCCESS(count, entity)),

  // SEARCH operations
  searchSuccess: (count: number, entity: string) =>
    toast.success(TOAST_MESSAGES.SEARCH.SUCCESS(count, entity)),
  searchNoResults: (query: string, entity: string) =>
    toast.info(TOAST_MESSAGES.SEARCH.NO_RESULTS(query, entity)),
  searchError: (entity: string) =>
    toast.error(TOAST_MESSAGES.SEARCH.ERROR(entity)),

  // VALIDATION errors
  validationError: (field: string) =>
    toast.error(TOAST_MESSAGES.VALIDATION.REQUIRED(field)),
  invalidError: (field: string) =>
    toast.error(TOAST_MESSAGES.VALIDATION.INVALID(field)),
  existsError: (entity: string) =>
    toast.error(TOAST_MESSAGES.VALIDATION.EXISTS(entity)),
  notFoundError: (entity: string) =>
    toast.error(TOAST_MESSAGES.VALIDATION.NOT_FOUND(entity)),

  // GENERAL messages
  success: (message?: string) =>
    toast.success(message || TOAST_MESSAGES.GENERAL.SUCCESS),
  error: (message?: string) =>
    toast.error(message || TOAST_MESSAGES.GENERAL.ERROR),
  loading: (message?: string) =>
    toast.loading(message || TOAST_MESSAGES.GENERAL.LOADING),
  networkError: () => toast.error(TOAST_MESSAGES.GENERAL.NETWORK_ERROR),
  serverError: () => toast.error(TOAST_MESSAGES.GENERAL.SERVER_ERROR),

  // Sonner specific features
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: (data: T) => string | string;
      error: (err: any) => string | string;
    }
  ) => toast.promise(promise, { loading, success, error }),

  // Custom toast with actions
  withAction: (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    action?: {
      label: string;
      onClick: () => void;
    }
  ) => {
    const toastFn = toast[type];
    return toastFn(message, {
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },

  // Dismiss specific toast
  dismiss: (id?: string | number) => toast.dismiss(id),

  // Custom styled toasts
  custom: (jsx: any) => toast.custom(jsx),
};
