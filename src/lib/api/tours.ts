// src/lib/api/tours.ts

export interface TourPayload {
  text: string;
  icon?: string | null;
  description: string;
  basePrice?: number;
}

export interface Tour {
  tid: number;
  text: string;
  icon?: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
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

const BASE = "/api/auth/tours";

export const toursApi = {
  // List with pagination & search
  getAll: async (params?: {
    page?: number;
    limit?: number;
    text?: string;
    sortBy?: "tid" | "createdAt" | "updatedAt" | "text";
    sortOrder?: "asc" | "desc";
  }) => {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.text) search.set("text", params.text);
    if (params?.sortBy) search.set("sortBy", params.sortBy);
    if (params?.sortOrder) search.set("sortOrder", params.sortOrder);

    const response = await fetch(`${BASE}?${search.toString()}`);
    return response.json();
  },

  // Get single tour by ID
  getById: async (tid: number) => {
    const response = await fetch(`${BASE}/${tid}`);
    return response.json();
  },

  // Get by exact text (optional, if endpoint implemented)
  getByText: async (text: string) => {
    const response = await fetch(`${BASE}/text/${encodeURIComponent(text)}`);
    return response.json();
  },

  // Create
  create: async (data: TourPayload) => {
    const response = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update
  update: async (tid: number, data: Partial<TourPayload>) => {
    const response = await fetch(`${BASE}/${tid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete
  delete: async (tid: number) => {
    const response = await fetch(`${BASE}/${tid}`, { method: "DELETE" });
    return response.json();
  },

  getByName: async (name: string) => {
    const response = await fetch(`${BASE}/name/${encodeURIComponent(name)}`);
    return response.json();
  },
};
