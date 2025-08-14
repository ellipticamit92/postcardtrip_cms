"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  Camera,
  FileImage,
  X,
  Eye,
  Link2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({
  label = "Upload Image",
  value = "https://res.cloudinary.com/dnkfly4cj/image/upload/v1755088640/cms_uploads/mabbvifnt87yhjtldx0k.jpg",
  onChange,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imageMetadata, setImageMetadata] = useState<{
    fileName?: string;
    fileSize?: string;
    uploadDate?: string;
  }>({});

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/auth/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  const handleFileUpload = async (file: File) => {
    const loadingToast = toast.loading("Image is uploading");
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImageMetadata({
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      uploadDate: new Date().toLocaleDateString(),
    });

    try {
      const data = await uploadToCloudinary(file);
      onChange(data.secure_url);
      toast.dismiss(loadingToast);
      toast.success("Image uploaded successfully!");
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Image upload failed!");
    }
  };

  return (
    <div className="space-y-1">
      <Label className="text-sm flex items-center gap-2">
        <Camera className="h-4 w-4" /> {label}
      </Label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-1 transition-all duration-300 ${
          dragActive
            ? "border-primary bg-accent/20"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          const files = e.dataTransfer.files;
          if (files?.[0]) handleFileUpload(files[0]);
        }}
      >
        {!value ? (
          <div className="space-y-4">
            <div className="flex-1 flex flex-col">
              <div className="group  relative">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-24 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(value, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => onChange("")}
                    >
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center py-2 gap-2 text-success">
                <CheckCircle className="h-5 w-5" />{" "}
                <span className="font-medium">
                  Image uploaded successfully!
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Link2 className="h-4 w-4" /> Cloudinary URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={value}
                    readOnly
                    className="bg-muted/50 text-sm font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(value)}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-input")?.click()}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" /> Change Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drop your image here</p>
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <FileImage className="h-4 w-4 mr-2" /> Choose File
            </Button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
