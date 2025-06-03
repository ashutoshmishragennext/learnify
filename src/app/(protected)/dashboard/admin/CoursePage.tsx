/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import ImageUpload from "@/components/ImageUpload"; // Your existing ImageUpload component
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Book,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Settings,
  User,
  Video,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Updated Course interface to match API response structure
interface Course {
  courseId: string;
  _id: string;
  current: string;
  name: string;
  image: string;
  userId: string;
  studentsEnrolled: number;
  shortDescription: string;
  price: {
    current: number;
    original: number;
    discountPercentage: number;
    _id: string;
  };
  duration: number;
  requirements: string[];
  prerequisites: string[];
  tags: string[];
  lastUpdated: string;
  authors: {
    name: string;
    bio: string;
    description: string;
    profileImage: string;
    _id: string;
  }[];
  modules: any[];
  reviews: any[];
  subtitles: {
    available: string;
    language: string;
    _id: string;
  }[];
  mediaContent: {
    type: string;
    url: string;
    _id: string;
  }[];
  __v: number;
  category: string;
  certificate: string;
  courseHeading: string;
  largeDescription: {
    intro: string;
    subPoints: string[];
    _id: string;
  };
  level: string;
  lifeTimeAccess: string;
  ratings: {
    average: number;
    totalRatings: number;
    _id: string;
  };
  syllabus: string;
  totalAssignments: number;
  totalVideoLectures: number;
}

interface FormData {
  courseId: string;
  demo: string;
  courseHeading: string;
  longDescription: string;
  subPoints: string[];
  category: string;
  certificateProvider: boolean;
  lifetimeAccess: boolean;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  tags: string[];
  prerequisite: string[];
  requirement: string[];
  publisherName: string;
  publisherBio: string;
  publisherDescription: string;
  publisherProfileImage: string;
  subtitles: boolean;
  subtitlesLanguage: "English" | "Hindi" | "Both" | string;
  numberOfAssignments: number;
  numberOfVideoLectures: number;
  syllabus: string;
}

interface FileUploadProps {
  onFileUpload: (fileUrl: string) => void;
  currentFileUrl?: string;
  acceptedTypes: string;
  uploadType: "video" | "document";
  disabled?: boolean;
  showUrlInput?: boolean; // Add this new prop
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  currentFileUrl,
  acceptedTypes,
  uploadType,
  disabled = false,
  showUrlInput = false, // Default to false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>(currentFileUrl || ""); // Add URL input state

  useEffect(() => {
    setUrlInput(currentFileUrl || "");
  }, [currentFileUrl]);

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    onFileUpload(url);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(
      "file type",
      file.type,
      acceptedTypes
        .split("/")
        .some(
          (type) =>
            file.type.includes(type.trim()) ||
            file.name.toLowerCase().includes(type.trim())
        )
    );

    // Validate file type
    const isValidType = acceptedTypes
      .split("/")
      .some(
        (type) =>
          file.type.includes(type.trim()) ||
          file.name.toLowerCase().includes(type.trim())
      );

    if (!isValidType) {
      toast.error(`Please upload a valid ${uploadType} file`);
      return;
    }

    // Validate file size (max 100MB for videos, 10MB for documents)
    const maxSize =
      uploadType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `File size should be less than ${
          uploadType === "video" ? "100MB" : "10MB"
        }`
      );
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "learnify_frontend");
      formData.append("cloud_name", "dtfe8o5ny");

      let uploadEndpoint = "raw";
      if (file.type.startsWith("video/")) {
        uploadEndpoint = "video";
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dtfe8o5ny/${uploadEndpoint}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        onFileUpload(data.secure_url);
        toast.success(
          `${
            uploadType === "video" ? "Video" : "Document"
          } uploaded successfully!`
        );
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${uploadType}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        disabled={isUploading || disabled}
        className="cursor-pointer"
      />

      {showUrlInput && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Or paste {uploadType} URL directly:
          </Label>
          <Input
            type="url"
            value={urlInput}
            onChange={handleUrlInputChange}
            placeholder={`Paste ${uploadType} URL here...`}
            disabled={isUploading || disabled}
            className="h-10"
          />
        </div>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading {uploadType}...
        </div>
      )}
      {currentFileUrl && !isUploading && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          {fileName || `${uploadType} uploaded successfully`}
        </div>
      )}
    </div>
  );
};

const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState<FormData>({
    courseId: "",
    demo: "",
    courseHeading: "",
    longDescription: "",
    subPoints: [],
    category: "WEB",
    certificateProvider: false,
    lifetimeAccess: false,
    level: "Beginner",
    tags: [],
    prerequisite: [],
    requirement: [],
    publisherName: "",
    publisherBio: "",
    publisherDescription: "",
    publisherProfileImage: "",
    subtitles: false,
    subtitlesLanguage: "English",
    numberOfAssignments: 0,
    numberOfVideoLectures: 0,
    syllabus: "",
  });

  // Fetch user's courses
  const fetchUserCourses = async () => {
    try {
      const response = await fetch("/api/getcoursecreatedbyuser");
      if (response.ok) {
        const data = await response.json();
        setCourses(data.course || []);
      } else {
        toast.error("Failed to fetch your courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error loading your courses");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/courseCategories");
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch course introduction data if it exists
  const fetchCourseIntroData = async (courseId: string) => {
    try {
      // const response = await fetch(`/api/getCourseIntro/${courseId}`);
      // if (response.ok) {
      //   const data = await response.json();
      //   if (data.courseIntro) {
      //     // Prefill form with existing data
      //     setFormData(prev => ({
      //       ...prev,
      //       ...data.courseIntro,
      //       courseId: courseId,
      //     }));
      //     toast.success("Course data loaded successfully!");
      //   }
      // }

      const course = courses.find((c) => c.courseId === courseId);

      if (!course) {
        console.error("Course not found with courseId:", courseId);
        return;
      }

      // Map API response to formData structure
      setFormData({
        courseId: course.courseId || "",
        demo: course.mediaContent?.[0]?.url || "", // Taking first media content as demo
        courseHeading: course.courseHeading || "",
        longDescription: course.largeDescription?.intro || "",
        subPoints: course.largeDescription?.subPoints || [],
        category: course.category || "WEB",
        certificateProvider: course.certificate === "true",
        lifetimeAccess: course.lifeTimeAccess === "true",
        level: course.level || "Beginner",
        tags: course.tags || [],
        prerequisite: course.prerequisites || [],
        requirement: course.requirements || [],
        publisherName: course.authors?.[0]?.name || "",
        publisherBio: course.authors?.[0]?.bio || "",
        publisherDescription: course.authors?.[0]?.description || "",
        publisherProfileImage: course.authors?.[0]?.profileImage || "",
        subtitles: course.subtitles?.[0]?.available === "true",
        subtitlesLanguage: course.subtitles?.[0]?.language || "English",
        numberOfAssignments: course.totalAssignments || 0,
        numberOfVideoLectures: course.totalVideoLectures || 0,
        syllabus: course.syllabus || "",
      });
    } catch (error) {
      console.error("Error selecting course intro data:", error);
    }
  };

  useEffect(() => {
    fetchUserCourses();
    fetchCategories();
  }, []);

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    console.log(courseId);

    setFormData((prev) => ({ ...prev, courseId }));

    // Try to fetch existing course intro data
    if (courseId) {
      fetchCourseIntroData(courseId);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle array inputs (tags, prerequisites, etc.)
  const handleArrayInput = (field: keyof FormData, value: string) => {
    const arrayValue = value.split(",").filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: arrayValue }));
  };

  // Add new category
  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (categories.includes(newCategory)) {
      toast.error("Category already exists");
      return;
    }

    try {
      const response = await fetch("/api/courseCategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory }),
      });

      if (response.ok) {
        setCategories((prev) => [...prev, newCategory]);
        setFormData((prev) => ({ ...prev, category: newCategory }));
        setNewCategory("");
        toast.success("Category added successfully!");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  // Save course introduction
  const handleSave = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course first");
      return;
    }

    if (!formData.demo || !formData.syllabus) {
      toast.error("Please upload both Demo video and Syllabus PDF");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/saveCourseIntro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          data.message || "Course introduction saved successfully!"
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save course introduction");
      }
    } catch (error) {
      console.error("Error saving course intro:", error);
      toast.error("Something went wrong while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Loading your courses...</h3>
              <p className="text-gray-600">
                Please wait while we fetch your data
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Course Selection */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Book className="w-6 h-6" />
              Select Course for Introduction Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {courses.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No courses found. Please create a course card first before
                  setting up the introduction.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">
                  Choose a course:
                </Label>
                <Select
                  value={selectedCourseId}
                  onValueChange={handleCourseSelect}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a course to add introduction details" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.courseId} value={course.courseId}>
                        <div className="flex items-center gap-3">
                          <img
                            src={course.image}
                            alt={course.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold">{course.name}</p>
                            <p className="text-sm text-gray-600">
                              {course.current} • {course.duration}h
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedCourseId && (
          <>
            {/* Course Introduction Section */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Course Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Demo Video Upload */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Demo Video <span className="text-red-500">*</span>
                  </Label>
                  <FileUpload
                    onFileUpload={(url) => handleInputChange("demo", url)}
                    currentFileUrl={formData.demo}
                    acceptedTypes="video/*"
                    uploadType="video"
                    disabled={isSaving}
                    showUrlInput={true} // Enable URL input for demo videos
                  />
                </div>
                <Separator />

                {/* Course Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Course Heading <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.courseHeading}
                      onChange={(e) =>
                        handleInputChange("courseHeading", e.target.value)
                      }
                      placeholder="Enter course heading"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold flex items-center gap-2 mt-2">
                      Level <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value: any) =>
                        handleInputChange("level", value)
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Long Description */}
                <div className="space-y-3">
                  <Label className="font-semibold">
                    Course Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    value={formData.longDescription}
                    onChange={(e) =>
                      handleInputChange("longDescription", e.target.value)
                    }
                    placeholder="Provide a detailed description of the course..."
                    className="min-h-[120px] resize-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <Label className="font-semibold flex items-center gap-2">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.category}
                      onValueChange={(value: any) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category"
                        className="h-12"
                      />
                      <Button onClick={addCategory} className="h-12 px-4">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tags, Prerequisites, etc. */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold">Tags</Label>
                    <Input
                      onChange={(e) => handleArrayInput("tags", e.target.value)}
                      placeholder="Enter tags separated by commas"
                      className="h-12"
                    />
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">Prerequisites</Label>
                    <Input
                      onChange={(e) =>
                        handleArrayInput("prerequisite", e.target.value)
                      }
                      placeholder="Enter prerequisites separated by commas"
                      className="h-12"
                    />
                    {formData.prerequisite.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.prerequisite.map((prereq, index) => (
                          <Badge key={index} variant="outline">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirements and Sub Points */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold">Requirements</Label>
                    <Input
                      onChange={(e) =>
                        handleArrayInput("requirement", e.target.value)
                      }
                      placeholder="Enter requirements separated by commas"
                      className="h-12"
                    />
                    {formData.requirement.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.requirement.map((prereq, index) => (
                          <Badge key={index} variant="outline">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">Key Learning Points</Label>
                    <Input
                      onChange={(e) =>
                        handleArrayInput("subPoints", e.target.value)
                      }
                      placeholder="Enter key points separated by commas"
                      className="h-12"
                    />
                    {formData.subPoints.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.subPoints.map((prereq, index) => (
                          <Badge key={index} variant="outline">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Features */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Certificate Provider
                    </Label>
                    <Select
                      value={formData.certificateProvider ? "Yes" : "No"}
                      onValueChange={(value: any) =>
                        handleInputChange(
                          "certificateProvider",
                          value === "Yes"
                        )
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">Lifetime Access</Label>
                    <Select
                      value={formData.lifetimeAccess ? "Yes" : "No"}
                      onValueChange={(value: any) =>
                        handleInputChange("lifetimeAccess", value === "Yes")
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">Subtitles Available</Label>
                    <Select
                      value={formData.subtitles ? "Yes" : "No"}
                      onValueChange={(value: any) =>
                        handleInputChange("subtitles", value === "Yes")
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Subtitle Language (conditional) */}
                {formData.subtitles && (
                  <div className="space-y-3">
                    <Label className="font-semibold">Subtitle Language</Label>
                    <Select
                      value={formData.subtitlesLanguage}
                      onValueChange={(value: any) =>
                        handleInputChange("subtitlesLanguage", value)
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publisher Information */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Publisher Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Publisher Profile Image */}
                <div className="space-y-3">
                  <Label className="font-semibold">
                    Publisher Profile Image
                  </Label>
                  <ImageUpload
                    onImageUpload={(url) =>
                      handleInputChange("publisherProfileImage", url)
                    }
                    currentImageUrl={formData.publisherProfileImage}
                    disabled={isSaving}
                  />
                </div>

                {/* Publisher Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Publisher Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.publisherName}
                      onChange={(e) =>
                        handleInputChange("publisherName", e.target.value)
                      }
                      placeholder="Enter publisher name"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">Publisher Bio</Label>
                    <Input
                      value={formData.publisherBio}
                      onChange={(e) =>
                        handleInputChange("publisherBio", e.target.value)
                      }
                      placeholder="Brief bio or title"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold">Publisher Description</Label>
                  <Textarea
                    value={formData.publisherDescription}
                    onChange={(e) =>
                      handleInputChange("publisherDescription", e.target.value)
                    }
                    placeholder="Detailed description about the publisher..."
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Course Details & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Course Numbers */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Number of Assignments
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.numberOfAssignments}
                      onChange={(e) =>
                        handleInputChange(
                          "numberOfAssignments",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="0"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Number of Video Lectures
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.numberOfVideoLectures}
                      onChange={(e) =>
                        handleInputChange(
                          "numberOfVideoLectures",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="0"
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Syllabus Upload */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Course Syllabus (PDF){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <FileUpload
                    onFileUpload={(url) => handleInputChange("syllabus", url)}
                    currentFileUrl={formData.syllabus}
                    acceptedTypes="application/pdf,.pdf"
                    uploadType="document"
                    disabled={isSaving}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSave}
                disabled={isSaving || !selectedCourseId}
                className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Saving Course Introduction...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-3" />
                    Save Course Introduction
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
