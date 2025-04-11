"use client";

import Image from "next/image";
import { useState } from "react";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "+91 ",
    address: "",
    city: "",
    state: "",
  });
  

  const [tempFormData, setTempFormData] = useState({ ...formData });
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [profileImage, setProfileImage] = useState("/profile.jpg");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "contactNumber") {
      // Ensure +91 remains at the beginning
      if (!value.startsWith("+91 ")) {
        return;
      }
    }

    setTempFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(password)) {
      setPasswordError(
        "Password must be 8+ characters, include uppercase, lowercase, number & special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    for (const key in tempFormData) {
      if (tempFormData[key as keyof typeof tempFormData].trim() === "") {
        setFormError("All fields must be filled.");
        return false;
      }
    }
    setFormError("");
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      setFormData(tempFormData);
    }
  };

  const handleCancel = () => {
    setTempFormData(formData);
    setFormError("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-6">
        <div className="text-center">
          <Image
            height={24}
            width={24}
            src={profileImage}
            alt="Profile"
            className="mx-auto rounded-full object-cover"
          />
          <h2 className="mt-3 font-semibold text-lg">
            {formData.firstName || "First Name"}{" "}
            {formData.lastName || "Last Name"}
          </h2>
          <ul className="mt-5">
            <li className="text-purple-600 font-medium cursor-pointer">
              Edit Profile
            </li>
            <li className="text-gray-500 mt-3 cursor-pointer">
              <label htmlFor="profile-upload" className="cursor-pointer">
                Update Photo
              </label>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 bg-white shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-purple-700">Edit Profile</h1>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={tempFormData.firstName}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={tempFormData.lastName}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={tempFormData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={tempFormData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block font-medium">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={tempFormData.contactNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={tempFormData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">City</label>
            <input
              type="text"
              name="city"
              value={tempFormData.city}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">State</label>
            <select
              name="state"
              value={tempFormData.state}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select State</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Bihar">Bihar</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>
        </div>

        {formError && <p className="text-red-500 mt-2">{formError}</p>}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            className="border border-purple-600 text-purple-600 px-4 py-2 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-purple-600 text-white px-6 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
