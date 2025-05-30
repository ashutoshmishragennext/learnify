"use client";

import { FormInstructions } from "@/components/FormIntruction";
import ImageUpload from "@/components/ImageUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Percent
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  shortDescription: string;
  current: number;
  original: number;
  discountPercentage: number;
  duration: number;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  shortDescription?: string;
  duration?: string;
  current?: string;
  original?: string;
  imageUrl?: string;
}

const CardTemplateForm: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    duration: "",
    current: "",
    original: "",
    imageUrl: "",
  });

  // Calculate discount percentage automatically
  const discountPercentage = React.useMemo(() => {
    const current = parseFloat(formData.current) || 0;
    const original = parseFloat(formData.original) || 0;
    
    if (current > 0 && original > 0 && original > current) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  }, [formData.current, formData.original]);

  // Validation function
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Course topic is required";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Description is required";
    } else if (formData.shortDescription.length < 10) {
      newErrors.shortDescription = "Description must be at least 10 characters";
    }

    const duration = parseFloat(formData.duration);
    if (!formData.duration || duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    const current = parseFloat(formData.current);
    if (!formData.current || current <= 0) {
      newErrors.current = "Current price must be greater than 0";
    }

    const original = parseFloat(formData.original);
    if (!formData.original || original <= 0) {
      newErrors.original = "Original price must be greater than 0";
    } else if (original <= current) {
      newErrors.original = "Original price must be greater than current price";
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = "Hero image is required";
    }

    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
    if (errors.imageUrl) {
      setErrors(prev => ({ ...prev, imageUrl: undefined }));
    }
  };

  // Submit form
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSaving(true);

    const submitData: FormData = {
      name: formData.name.trim(),
      shortDescription: formData.shortDescription.trim(),
      current: parseFloat(formData.current),
      original: parseFloat(formData.original),
      discountPercentage,
      duration: parseFloat(formData.duration) / 60, // Convert to hours
      imageUrl: formData.imageUrl,
    };

    try {
      const response = await fetch("/api/saveCardTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Course card saved successfully!");
        // Reset form
        setFormData({
          name: "",
          shortDescription: "",
          duration: "",
          current: "",
          original: "",
          imageUrl: "",
        });
        setErrors({});
      } else {
        throw new Error(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save the course card. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = Object.keys(validateForm()).length === 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <FormInstructions />
      
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Course Card Template Form
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Hero Image Upload */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold flex items-center gap-2">
              Course Image <span className="text-red-500">*</span>
            </Label>
            <ImageUpload 
              onImageUpload={handleImageUpload}
              currentImageUrl={formData.imageUrl}
              disabled={isSaving}
            />
            {errors.imageUrl && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.imageUrl}</AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Course Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Course Topic */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Topic <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Advanced React Development"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`h-12 ${errors.name ? "border-red-500" : ""}`}
                disabled={isSaving}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label htmlFor="duration" className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (minutes) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 180"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className={`h-12 ${errors.duration ? "border-red-500" : ""}`}
                disabled={isSaving}
                min="1"
              />
              {errors.duration && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.duration}
                </p>
              )}
              {formData.duration && parseFloat(formData.duration) > 0 && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  ≈ {(parseFloat(formData.duration) / 60).toFixed(1)} hours
                </p>
              )}
            </div>
          </div>

          {/* Course Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-lg font-semibold">
              Course Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of what students will learn in this course..."
              value={formData.shortDescription}
              onChange={(e) => handleInputChange("shortDescription", e.target.value)}
              className={`min-h-[120px] resize-none ${errors.shortDescription ? "border-red-500" : ""}`}
              disabled={isSaving}
            />
            <div className="flex justify-between items-center">
              {errors.shortDescription ? (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.shortDescription}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  {formData.shortDescription.length}/500 characters
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Pricing Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Pricing Details</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Price */}
              <div className="space-y-3">
                <Label htmlFor="current" className="font-semibold flex items-center gap-2">
                  Current Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="current"
                    type="number"
                    placeholder="99.99"
                    value={formData.current}
                    onChange={(e) => handleInputChange("current", e.target.value)}
                    className={`h-12 pl-10 ${errors.current ? "border-red-500" : ""}`}
                    disabled={isSaving}
                    min="0.01"
                    step="0.01"
                  />
                </div>
                {errors.current && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.current}
                  </p>
                )}
              </div>

              {/* Original Price */}
              <div className="space-y-3">
                <Label htmlFor="original" className="font-semibold flex items-center gap-2">
                  Original Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="original"
                    type="number"
                    placeholder="199.99"
                    value={formData.original}
                    onChange={(e) => handleInputChange("original", e.target.value)}
                    className={`h-12 pl-10 ${errors.original ? "border-red-500" : ""}`}
                    disabled={isSaving}
                    min="0.01"
                    step="0.01"
                  />
                </div>
                {errors.original && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.original}
                  </p>
                )}
              </div>
            </div>

            {/* Discount Display */}
            {discountPercentage > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Discount Calculated</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-3 py-1">
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Students save ₹{(parseFloat(formData.original) - parseFloat(formData.current)).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              disabled={isSaving || !isFormValid}
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Saving Course...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  Save Course Card
                </>
              )}
            </Button>
          </div>

          {/* Form Status */}
          {!isFormValid && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fill in all required fields to enable submission.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardTemplateForm;