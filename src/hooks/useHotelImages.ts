import { useState, useEffect } from "react";

interface HotelImage {
  hiid: number;
  url: string;
  caption?: string;
  hotelId: number;
  hotel?: any;
}

export function useHotelImages(hotelId?: number) {
  const [images, setImages] = useState<HotelImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const url = hotelId
        ? `/api/hotel-images?hotelId=${hotelId}`
        : "/api/hotel-images";

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setImages(hotelId ? data.data : data.data.images);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch hotel images");
    } finally {
      setLoading(false);
    }
  };

  const createImage = async (imageData: Omit<HotelImage, "hiid">) => {
    try {
      const response = await fetch("/api/hotel-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageData),
      });

      const data = await response.json();

      if (data.success) {
        setImages((prev) => [...prev, data.data]);
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError("Failed to create hotel image");
      throw err;
    }
  };

  const updateImage = async (hiid: number, updateData: Partial<HotelImage>) => {
    try {
      const response = await fetch(`/api/hotel-images/${hiid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setImages((prev) =>
          prev.map((img) => (img.hiid === hiid ? data.data : img))
        );
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError("Failed to update hotel image");
      throw err;
    }
  };

  const deleteImage = async (hiid: number) => {
    try {
      const response = await fetch(`/api/hotel-images/${hiid}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setImages((prev) => prev.filter((img) => img.hiid !== hiid));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError("Failed to delete hotel image");
      throw err;
    }
  };

  useEffect(() => {
    fetchImages();
  }, [hotelId]);

  return {
    images,
    loading,
    error,
    refetch: fetchImages,
    createImage,
    updateImage,
    deleteImage,
  };
}
