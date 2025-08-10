// src/lib/api/hotels.ts
export interface HotelPayload {
  name: string;
  description: string;
  starRating: number;
  cityId: number;
  images?: { url: string; caption?: string }[];
}

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

const BASE = "/api/auth/hotels";

export const hotelsApi = {
  /* List with pagination & filters */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    cityId?: number;
    name?: string;
    starRating?: number;
    minStarRating?: number;
    maxStarRating?: number;
    sortBy?: "name" | "starRating" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.cityId) search.set("cityId", String(params.cityId));
    if (params?.name) search.set("name", params.name);
    if (params?.starRating) search.set("starRating", String(params.starRating));
    if (params?.minStarRating)
      search.set("minStarRating", String(params.minStarRating));
    if (params?.maxStarRating)
      search.set("maxStarRating", String(params.maxStarRating));
    if (params?.sortBy) search.set("sortBy", params.sortBy);
    if (params?.sortOrder) search.set("sortOrder", params.sortOrder);

    const response = await fetch(`${BASE}?${search.toString()}`);
    return response.json();
  },

  /* Single hotel by id */
  getById: async (id: number) => {
    const response = await fetch(`${BASE}/${id}`);
    return response.json();
  },

  /* Hotels by city */
  getByCity: async (cityId: number) => {
    const response = await fetch(`${BASE}/city/${cityId}`);
    return response.json();
  },

  /* Create */
  create: async (data: HotelPayload) => {
    const response = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /* Update */
  update: async (id: number, data: Partial<HotelPayload>) => {
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
  search: async (params?: {
    name?: string;
    starRating?: number;
    minStar?: number;
    maxStar?: number;
    cityId?: number;
    page?: number;
    limit?: number;
  }) => {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) search.set(key, String(value));
    });

    const response = await fetch(`${BASE}/search?${search.toString()}`);
    return response.json();
  },

  /* Search hotels by name */
  searchByName: async (name: string) => {
    const response = await fetch(
      `${BASE}/search?name=${encodeURIComponent(name)}`
    );
    return response.json();
  },

  /* Get hotel by name */
  getByName: async (name: string) => {
    const response = await fetch(`${BASE}/name/${encodeURIComponent(name)}`);
    return response.json();
  },
};
