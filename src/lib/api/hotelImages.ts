export interface HotelImagePayload {
  url: string;
  caption?: string;
  hotelId: number;
}

export interface HotelImage {
  hiid: number;
  url: string;
  caption?: string;
  hotelId: number;
  updatedAt: string;
  createdAt: string;
  hotel?: any; // You can type this if you want
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

const BASE = "/api/auth/hotel-images";

export const hotelImagesApi = {
  /**
   * Get images list, optionally filtered by hotelId + pagination
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    hotelId?: number;
    caption?: string;
    sortBy?: "createdAt" | "hiid";
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<HotelImage[]>> => {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.hotelId) search.set("hotelId", String(params.hotelId));
    if (params?.caption) search.set("caption", params.caption);
    if (params?.sortBy) search.set("sortBy", params.sortBy);
    if (params?.sortOrder) search.set("sortOrder", params.sortOrder);

    const response = await fetch(`${BASE}?${search.toString()}`);
    return response.json();
  },

  /**
   * Get single hotel image by id
   */
  getById: async (id: number): Promise<ApiResponse<HotelImage>> => {
    const response = await fetch(`${BASE}/${id}`);
    return response.json();
  },

  /**
   * Get images by hotel
   */
  getByHotel: async (hotelId: number): Promise<ApiResponse<HotelImage[]>> => {
    const response = await fetch(`${BASE}?hotelId=${hotelId}`);
    return response.json();
  },

  /**
   * Create new hotel image
   */
  create: async (data: HotelImagePayload): Promise<ApiResponse<HotelImage>> => {
    const response = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Update image
   */
  update: async (
    id: number,
    data: Partial<Omit<HotelImagePayload, "hotelId">>
  ): Promise<ApiResponse<HotelImage>> => {
    const response = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Delete image
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await fetch(`${BASE}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  /**
   * Bulk create images (optional, if supported)
   */
  bulkCreate: async (
    images: HotelImagePayload[]
  ): Promise<ApiResponse<null>> => {
    const response = await fetch(`${BASE}/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(images),
    });
    return response.json();
  },

  /**
   * Search images by caption (optional, if your API supports)
   */
  search: async (params?: {
    caption?: string;
    hotelId?: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<HotelImage[]>> => {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) search.set(key, String(value));
    });

    const response = await fetch(`${BASE}/search?${search.toString()}`);
    return response.json();
  },
};
