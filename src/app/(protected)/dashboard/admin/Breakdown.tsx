/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdViewModule } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Book,
  CheckCircle2,
  Loader2,
  Plus,
  Video,
  Clock,
  Award,
  FileVideo,
  Trash2,
  Link,
  Upload,
  FileText
} from "lucide-react";


interface InternalDetail {
  partNumber: number;
  partName: string;
  duration: { minutes: number; seconds: number };
  videoLecture: File | string | null;
  videoType: 'file' | 'url';
  description: string; // Add this
  attachedPdf: string; // Add this
}

interface ModuleField {
  number: number;
  topic: string;
  parts: number;
  duration: { hours: number; minutes: number; seconds: number };
  reward: number;
  description: string; // Add this
  subModules: InternalDetail[];
}

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

const Breakdown: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [moduleFields, setModuleFields] = useState<ModuleField[]>([
  {
    number: 1,
    topic: "",
    parts: 1,
    duration: { hours: 0, minutes: 0, seconds: 0 },
    reward: 1,
    description: "", // Add this
    subModules: [
      {
        partNumber: 1,
        partName: "",
        duration: { minutes: 0, seconds: 0 },
        videoLecture: null,
        videoType: 'url',
        description: "", // Add this
        attachedPdf: "", // Add this
      },
    ],
  },
]);
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

  // Fetch existing breakdown data if available
  const fetchCourseBreakdown = async (courseId: string) => {
    try {
      const response = await fetch(`/api/getCourseBreakdown?courseId=${courseId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Convert the fetched data to match our component structure
          const convertedData = data.map((module: any) => ({
  ...module,
  description: module.description || "", // Add this
  subModules: module.subModules.map((sub: any) => ({
    ...sub,
    videoType: typeof sub.videoLecture === 'string' && sub.videoLecture?.startsWith('http') ? 'url' : 'file',
    description: sub.description || "", // Add this
    attachedPdf: sub.attachedPdf || "", // Add this
    duration: {
      minutes: sub.duration?.minutes || 0,
      seconds: sub.duration?.seconds || 0
    }
  })),
  duration: {
    hours: module.duration?.hours || 0,
    minutes: module.duration?.minutes || 0,
    seconds: module.duration?.seconds || 0
  }
}));


          setModuleFields(convertedData);
          toast.success("Course breakdown loaded successfully!");
        }
        else {
  // No existing data found, set default
  setModuleFields([
  {
    number: 1,
    topic: "",
    parts: 1,
    duration: { hours: 0, minutes: 0, seconds: 0 },
    reward: 1,
    description: "", // Add this
    subModules: [
      {
        partNumber: 1,
        partName: "",
        duration: { minutes: 0, seconds: 0 },
        videoLecture: null,
        videoType: 'url',
        description: "", // Add this
        attachedPdf: "", // Add this
      },
    ],
  },
]);

}
      }
    } catch (error) {
      console.error("Error fetching course breakdown:", error);
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, []);

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
  setSelectedCourseId(courseId);
  
  // Don't reset immediately - let fetchCourseBreakdown handle it
  if (courseId) {
    fetchCourseBreakdown(courseId);
  } else {
    // Only reset if no courseId
    setModuleFields([
  {
    number: 1,
    topic: "",
    parts: 1,
    duration: { hours: 0, minutes: 0, seconds: 0 },
    reward: 1,
    description: "", // Add this
    subModules: [
      {
        partNumber: 1,
        partName: "",
        duration: { minutes: 0, seconds: 0 },
        videoLecture: null,
        videoType: 'url',
        description: "", // Add this
        attachedPdf: "", // Add this
      },
    ],
  },
]);
  }
};

  const addModuleField = () => {
  setModuleFields([
    ...moduleFields,
    {
      number: moduleFields.length + 1,
      topic: "",
      parts: 1,
      duration: { hours: 0, minutes: 0, seconds: 0 },
      reward: 1,
      description: "", // Add this
      subModules: [
        {
          partNumber: 1,
          partName: "",
          duration: { minutes: 0, seconds: 0 },
          videoLecture: null,
          videoType: 'url',
          description: "", // Add this
          attachedPdf: "", // Add this
        },
      ],
    },
  ]);
};

  const deleteModule = (index: number) => {
    if (moduleFields.length === 1) {
      toast.error("At least one module is required");
      return;
    }
    setModuleFields(moduleFields.filter((_, i) => i !== index));
  };

  const deleteSubModule = (moduleIndex: number, subIndex: number) => {
    setModuleFields((prevFields) =>
      prevFields.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              subModules: module.subModules.filter((_, j) => j !== subIndex),
            }
          : module
      )
    );
  };

const addInternalDetailRow = (moduleIndex: number) => {
  setModuleFields((prevFields) =>
    prevFields.map((module, i) =>
      i === moduleIndex
        ? module.subModules.length < module.parts
          ? {
              ...module,
              subModules: [
                ...module.subModules,
                {
                  partNumber: module.subModules.length + 1,
                  partName: "",
                  duration: { minutes: 0, seconds: 0 },
                  videoLecture: null,
                  videoType: 'url',
                  description: "", // Add this
                  attachedPdf: "", // Add this
                },
              ],
            }
          : module
        : module
    )
  );
};

const uploadPdfToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "learnify_frontend");
  formData.append("cloud_name", "dtfe8o5ny");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dtfe8o5ny/raw/upload`, // Note: using 'raw' for PDFs
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    toast.success("PDF uploaded successfully");
    return data.url;
  } catch (error) {
    console.error("Cloudinary PDF Upload Error:", error);
    toast.error("Failed to upload PDF");
    return null;
  }
};

const removePdf = (moduleIndex: number, subIndex: number) => {
  handleInternalDetailChange(moduleIndex, subIndex, "attachedPdf", "");
};


const handlePdfUpload = async (
  moduleIndex: number,
  subIndex: number,
  file: File
) => {
  const uploadedUrl = await uploadPdfToCloudinary(file);
  if (uploadedUrl) {
    handleInternalDetailChange(moduleIndex, subIndex, "attachedPdf", uploadedUrl);
  }
};

const handleModuleInputChange = (
    index: number,
    field: keyof ModuleField,
    value: string | number
  ) => {
    setModuleFields((prevFields) =>
      prevFields.map((module, i) => {
        if (i !== index) return module;

        const updatedModule: ModuleField = {
          ...module,
          [field]: field === "topic" || field === "description" || "attachedPdf" 
            ? value.toString() 
            : Number(value),
        };

        if (field === "parts") {
          const partsValue = Number(value);
          if (partsValue < module.subModules.length) {
            updatedModule.subModules = module.subModules.slice(0, partsValue);
          }
        }

        return updatedModule;
      })
    );
  };
  const handleInternalDetailChange = (
    moduleIndex: number,
    subIndex: number,
    field: keyof InternalDetail,
    value: string | number | File | null
  ) => {
    setModuleFields((prevFields) =>
      prevFields.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              subModules: module.subModules.map((sub, j) =>
                j === subIndex
                  ? {
                      ...sub,
                      [field]:
                        field === "partName" || field === "description" || field === "attachedPdf"
                          ? (value ?? "").toString()
                          : field === "videoLecture"
                          ? value ?? ""
                          : field === "videoType"
                          ? value
                          : Number(value ?? 0),
                    }
                  : sub
              ),
            }
          : module
      )
    );
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "learnify_frontend");
    formData.append("cloud_name", "dtfe8o5ny");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dtfe8o5ny/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      toast.success("Lecture Video uploaded successfully");
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course first");
      return;
    }

    // Validate required fields
    const hasEmptyFields = moduleFields.some(module => 
  !module.topic || 
  module.subModules.some(sub => !sub.partName || !sub.videoLecture)
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all required fields including video lectures");
      return;
    }

    setIsSaving(true);
    console.log("Complete object before upload:", moduleFields);

    try {
      const updatedFields = moduleFields.map(moduleItem => ({
        ...moduleItem,
        courseId: selectedCourseId,
        duration:
          moduleItem.duration.hours * 3600 +
          moduleItem.duration.minutes * 60 +
          moduleItem.duration.seconds,
        subModules: moduleItem.subModules.map(sub => ({
          ...sub,
          duration: sub.duration.minutes * 60 + sub.duration.seconds,
        })),
      }));

      let count = 0;
      // Iterate over modules and submodules to upload videos (only files, not URLs)
      for (const moduleItem of updatedFields) {
        for (const subModule of moduleItem.subModules) {
          if (subModule.videoLecture instanceof File) {
            count += 1;
            const uploadedUrl = await uploadToCloudinary(
              subModule.videoLecture
            );
            if (uploadedUrl) {
              subModule.videoLecture = uploadedUrl;
              toast.success(`Video upload ${count} successful`);
            } else {
              toast.error(`Video upload ${count} failed`);
              throw new Error(`Video upload ${count} failed`);
            }
          }
          // If it's a URL (string), keep it as is
        }
      }

      // Now send the updated data with Cloudinary URLs to backend
      const response = await fetch("/api/saveCourseBreakdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
          modules: updatedFields
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      const result = await response.json();
      console.log("Success:", result);
      toast.success("Course breakdown saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save course breakdown.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleModuleDurationChange = (
    moduleIndex: number,
    field: keyof ModuleField["duration"],
    value: number
  ) => {
    setModuleFields((prevFields) =>
      prevFields.map((module, i) =>
        i === moduleIndex
          ? { ...module, duration: { ...module.duration, [field]: value } }
          : module
      )
    );
  };

  const handleSubModuleDurationChange = (
    moduleIndex: number,
    subIndex: number,
    field: keyof InternalDetail["duration"],
    value: number
  ) => {
    setModuleFields((prevFields) =>
      prevFields.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              subModules: module.subModules.map((sub, j) =>
                j === subIndex
                  ? { ...sub, duration: { ...sub.duration, [field]: value } }
                  : sub
              ),
            }
          : module
      )
    );
  };

  const handleVideoUpload = (
    moduleIndex: number,
    subIndex: number,
    file: File
  ) => {
    handleInternalDetailChange(
      moduleIndex,
      subIndex,
      "videoLecture",
      file
    );
  };

  const handleVideoUrlChange = (
    moduleIndex: number,
    subIndex: number,
    url: string
  ) => {
    handleInternalDetailChange(
      moduleIndex,
      subIndex,
      "videoLecture",
      url
    );
  };

  const handleVideoTypeChange = (
    moduleIndex: number,
    subIndex: number,
    type: 'file' | 'url'
  ) => {
    // Clear the video when switching types
    handleInternalDetailChange(moduleIndex, subIndex, "videoLecture", null);
    handleInternalDetailChange(moduleIndex, subIndex, "videoType", type);
  };

  const removeVideo = (moduleIndex: number, subIndex: number) => {
    handleInternalDetailChange(moduleIndex, subIndex, "videoLecture", null);
  };

  const getVideoStatus = (subModule: InternalDetail) => {
    if (!subModule.videoLecture) return null;
    
    if (subModule.videoType === 'url') {
      return (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Link className="w-4 h-4" />
          Video URL added
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Video file selected
        </div>
      );
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
              <p className="text-gray-600">Please wait while we fetch your data</p>
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
              Select Course for Breakdown Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {courses.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No courses found. Please create a course first before setting up the breakdown.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Choose a course:</Label>
                <Select value={selectedCourseId} onValueChange={handleCourseSelect}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a course to create breakdown" />
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
            {/* Course Breakdown Header */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <MdViewModule className="w-6 h-6" />
                  Course Breakdown
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Module Fields */}
            {moduleFields.map((field, moduleIndex) => (
              <Card key={moduleIndex} className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-black">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <MdViewModule className="w-5 h-5" />
                      Module {moduleIndex + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteModule(moduleIndex)}
                      className="text-white hover:text-red-200 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Module Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-semibold flex items-center gap-2">
                        Module Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        value={field.number}
                        onChange={(e) => handleModuleInputChange(moduleIndex, "number", e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Reward Points <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        value={field.reward}
                        onChange={(e) => handleModuleInputChange(moduleIndex, "reward", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Module Topic <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={field.topic}
                      onChange={(e) => handleModuleInputChange(moduleIndex, "topic", e.target.value)}
                      placeholder="Enter module topic"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">
                      Module Description
                    </Label>
                    <textarea
                      value={field.description}
                      onChange={(e) => handleModuleInputChange(moduleIndex, "description", e.target.value)}
                      placeholder="Enter module description (optional)"
                      className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-semibold">
                        Number of Parts <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={field.parts}
                        onChange={(e) => handleModuleInputChange(moduleIndex, "parts", e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Hrs"
                          min="0"
                          value={field.duration.hours || ""}
                          onChange={(e) => handleModuleDurationChange(moduleIndex, "hours", Number(e.target.value))}
                          className="h-12"
                        />
                        <Input
                          type="number"
                          placeholder="Min"
                          min="0"
                          max="59"
                          value={field.duration.minutes || ""}
                          onChange={(e) => handleModuleDurationChange(moduleIndex, "minutes", Number(e.target.value))}
                          className="h-12"
                        />
                        <Input
                          type="number"
                          placeholder="Sec"
                          min="0"
                          max="59"
                          value={field.duration.seconds || ""}
                          onChange={(e) => handleModuleDurationChange(moduleIndex, "seconds", Number(e.target.value))}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Sub Modules Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-700">
                      <AiFillProduct className="w-5 h-5" />
                      Sub Modules
                    </h3>
                    
                    <div className="space-y-4">
                      {field.subModules.map((row, subIndex) => (
                        <Card key={subIndex} className="border-2 border-gray-200">
                          <CardContent className="p-4">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <Label className="font-semibold">
                                  Part Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  type="number"
                                  value={row.partNumber}
                                  onChange={(e) => handleInternalDetailChange(moduleIndex, subIndex, "partNumber", Number(e.target.value))}
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="font-semibold">
                                  Part Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  value={row.partName}
                                  onChange={(e) => handleInternalDetailChange(moduleIndex, subIndex, "partName", e.target.value)}
                                  placeholder="i.e ; Intro to next js"
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="font-semibold">
                                  Part Description
                                </Label>
                                <textarea
                                  value={row.description}
                                  onChange={(e) => handleInternalDetailChange(moduleIndex, subIndex, "description", e.target.value)}
                                  placeholder="Enter part description (optional)"
                                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-20"
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <Label className="font-semibold flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Duration <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Min"
                                    min="0"
                                    value={row.duration.minutes || ""}
                                    onChange={(e) => handleSubModuleDurationChange(moduleIndex, subIndex, "minutes", Number(e.target.value))}
                                    className="h-10"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Sec"
                                    min="0"
                                    max="59"
                                    value={row.duration.seconds || ""}
                                    onChange={(e) => handleSubModuleDurationChange(moduleIndex, subIndex, "seconds", Number(e.target.value))}
                                    className="h-10"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="font-semibold flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  Video Lecture <span className="text-red-500">*</span>
                                </Label>
                                
                                {/* Video Type Tabs */}
                                <Tabs 
                                  value={row.videoType} 
                                  onValueChange={(value) => handleVideoTypeChange(moduleIndex, subIndex, value as 'file' | 'url')}
                                  className="w-full"
                                >
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="url" className="flex items-center gap-2">
                                      <Link className="w-4 h-4" />
                                      URL
                                    </TabsTrigger>
                                    <TabsTrigger value="file" className="flex items-center gap-2">
                                      <Upload className="w-4 h-4" />
                                      Upload
                                    </TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="url" className="mt-2">
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="url"
                                        placeholder="Enter video URL (Odysee embed link, cloudinary, etc.)"
                                        value={typeof row.videoLecture === 'string' ? row.videoLecture : ''}
                                        onChange={(e) => handleVideoUrlChange(moduleIndex, subIndex, e.target.value)}
                                        className="h-10"
                                      />
                                      {row.videoLecture && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeVideo(moduleIndex, subIndex)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="file" className="mt-2">
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => e.target.files && handleVideoUpload(moduleIndex, subIndex, e.target.files[0])}
                                        className="h-10"
                                      />
                                      {row.videoLecture && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeVideo(moduleIndex, subIndex)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TabsContent>
                                </Tabs>
                                
                                {getVideoStatus(row)}
                              </div>

                              <div className="space-y-2">
  <Label className="font-semibold flex items-center gap-2">
    <FileText className="w-4 h-4" />
    Attach PDF (Optional)
  </Label>
  <div className="flex items-center gap-2">
    <Input
      type="file"
      accept=".pdf"
      onChange={(e) => e.target.files && handlePdfUpload(moduleIndex, subIndex, e.target.files[0])}
      className="h-10"
    />
    {row.attachedPdf && (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          PDF attached
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removePdf(moduleIndex, subIndex)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )}
  </div>
  {row.attachedPdf && (
    <a 
      href={row.attachedPdf} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline text-sm"
    >
      View attached PDF
    </a>
  )}
</div>

                            </div>

                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSubModule(moduleIndex, subIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Part
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button
                      onClick={() => addInternalDetailRow(moduleIndex)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      disabled={field.subModules.length >= field.parts}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sub Module ({field.subModules.length}/{field.parts})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Module Button */}
            <div className="flex justify-center">
              <Button
                onClick={addModuleField}
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-3" />
                Add New Module
              </Button>
            </div>

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
                    Saving Course Breakdown...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-3" />
                    Save Course Breakdown
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

export default Breakdown;