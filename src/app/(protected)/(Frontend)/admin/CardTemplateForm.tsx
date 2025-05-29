// "use client";

// import React, { useState } from "react";
// import { toast } from "react-toastify";

// interface SubField {
//   id: number;
//   name: string;
//   type: string;
//   placeholder: string;
//   value?: string;
// }

// interface Field {
//   id: number;
//   name: string;
//   type?: string;
//   placeholder?: string;
//   value?: string;
//   subFields?: SubField[];
// }

// interface FormData {
//   name: string;
//   shortDescription: string;
//   current: number;
//   original: number;
//   discountPercentage: number;
//   duration: number;
//   file: string;
// }

// const CardTemplateForm: React.FC = () => {
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [formData, setFormData] = useState<Field[]>([
//     { id: 1, name: "Hero IMG", type: "file", placeholder: "", value: "" },
//     { id: 2, name: "Duration", type: "number", placeholder: "Enter Duration", value: "" },
//     { id: 3, name: "Topic", type: "text", placeholder: "Enter Topic", value: "" },
//     { id: 4, name: "Short Description", type: "text", placeholder: "Enter Description", value: "" },
//     // Removed "Price" field but kept subfields
//     {
//       id: 5,
//       name: "Pricing Details",
//       subFields: [
//         { id: 51, name: "Current Price", type: "number", placeholder: "Enter Current Price", value: "" },
//         { id: 52, name: "Original Price", type: "number", placeholder: "Enter Original Price", value: "" },
//         { id: 53, name: "Discount Percentage", type: "number", placeholder: "Enter Discount %", value: "" },
//       ],
//     },
//   ]);

//   // Handle input change
//   const handleChange = (id: number, value: string, isSubField: boolean = false, parentId?: number) => {
//     setFormData((prevData) =>
//       prevData.map((field) => {
//         if (isSubField && field.subFields && field.id === parentId) {
//           return {
//             ...field,
//             subFields: field.subFields.map((subField) =>
//               subField.id === id ? { ...subField, value } : subField
//             ),
//           };
//         } else if (field.id === id) {
//           return { ...field, value };
//         }
//         return field;
//       })
//     );
//   };

//   // Handle file upload
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && file.type.startsWith("image/")) {
//       setImageFile(file);
//     } else {
//       toast.error("Please upload a valid image file");
//     }
//   };

//   // Extract real form data before submission
//   const extractRealFormData = async (): Promise<FormData | null> => {
//     const name = formData.find((f) => f.name === "Topic")?.value || "";
//     const shortDescription = formData.find((f) => f.name === "Short Description")?.value || "";
//     const duration = Number(formData.find((f) => f.name === "Duration")?.value) || 0;

//     // Extract price subfields
//     const priceField = formData.find((f) => f.name === "Pricing Details");
//     const current = Number(priceField?.subFields?.find((f) => f.name === "Current Price")?.value) || 0;
//     const original = Number(priceField?.subFields?.find((f) => f.name === "Original Price")?.value) || 0;
//     const discountPercentage = Number(priceField?.subFields?.find((f) => f.name === "Discount Percentage")?.value) || 0;

//     if (!name || !shortDescription || !duration || !current || !original || !imageFile) {
//       toast.error("Please fill all required fields.");
//       return null;
//     }

//     // Convert image file to Base64
//     const fileBase64 = await convertFileToBase64(imageFile);

//     return {
//       name,
//       shortDescription,
//       current,
//       original,
//       discountPercentage,
//       duration,
//       file: fileBase64, // Base64 encoded image
//     };
//   };

//   // Convert file to Base64
//   const convertFileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   // Submit form data
//   const handleSubmit = async () => {
//     const realFormData = await extractRealFormData();
//     if (!realFormData) return;

//     try {
//       const response = await fetch("/api/saveCardTemplate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(realFormData),
//       });

//       const data = await response.json();
//       console.log("Response:", data);
//       toast.success("Data saved successfully");
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Failed to save the data");
//     }
//   };

//   return (
//     <div className="bg-white shadow-md p-6 rounded-lg">
//       <table className="w-full text-left border-collapse border border-gray-200 mb-4">
//         <thead>
//           <tr>
//             <th className="p-2 border border-gray-200">Field Name</th>
//             <th className="p-2 border border-gray-200">Input</th>
//           </tr>
//         </thead>
//         <tbody>
//           {formData.map((field) => (
//             <React.Fragment key={field.id}>
//               <tr>
//                 <td className="p-2 border border-gray-200">{field.name}</td>
//                 <td className="p-2 border border-gray-200">
//                   {field.type === "file" ? (
//                     <input
//                       type="file"
//                       className="border p-2 rounded w-full"
//                       onChange={handleFileChange}
//                     />
//                   ) : field.type ? (
//                     <input
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={field.value || ""}
//                       className="border p-2 rounded w-full"
//                       onChange={(e) => handleChange(field.id, e.target.value)}
//                     />
//                   ) : null}
//                 </td>
//               </tr>
//               {field.subFields &&
//                 field.subFields.map((subField) => (
//                   <tr key={subField.id}>
//                     <td className="pl-6 p-2 border border-gray-200 text-gray-600">
//                       ├─ {subField.name}
//                     </td>
//                     <td className="p-2 border border-gray-200">
//                       <input
//                         type={subField.type}
//                         placeholder={subField.placeholder}
//                         value={subField.value || ""}
//                         className="border p-2 rounded w-full"
//                         onChange={(e) => handleChange(subField.id, e.target.value, true, field.id)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-end">
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CardTemplateForm;

"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

interface SubField {
  id: number;
  name: string;
  type: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
}

interface Field {
  id: number;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  subFields?: SubField[];
}

interface FormData {
  name: string;
  shortDescription: string;
  current: number;
  original: number;
  discountPercentage: number;
  duration: number;
  file: string;
}

const CardTemplateForm: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Field[]>([
    { id: 1, name: "Hero IMG", type: "file", placeholder: "", value: "" },
    {
      id: 2,
      name: "Duration",
      type: "number",
      placeholder: "Enter Duration in minutes for complete course",
      value: "",
    },
    {
      id: 3,
      name: "Topic",
      type: "text",
      placeholder: "Enter Topic",
      value: "",
    },
    {
      id: 4,
      name: "Short Description",
      type: "text",
      placeholder: "Enter Description",
      value: "",
    },
    {
      id: 5,
      name: "Pricing Details",
      subFields: [
        {
          id: 51,
          name: "Current Price",
          type: "number",
          placeholder: "Enter Current Price",
          value: "",
        },
        {
          id: 52,
          name: "Original Price",
          type: "number",
          placeholder: "Enter Original Price",
          value: "",
        },
        {
          id: 53,
          name: "Discount Percentage",
          type: "number",
          placeholder:
            "Enter Current Price for automatic disocount calculation: ",
          disabled: true,
        },
      ],
    },
  ]);

  // Handle input change
  const handleChange = (
    id: number,
    value: string,
    isSubField: boolean = false,
    parentId?: number
  ) => {
    setFormData((prevData) =>
      prevData.map((field) => {
        if (isSubField && field.subFields && field.id === parentId) {
          const updatedSubFields = field.subFields.map((subField) =>
            subField.id === id ? { ...subField, value } : subField
          );

          // Automatically calculate discount if both prices are provided
          const currentPrice =
            Number(updatedSubFields.find((f) => f.id === 51)?.value) || 0;
          const originalPrice =
            Number(updatedSubFields.find((f) => f.id === 52)?.value) || 0;

          if (
            currentPrice > 0 &&
            originalPrice > 0 &&
            originalPrice > currentPrice
          ) {
            const discount =
              ((originalPrice - currentPrice) / originalPrice) * 100;
            updatedSubFields.find((f) => f.id === 53)!.value =
              discount.toFixed(2);
          } else {
            updatedSubFields.find((f) => f.id === 53)!.value = "";
          }

          return { ...field, subFields: updatedSubFields };
        } else if (field.id === id) {
          return { ...field, value };
        }
        return field;
      })
    );
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  // Extract real form data before submission
  const extractRealFormData = async (): Promise<FormData | null> => {
    const name = formData.find((f) => f.name === "Topic")?.value || "";
    const shortDescription =
      formData.find((f) => f.name === "Short Description")?.value || "";
    const duration = 
      (Number(formData.find((f) => f.name === "Duration")?.value) || 0) / 60;
    
    // Extract price subfields
    const priceField = formData.find((f) => f.name === "Pricing Details");
    const current =
      Number(
        priceField?.subFields?.find((f) => f.name === "Current Price")?.value
      ) || 0;
    const original =
      Number(
        priceField?.subFields?.find((f) => f.name === "Original Price")?.value
      ) || 0;
    const discountPercentage = Math.round(
      Number(
        priceField?.subFields?.find((f) => f.name === "Discount Percentage")
          ?.value
      ) || 0
    );

    if (
      !name ||
      !shortDescription ||
      !duration ||
      !current ||
      !original ||
      !imageFile
    ) {
      toast.error("Please fill all required fields.");
      return null;
    }

    // Convert image file to Base64
    const fileBase64 = await convertFileToBase64(imageFile);

    return {
      name,
      shortDescription,
      current,
      original,
      discountPercentage,
      duration,
      file: fileBase64,
    };
  };

  // Convert file to Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit form data
  const handleSubmit = async () => {
    setIsSaving(true); // Set saving state to true
    const realFormData = await extractRealFormData();
    if (!realFormData) return;

    try {
      const response = await fetch("/api/saveCardTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(realFormData),
      });

      const data = await response.json();
      console.log("Response:", data);
      toast.success("Data saved successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save the data");
    } finally {
      setIsSaving(false); // Reset saving state after operation
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      {/* Info Section */}
      <div className="mb-6 p-4 bg-purple-100 border border-blue-300 rounded-lg">
        <h2 className="text-lg font-bold text-blue-800 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 114 10a8 8 0 0114 0zm-9-3a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 6a1 1 0 110 2 1 1 0 010-2z"
              clipRule="evenodd"
            />
          </svg>
          How to Fill Out This Page
        </h2>
        <p className="text-sm text-blue-700 mt-2">
          This form helps you structure your course card. Fill in all the
          required fields marked with{" "}
          <span className="text-red-500 font-bold">*</span>.
        </p>

        <ul className="list-disc pl-5 mt-2 text-sm text-blue-700">
          <li>
            <strong>Hero Image:</strong> Upload an image that represents your
            course. This image will be used as the course card image visible to
            users.
          </li>
          <li>
            <strong>Duration:</strong> Enter the total duration of the course in
            minutes.
          </li>
          <li>
            <strong>Topic:</strong> Specify the main subject of the course.
          </li>
          <li>
            <strong>Short Description:</strong> Provide a brief description of
            the course to give users an overview.
          </li>
          <li>
            <strong>Pricing Details:</strong>
            <ul className="list-disc pl-5">
              <li>
                <strong>Current Price:</strong> Enter the price at which the
                course is currently being sold.
              </li>
              <li>
                <strong>Original Price:</strong> Enter the original price before
                any discount.
              </li>
              <li>
                <strong>Discount Percentage:</strong> This will be
                auto-calculated based on the original and current price.
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <table className="w-full text-left border-collapse border border-gray-200 mb-4">
        <thead>
          <tr>
            <th className="p-2 border border-gray-200">Field Name</th>
            <th className="p-2 border border-gray-200">Input</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((field) => (
            <React.Fragment key={field.id}>
              <tr>
                <td className="p-2 border border-gray-200">
                  {field.name} <span className="text-red-500">*</span>
                </td>
                <td className="p-2 border border-gray-200">
                  {field.type === "file" ? (
                    <input
                      type="file"
                      className="border p-2 rounded w-full"
                      onChange={handleFileChange}
                    />
                  ) : field.type ? (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value || ""}
                      className="border p-2 rounded w-full"
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                  ) : null}
                </td>
              </tr>
              {field.subFields &&
                field.subFields.map((subField) => (
                  <tr key={subField.id}>
                    <td className="pl-6 p-2 border border-gray-200 text-gray-600">
                      ├─ {subField.name}
                    </td>
                    <td className="p-2 border border-gray-200">
                      <input
                        type={subField.type}
                        placeholder={subField.placeholder}
                        value={subField.value || ""}
                        className="border p-2 rounded w-full"
                        disabled={subField.id === 53}
                        onChange={(e) =>
                          handleChange(
                            subField.id,
                            e.target.value,
                            true,
                            field.id
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* <div className="flex justify-end">
              <button
         onClick={handleSubmit}
         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
       >
          Save
        </button>
      </div> */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
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

export default CardTemplateForm;
