import { HighlightsAIResponseType } from "@/app/api/auth/ai-generate/highlights/route";
import { CityFormValues } from "@/components/organisms/city/CityForm";
import { DestinationAIDataTYpe } from "@/schemas/destinationName";
import { PageInfo } from "next/dist/build/utils";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  pagination?: PageInfo;
  message?: string;
  error?: string;
}

const BASE = "/api/auth/highlights";
const AI_API_URL = "/api/auth/ai-generate/highlights";

export const highlightsApi = {
  /* List with pagination & filters */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    name?: string;
    sortBy?: "name" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.name) search.set("name", params.name);
    if (params?.sortBy) search.set("sortBy", params.sortBy);
    if (params?.sortOrder) search.set("sortOrder", params.sortOrder);

    const response = await fetch(`${BASE}?${search.toString()}`);
    return response.json();
  },

  /* Single city by id */
  getById: async (id: number) => {
    const response = await fetch(`${BASE}/${id}`);
    return response.json();
  },

  /* Cities by destination */
  getByDestination: async (destinationId: number) => {
    const response = await fetch(`${BASE}/destination/${destinationId}`);
    return response.json();
  },

  /* Create */
  create: async (data: CityFormValues) => {
    const response = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  createAI: async (data: DestinationAIDataTYpe) => {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  saveHighlightData: async (data: HighlightsAIResponseType[]) => {
    const response = await fetch(`${BASE}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /* Update */
  update: async (id: number, data: Partial<CityFormValues>) => {
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

  /* Search cities by name */
  search: async (name: string) => {
    const response = await fetch(
      `${BASE}/search?name=${encodeURIComponent(name)}`
    );
    return response.json();
  },

  /* Get city by name */
  getByName: async (name: string) => {
    const response = await fetch(`${BASE}/name/${encodeURIComponent(name)}`);
    return response.json();
  },
};
