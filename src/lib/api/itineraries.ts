// src/lib/api/itineraries.ts
export interface ItineraryPayload {
  day: number;
  title: string;
  details: string;
  packageId: number;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  places?: {
    name: string;
    description: string;
    images?: { url: string; caption?: string }[];
  }[];
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

const BASE = "/api/itineraries";

export const itinerariesApi = {
  /* List with pagination & filters */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    packageId?: number;
    day?: number;
    title?: string;
    sortBy?: "day" | "title" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.packageId) search.set("packageId", String(params.packageId));
    if (params?.day) search.set("day", String(params.day));
    if (params?.title) search.set("title", params.title);
    if (params?.sortBy) search.set("sortBy", params.sortBy);
    if (params?.sortOrder) search.set("sortOrder", params.sortOrder);

    const response = await fetch(`${BASE}?${search.toString()}`);
    return response.json();
  },

  /* Single itinerary by id */
  getById: async (id: number) => {
    const response = await fetch(`${BASE}/${id}`);
    return response.json();
  },

  /* Itineraries by package */
  getByPackage: async (packageId: number) => {
    const response = await fetch(`${BASE}/package/${packageId}`);
    return response.json();
  },

  /* Get itinerary by day */
  getByDay: async (packageId: number, day: number) => {
    const response = await fetch(
      `${BASE}/day?packageId=${packageId}&day=${day}`
    );
    return response.json();
  },

  /* Create */
  create: async (data: ItineraryPayload) => {
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
  update: async (id: number, data: Partial<ItineraryPayload>) => {
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

  /* Search by title */
  search: async (title: string) => {
    const response = await fetch(
      `${BASE}/search?title=${encodeURIComponent(title)}`
    );
    return response.json();
  },

  /* Add highlight */
  addHighlight: async (itineraryId: number, text: string) => {
    const response = await fetch(`${BASE}/${itineraryId}/highlights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    return response.json();
  },

  /* Add inclusion */
  addInclusion: async (itineraryId: number, text: string) => {
    const response = await fetch(`${BASE}/${itineraryId}/inclusions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    return response.json();
  },

  /* Add exclusion */
  addExclusion: async (itineraryId: number, text: string) => {
    const response = await fetch(`${BASE}/${itineraryId}/exclusions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    return response.json();
  },

  /* Remove highlight */
  removeHighlight: async (highlightId: number) => {
    const response = await fetch(`/api/highlights/${highlightId}`, {
      method: "DELETE",
    });
    return response.json();
  },

  /* Remove inclusion */
  removeInclusion: async (inclusionId: number) => {
    const response = await fetch(`/api/inclusions/${inclusionId}`, {
      method: "DELETE",
    });
    return response.json();
  },

  /* Remove exclusion */
  removeExclusion: async (exclusionId: number) => {
    const response = await fetch(`/api/exclusions/${exclusionId}`, {
      method: "DELETE",
    });
    return response.json();
  },
};
