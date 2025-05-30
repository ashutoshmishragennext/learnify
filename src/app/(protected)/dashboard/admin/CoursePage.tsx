"use client";
import CourseIntroduction from "@/components/CourseIntroduction";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CoursePage: React.FC = () => {
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  // const [dynamicFields, setDynamicFields] = useState<string[]>([]); // To track dynamically added fields
  const [videoFile, setVideoFile] = useState<File | null>();
  const [pdfFile, setPdfFile] = useState<File | null>();
  const [realCategories, setRealCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "learnify_frontend");
    formData.append("cloud_name", "dtfe8o5ny");

    let uploadType = "raw"; // Default to raw for PDFs and other files

    if (file.type.startsWith("video/")) {
      uploadType = "video";
    } else if (file.type.startsWith("image/")) {
      uploadType = "image";
    } else {
      uploadType = "raw";
    }

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dtfe8o5ny/${uploadType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };
  const handleSave = async () => {
    setIsSaving(true); // Set saving state to true

    try {
      if (!videoFile || !pdfFile) {
        toast.error("Please upload both Demo and Syllabus files!");
        return;
      }

      const videoUrl = await uploadToCloudinary(videoFile);
      const syllabusUrl = await uploadToCloudinary(pdfFile);

      if (!videoUrl || !syllabusUrl) {
        toast.error("Error uploading files!");
        return;
      }

      const tagsArray =
        fieldValues.Tags?.split(/[\s,#]+/).filter(Boolean) || [];
      const prerequisiteArray =
        fieldValues.Prerequisite?.split(/[,#]+/).filter(Boolean) || [];
      const requirementArray =
        fieldValues.Requirement?.split(/[,#]+/).filter(Boolean) || [];
      const subPointsArray =
        fieldValues.SubPoints?.split(/[,#]+/).filter(Boolean) || [];

      const response = await fetch("/api/saveCourseIntro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fieldValues,
          Demo: videoUrl,
          Syllabus: syllabusUrl,
          TagsArray: tagsArray,
          PrerequisiteArray: prerequisiteArray,
          RequirementArray: requirementArray,
          SubPointsArray: subPointsArray,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success(data.message);
      } else {
        toast.error("Failed to save data!");
      }
    } catch (error) {
      console.error("Error while saving course intro:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsSaving(false); // Reset saving state after operation
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/courseCategories");
      const data = await response.json();
      if (data.categories) {
        setRealCategories(data.categories);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching courses:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CourseIntroduction/>
      {/* Combined Sections */}
      <DynamicSection
        title="Course Introduction"
        initialFields={[
          "Demo",
          "Course Heading",
          "Long Description",
          "SubPoints",
          "Category",
          "Certificate Provider",
          "Lifetime Access",
          "Select Level",
          "Tags",
          "Prerequisite",
          "Requirement",
          "Publisher Name",
          "Publisher Bio",
          "Publisher Description",
          "Publisher Profile Image",
          "Subtitles",
        ]}
        fieldValues={fieldValues}
        setFieldValues={setFieldValues}
        setPdfFile={setPdfFile}
        setVideoFile={setVideoFile}
        categories={realCategories}
        setRealCategories={setRealCategories}
      />
      <DynamicSection
        title="Course Details"
        initialFields={["No. of Assignment", "No. of Video Lectures"]}
        fieldValues={fieldValues}
        setFieldValues={setFieldValues}
        setPdfFile={setPdfFile}
        setVideoFile={setVideoFile}
        categories={realCategories}
        setRealCategories={setRealCategories}
      />
      <DynamicSection
        title="About Course"
        initialFields={["Syllabus"]}
        fieldValues={fieldValues}
        setFieldValues={setFieldValues}
        setPdfFile={setPdfFile}
        setVideoFile={setVideoFile}
        categories={realCategories}
        setRealCategories={setRealCategories}
      />

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-3 font-bold rounded-md text-white ${
            isSaving
              ? "bg-green-800 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:bg-green-600"
          }`}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

// Dynamic section that handles rendering form fields
const DynamicSection: React.FC<{
  title: string;
  initialFields: string[];
  fieldValues: { [key: string]: string };
  setFieldValues: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null | undefined>>;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null | undefined>>;
  setRealCategories: React.Dispatch<React.SetStateAction<string[]>>;
  categories: string[];
}> = ({
  title,
  initialFields,
  fieldValues,
  setFieldValues,
  setVideoFile,
  setPdfFile,
  categories,
  setRealCategories,
}) => {
  const [fields, setFields] = useState<string[]>(initialFields);
  const [localCategories, setLocalCategories] = useState<string[]>(categories);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const defaultValues: { [key: string]: string } = {
    Category: "Programming",
    "Select Level": "Beginner",
    "Certificate Provider": "No",
    "Lifetime Access": "No",
    Subtitles: "No",
    "Subtitles Language": "English", // Default for Subtitles Language
    Demo: "",
    Syllabus: "",
  };

  useEffect(() => {
    const initialValues = { ...defaultValues };
    initialFields.forEach((field) => {
      if (!initialValues[field]) {
        initialValues[field] = "";
      }
    });
    setFieldValues(initialValues);
  }, []); // The empty array ensures this effect runs only once when the component is mounted

  const addCategory = () => {
    const newCategory = prompt("Enter new category name:");
    if (newCategory && !localCategories.includes(newCategory)) {
      setFieldValues({ ...fieldValues, Category: newCategory });
      setRealCategories((prevCategories) => [...prevCategories, newCategory]);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (field: string, file: File) => {
    if (!file) return;

    if (field === "Publisher Profile Image") {
      const fileBase64 = await convertFileToBase64(file);
      if (fileBase64) {
        setFieldValues((prev) => ({ ...prev, [field]: fileBase64 }));
      }
    } else if (field === "Demo") {
      setVideoFile(file);
    } else if (field === "Syllabus") {
      setPdfFile(file);
    } else {
      setFieldValues((prev) => ({ ...prev, [field]: file.name }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value.toString(),
    }));

    if (field === "Subtitles") {
      if (value === "Yes") {
        if (!fields.includes("Subtitles Language")) {
          setFields((prevFields) => [...prevFields, "Subtitles Language"]);
        }
      } else {
        setFields((prevFields) =>
          prevFields.filter((f) => f !== "Subtitles Language")
        );
        setFieldValues((prevValues) => {
          const updatedValues = { ...prevValues };
          delete updatedValues["Subtitles Language"];
          return updatedValues;
        });
      }
    }
  };


  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-indigo-600 mb-2">{title}</h2>

      <div className="bg-white p-4 rounded-lg shadow">
        <Table
          fields={fields}
          fieldValues={fieldValues}
          onInputChange={handleInputChange}
          categories={categories}
          addCategory={addCategory}
          handleFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

const Table: React.FC<{
  fields: string[];
  fieldValues: { [key: string]: string };
  onInputChange: (field: string, value: string) => void;
  categories: string[];
  addCategory: () => void;
  handleFileUpload: (field: string, file: File) => void;
}> = ({
  fields,
  fieldValues,
  onInputChange,
  categories,
  addCategory,
  handleFileUpload,
}) => (
  <table className="w-full border-collapse border border-gray-300">
    <tbody>
      {fields.map((field, index) => (
        <tr key={index} className="border border-gray-300">
          <td className="p-2 border-r border-gray-300">
            {field} <span className="text-red-500">*</span>
          </td>
          <td className="p-2">
            {field === "Category" ? (
              <div className="flex items-center gap-2">
                <select
                  value={fieldValues[field] || ""}
                  onChange={(e) => onInputChange(field, e.target.value)}
                  className="w-full border p-1 rounded"
                >
                  {categories.map((category, i) => (
                    <option key={i} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addCategory}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  + Add Category
                </button>
              </div>
            ) : field === "Select Level" ? (
              <select
                value={fieldValues[field] || "Beginner"}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="w-full border p-1 rounded"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            ) : field === "Certificate Provider" ||
              field === "Lifetime Access" ||
              field === "Subtitles" ? (
              <select
                value={fieldValues[field] || "No"}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="w-full border p-1 rounded"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : field === "Subtitles Language" ? (
              <select
                value={fieldValues[field] || "English"}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="w-full border p-1 rounded"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Both">Both</option>
              </select>
            ) : field === "Tags" || field === "Sub Points" ? (
              <input
                type="text"
                value={fieldValues[field] || ""}
                onChange={(e) => onInputChange(field, e.target.value)}
                placeholder="Enter points separated by space or comma"
                className="w-full border p-1 rounded"
              />
            ) : field === "No. of Assignment" ||
              field === "No. of Video Lectures" ? (
              <input
                type="number"
                min="0"
                value={fieldValues[field] || ""}
                onChange={(e) => onInputChange(field, e.target.value)}
                placeholder={`Enter ${field}`}
                className="w-full border p-1 rounded"
              />
            ) : field === "Video Lectures" ? (
              <input
                type="number"
                min="0"
                value={fieldValues[field] || ""}
                onChange={(e) => onInputChange(field, e.target.value)}
                placeholder="Enter number of video lectures"
                className="w-full border p-1 rounded"
              />
            ) : field === "Syllabus" ||
              field === "Publisher Profile Image" ||
              field === "Demo" ? (
              <input
                type="file"
                accept={
                  field === "Syllabus"
                    ? "application/pdf"
                    : field === "Publisher Profile Image"
                    ? "image/*"
                    : field === "Demo"
                    ? "video/*"
                    : ""
                }
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(field, file);
                }}
                className="w-full border p-1 rounded"
              />
            ) : (
              <input
                type="text"
                value={fieldValues[field] || ""}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="w-full border p-1 rounded"
              />
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CoursePage;