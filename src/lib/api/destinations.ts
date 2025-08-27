const API_BASE_URL = "/api/auth/destinations";

export const destinationsApi = {
  // Get all destinations with pagination and filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    name?: string;
    country?: string;
    sortBy?: "name" | "country" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.name) searchParams.set("name", params.name);
    if (params?.country) searchParams.set("country", params.country);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const response = await fetch(`${API_BASE_URL}?${searchParams}`);
    return response.json();
  },

  // Get destination by ID
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return response.json();
  },

  // Get destination by name
  getByName: async (name: string) => {
    const response = await fetch(
      `${API_BASE_URL}/name/${encodeURIComponent(name)}`
    );
    return response.json();
  },

  // Create new destination
  create: async (data: {
    name: string;
    country: string;
    overview?: string;
    imageUrl?: string;
    trending?: boolean;
    heading: string;
    basePrice?: number;
    originalPrice?: number;
    heroTitle?: string;
    description?: string;
    text?: string;
    rating?: string;
  }) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update destination
  update: async (
    id: number,
    data: {
      name?: string;
      country?: string;
      overview?: string;
      imageUrl?: string;
      trending?: boolean;
      heading: string;
      originalPrice?: number;
      heroTitle?: string;
      description?: string;
      text?: string;
      rating?: string;
    }
  ) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete destination
  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // Search destinations by country
  searchByCountry: async (country: string) => {
    const response = await fetch(
      `${API_BASE_URL}/search?country=${encodeURIComponent(country)}`
    );
    return response.json();
  },
};
