"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

// Helper: create image previews
const getPreviews = (files: FileList) =>
  Array.from(files).map((file) => URL.createObjectURL(file));

export function ImageUploadField({ name }: { name: string }) {
  const { control } = useFormContext();
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/auth/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.secure_url;
  };

  const handleFileChange = (files: FileList | null, onChange: any) => {
    if (!files) return;
    onChange(files);
    setPreviews(getPreviews(files));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;

    setUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file))
      );
      setUploadedUrls(urls);
      console.log("Uploaded URLs:", urls);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Upload Images</FormLabel>

          {/* File input */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files, field.onChange)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
          />

          {/* Preview section */}
          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {previews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          )}

          {/* Progress bar */}
          {uploading && <Progress value={60} className="mt-2" />}

          {/* Upload button */}
          <Button
            type="button"
            disabled={uploading || previews.length === 0}
            onClick={() => handleUpload(field.value)}
            className="mt-3"
          >
            {uploading ? "Uploading..." : "Upload to Cloudinary"}
          </Button>

          {/* Uploaded URLs display */}
          {uploadedUrls.length > 0 && (
            <div className="mt-3">
              <p className="font-medium">Uploaded Images:</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {uploadedUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Uploaded ${idx}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
