import { ReviewFormDataType } from "@/components/organisms/reviews/ReviewsForm";

const API_BASE_URL = "/api/auth/reviews";

export const reviewsApi = {
  // Get all reviews with pagination and filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    packageId?: number;
    destinationId?: number;
    sortBy?: "createdAt" | "rating";
    sortOrder?: "asc" | "desc";
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.packageId)
      searchParams.set("packageId", params.packageId.toString());
    if (params?.destinationId)
      searchParams.set("destinationId", params.destinationId.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const response = await fetch(`${API_BASE_URL}?${searchParams}`);
    return response.json();
  },

  // Get review by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return response.json();
  },

  // Create new review
  create: async (data: ReviewFormDataType) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update review
  update: async (id: string, data: ReviewFormDataType) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete review
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // Search reviews by username
  searchByUsername: async (username: string) => {
    const response = await fetch(
      `${API_BASE_URL}/search?username=${encodeURIComponent(username)}`
    );
    return response.json();
  },

  // Search reviews by place name
  searchByPlace: async (places: string) => {
    const response = await fetch(
      `${API_BASE_URL}/search?places=${encodeURIComponent(places)}`
    );
    return response.json();
  },
};
