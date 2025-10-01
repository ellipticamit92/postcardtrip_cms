import { PackageAIFormDataType } from "@/components/organisms/packages/PackageAIForm";
import { PackageFormDataType } from "@/components/organisms/packages/PackageForm";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  error?: string;
}

const BASE = "/api/auth/packages";
const AI_API_URL = "/api/auth/ai-generate/package";

export const packagesApi = {
  /* List with pagination & filters */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    destinationId?: number;
    cityId?: number;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    name?: string;
    sortBy?: "name" | "basePrice" | "day" | "night" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.destinationId)
      search.set("destinationId", String(params.destinationId));
    if (params?.cityId) search.set("cityId", String(params.cityId));
    if (params?.minPrice) search.set("minPrice", String(params.minPrice));
    if (params?.maxPrice) search.set("maxPrice", String(params.maxPrice));
    if (params?.minDuration)
      search.set("minDuration", String(params.minDuration));
    if (params?.maxDuration)
      search.set("maxDuration", String(params.maxDuration));
    if (params?.name) search.set("name", params.name);
    if (params?.sortBy) search.set("sortBy", params.sortBy);
    if (params?.sortOrder) search.set("sortOrder", params.sortOrder);

    const response = await fetch(`${BASE}?${search.toString()}`);
    return response.json();
  },

  /* Single package by id */
  getById: async (id: number) => {
    const response = await fetch(`${BASE}/${id}`);
    return response.json();
  },

  /* Packages by destination */
  getByDestination: async (destinationId: number) => {
    const response = await fetch(`${BASE}/destination/${destinationId}`);
    return response.json();
  },

  /* Packages by city */
  getByCity: async (cityId: number) => {
    const response = await fetch(`${BASE}/city/${cityId}`);
    return response.json();
  },

  /* Create */
  create: async (data: PackageFormDataType) => {
    const response = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  createAI: async (data: PackageAIFormDataType) => {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /* Update */
  update: async (id: number, data: Partial<PackageFormDataType>) => {
    const response = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /* Delete */
  delete: async (id: number) => {
    const response = await fetch(`${BASE}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  /* Search with filters */
  search: async (filters: {
    destination?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    starRating?: number;
    page?: number;
    limit?: number;
    tourType?: string;
  }) => {
    const search = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) search.set(key, String(value));
    });

    const response = await fetch(`${BASE}/search?${search.toString()}`);
    return response.json();
  },

  /* Get package by name */
  getByName: async (name: string) => {
    const response = await fetch(`${BASE}/name/${encodeURIComponent(name)}`);
    return response.json();
  },
};
