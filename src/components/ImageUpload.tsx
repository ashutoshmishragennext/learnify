"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImageUrl,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || "");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload to your API endpoint
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.imageUrl;

      setPreviewUrl(imageUrl);
      onImageUpload(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl("");
    onImageUpload("");
    // Reset file input
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || disabled}
          className="cursor-pointer"
        />
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      {previewUrl && (
        <Card className="p-4">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-48 h-48 object-cover m-auto rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
            <ImageIcon className="w-4 h-4" />
            Image uploaded successfully
          </div>
        </Card>
      )}

      {!previewUrl && !isUploading && (
        <Card className="p-8 border-2 border-dashed border-gray-300 text-center">
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Click above to upload an image or drag and drop
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;