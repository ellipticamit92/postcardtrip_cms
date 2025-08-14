// src/lib/api/highlights.ts

export interface IEHPayload {
  text: string;
}

export interface IEH {
  hlid?: number;
  eid?: number;
  lid?: number;
  text: string;
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

const BASE = "/api/auth/ieh";

export const IEHApi = {
  // List highlights with pagination & search (by text)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    text?: string;
    sortBy?: "hlid" | "eid" | "lid" | "createdAt" | "updatedAt" | "text";
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

  // Get single highlight by ID
  getById: async (hlid: number) => {
    const response = await fetch(`${BASE}/${hlid}`);
    return response.json();
  },

  // Get by exact text value (if you implement such an endpoint)
  getByText: async (text: string) => {
    const response = await fetch(`${BASE}/text/${encodeURIComponent(text)}`);
    return response.json();
  },

  // Create a new highlight
  create: async (data: IEHPayload) => {
    const response = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update
  update: async (id: number, data: { text?: string; type: string }) => {
    const response = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete
  delete: async (id: string) => {
    const response = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    return response.json();
  },

  getByName: async (name: string, type: string) => {
    const response = await fetch(
      `${BASE}/name/${encodeURIComponent(`${name}_${type}`)}`
    );
    return response.json();
  },
};
