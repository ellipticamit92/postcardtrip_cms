// lib/constants/toastMessages.ts

export const TOAST_MESSAGES = {
  // CREATE operations
  CREATE: {
    SUCCESS: (entity: string) => `${entity} created successfully`,
    ERROR: (entity: string) => `Failed to create ${entity}`,
    LOADING: (entity: string) => `Creating ${entity}...`,
  },

  // READ operations
  FETCH: {
    SUCCESS: (entity: string) => `${entity} loaded successfully`,
    ERROR: (entity: string) => `Failed to load ${entity}`,
    LOADING: (entity: string) => `Loading ${entity}...`,
    EMPTY: (entity: string) => `No ${entity} found`,
  },

  // UPDATE operations
  UPDATE: {
    SUCCESS: (entity: string) => `${entity} updated successfully`,
    ERROR: (entity: string) => `Failed to update ${entity}`,
    LOADING: (entity: string) => `Updating ${entity}...`,
  },

  // DELETE operations
  DELETE: {
    SUCCESS: (entity: string) => `${entity} deleted successfully`,
    ERROR: (entity: string) => `Failed to delete ${entity}`,
    LOADING: (entity: string) => `Deleting ${entity}...`,
    CONFIRM: (entity: string) =>
      `Are you sure you want to delete this ${entity}?`,
  },

  // BULK operations
  BULK: {
    CREATE_SUCCESS: (count: number, entity: string) =>
      `${count} ${entity}s created successfully`,
    CREATE_ERROR: (entity: string) => `Failed to create multiple ${entity}s`,
    UPDATE_SUCCESS: (count: number, entity: string) =>
      `${count} ${entity}s updated successfully`,
    UPDATE_ERROR: (entity: string) => `Failed to update multiple ${entity}s`,
    DELETE_SUCCESS: (count: number, entity: string) =>
      `${count} ${entity}s deleted successfully`,
    DELETE_ERROR: (entity: string) => `Failed to delete multiple ${entity}s`,
  },

  // SEARCH operations
  SEARCH: {
    SUCCESS: (count: number, entity: string) => `Found ${count} ${entity}s`,
    NO_RESULTS: (query: string, entity: string) =>
      `No ${entity}s found for "${query}"`,
    ERROR: (entity: string) => `Failed to search ${entity}s`,
  },

  // VALIDATION errors
  VALIDATION: {
    REQUIRED: (field: string) => `${field} is required`,
    INVALID: (field: string) => `${field} is invalid`,
    EXISTS: (entity: string) => `${entity} already exists`,
    NOT_FOUND: (entity: string) => `${entity} not found`,
    UNAUTHORIZED: "You are not authorized to perform this action",
    FORBIDDEN: "Access denied",
  },

  // GENERAL messages
  GENERAL: {
    SUCCESS: "Operation completed successfully",
    ERROR: "Something went wrong. Please try again",
    LOADING: "Processing...",
    NETWORK_ERROR: "Network error. Please check your connection",
    SERVER_ERROR: "Server error. Please try again later",
    TIMEOUT: "Request timeout. Please try again",
  },
} as const;
