"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

// Define types for module fields and internal details
interface InternalDetail {
  partNumber: number;
  partName: string;
  duration: { minutes: number; seconds: number };
  videoLecture: File | null;
}

interface ModuleField {
  number: number;
  topic: string;
  parts: number;
  duration: { hours: number; minutes: number; seconds: number };
  reward: number;
  subModules: InternalDetail[];
}

const Breakdown: React.FC = () => {
  const [moduleFields, setModuleFields] = useState<ModuleField[]>([
    {
      number: 1,
      topic: "",
      parts: 1,
      duration: { hours: 0, minutes: 0, seconds: 0 },
      reward: 1,
      subModules: [
        {
          partNumber: 1,
          partName: "",
          duration: { minutes: 0, seconds: 0 },
          videoLecture: null,
        },
      ],
    },
  ]);

  const addModuleField = () => {
    setModuleFields([
      ...moduleFields,
      {
        number: 1,
        topic: "",
        parts: 1,
        duration: { hours: 0, minutes: 0, seconds: 0 },
        reward: 1,
        subModules: [
          {
            partNumber: 1,
            partName: "",
            duration: { minutes: 0, seconds: 0 },
            videoLecture: null,
          },
        ],
      },
    ]);
  };

  const [isSaving, setIsSaving] = useState(false);

  const deleteModule = (index: number) => {
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
          ? module.subModules.length < module.parts // Check if adding another submodule is allowed
            ? {
                ...module,
                subModules: [
                  ...module.subModules,
                  {
                    partNumber: module.subModules.length + 1,
                    partName: "",
                    duration: { minutes: 0, seconds: 0 },
                    videoLecture: null,
                  },
                ],
              }
            : module // If limit is reached, return the same module without modification
          : module
      )
    );
  };

  // Ensure the number of subModules does not exceed 'parts' when updating the 'parts' field
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
          [field]: field === "topic" ? value.toString() : Number(value),
        };

        // If the 'parts' value decreases, remove extra submodules
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
                        field === "partName"
                          ? (value ?? "").toString()
                          : field === "videoLecture"
                          ? value ?? ""
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
    setIsSaving(true); // Set saving state to true
    console.log("Complete object before upload:", moduleFields);

    try {
      const updatedFields = moduleFields.map(moduleItem => ({
        ...moduleItem,
        duration:
          moduleItem.duration.hours * 3600 +
          moduleItem.duration.minutes * 60 +
          moduleItem.duration.seconds, // Convert module duration to seconds
        subModules: moduleItem.subModules.map(sub => ({
          ...sub,
          duration: sub.duration.minutes * 60 + sub.duration.seconds, // Convert submodule duration to seconds
        })),
      }));
      let count = 0;
      // Iterate over modules and submodules to upload videos
      for (const moduleItem of updatedFields) {
        for (const subModule of moduleItem.subModules) {
          if (subModule.videoLecture instanceof File) {
            count+=1;
            const uploadedUrl = await uploadToCloudinary(
              subModule.videoLecture
            );
            if (uploadedUrl) {
              subModule.videoLecture = uploadedUrl;
              toast.success(`Video upload ${count} successfull`);
            } else {
              toast.error(`Video upload ${count} failed`);
              throw new Error(`Video upload ${count} failed`);
            }
          }
        }
      }

      // Now send the updated data with Cloudinary URLs to backend
      const response = await fetch("/api/saveCourseBreakdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      const result = await response.json();
      console.log("Success:", result);
      toast.success("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data.");
    } finally {
      setIsSaving(false); // Reset saving state after operation
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
  
  const handleVideoUpload = async (
    moduleIndex: number,
    subIndex: number,
    file: File
  ) => {
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      handleInternalDetailChange(
        moduleIndex,
        subIndex,
        "videoLecture",
        uploadedUrl
      );
    } else {
      toast.error("Failed to upload video.");
    }
  };

  const removeVideo = (moduleIndex: number, subIndex: number) => {
    handleInternalDetailChange(moduleIndex, subIndex, "videoLecture", null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Course Breakdown
      </h1>

      {moduleFields.map((field, moduleIndex) => (
        <div key={moduleIndex} className="mb-8 border p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-700">
              Module {moduleIndex + 1}
            </h2>
            <FaTrash
              className="text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => deleteModule(moduleIndex)}
            />
          </div>
          <table className="w-full border border-gray-300">
            <tbody>
              {["number", "topic", "parts", "reward"].map((key) => (
                <tr key={key}>
                  <td className="px-4 py-2 bg-gray-100 font-semibold text-purple-700">
                    {key} <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type={key === "topic" ? "text" : "number"}
                      value={field[key as keyof ModuleField] as string | number}
                      placeholder={`Enter ${key}`}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      onChange={(e) =>
                        handleModuleInputChange(
                          moduleIndex,
                          key as keyof ModuleField,
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
              {/* Duration Field */}
              <tr>
                <td className="px-4 py-2 bg-gray-100 font-semibold text-purple-700">
                  Duration <span className="text-red-500">*</span>
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <input
                    type="number"
                    placeholder="Hrs"
                    value={field.duration.hours || ""}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                    onChange={(e) =>
                      handleModuleDurationChange(
                        moduleIndex,
                        "hours",
                        Number(e.target.value)
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Min"
                    value={field.duration.minutes || ""}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                    onChange={(e) =>
                      handleModuleDurationChange(
                        moduleIndex,
                        "minutes",
                        Number(e.target.value)
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Secs"
                    value={field.duration.seconds || ""}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                    onChange={(e) =>
                      handleModuleDurationChange(
                        moduleIndex,
                        "seconds",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-purple-700 mb-4">
              Sub Modules
            </h2>
            <table className="w-full border border-gray-300 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  {["partNumber", "partName", "duration", "videoLecture"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-2 text-left font-semibold text-purple-700"
                      >
                        {heading} <span className="text-red-500">*</span>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {field.subModules.map((row, subIndex) => (
                  <tr key={subIndex}>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        placeholder="Part Number"
                        value={row.partNumber}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        onChange={(e) =>
                          handleInternalDetailChange(
                            moduleIndex,
                            subIndex,
                            "partNumber",
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Part Name"
                        value={row.partName}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        onChange={(e) =>
                          handleInternalDetailChange(
                            moduleIndex,
                            subIndex,
                            "partName",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    {/* Duration Fields for Sub Modules */}
                    <td className="px-4 py-2 flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={row.duration.minutes || ""}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                        onChange={(e) =>
                          handleSubModuleDurationChange(
                            moduleIndex,
                            subIndex,
                            "minutes",
                            Number(e.target.value)
                          )
                        }
                      />
                      <input
                        type="number"
                        placeholder="Sec"
                        value={row.duration.seconds || ""}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                        onChange={(e) =>
                          handleSubModuleDurationChange(
                            moduleIndex,
                            subIndex,
                            "seconds",
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>

                    {/* Video Upload */}
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        {/* Hidden File Input */}
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          id={`video-upload-${moduleIndex}-${subIndex}`}
                          onChange={(e) =>
                            e.target.files &&
                            handleVideoUpload(
                              moduleIndex,
                              subIndex,
                              e.target.files[0] || null
                            )
                          }
                        />

                        {/* Upload Button */}
                        <label
                          htmlFor={`video-upload-${moduleIndex}-${subIndex}`}
                          className={`px-3 py-1 rounded-md cursor-pointer text-white ${
                            moduleFields[moduleIndex].subModules[subIndex]
                              .videoLecture
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {moduleFields[moduleIndex].subModules[subIndex]
                            .videoLecture
                            ? "Video Uploaded"
                            : "Upload"}
                        </label>

                        {/* Remove Button (Cross Icon) */}
                        {moduleFields[moduleIndex].subModules[subIndex]
                          .videoLecture && (
                          <button
                            onClick={() => removeVideo(moduleIndex, subIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ❌
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-center">
                      <FaTrash
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => deleteSubModule(moduleIndex, subIndex)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md"
              onClick={() => addInternalDetailRow(moduleIndex)}
            >
              Add Sub Module
            </button>
          </div>
        </div>
      ))}

      <button
        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md"
        onClick={addModuleField}
      >
        Add Module
      </button>

      {/* Save Button */}
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

export default Breakdown;