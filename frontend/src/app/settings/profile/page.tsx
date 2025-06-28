"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { updateUserProfile } from "../../store/slices/authSlice";
import { toastError } from "@/app/components/common/toastService";

export default function ProfileSettings() {
  const dispatch = useAppDispatch();
  const { selectedLocationUuid } = useAppSelector((state) => state.services);

  const { user, isLoadingProfile, isLoading } = useAppSelector(
    (state) => state.auth
  );

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    anniversary: "",
    email: "",
    mobile: "",
    address: "",
    locality: "",
    gender: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize form data from user profile - THIS IS CRUCIAL
  useEffect(() => {
    console.log("🔄 User data changed, updating form:", user);
    if (user) {
      const newFormData = {
        name: `${user?.fname} ${user?.lname}` || "",
        dob: user.dob || "",
        anniversary: user.anniversary || "",
        email: user.email || "",
        mobile: user.mobile?.replace(/^91/, "") || "",
        address: user.address || "",
        locality: user.locality || "",
        gender: user.gender || "",
      };
      console.log("📝 Setting new form data:", newFormData);
      setFormData(newFormData);
    }
  }, [user]); // This will trigger whenever user changes

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const getImageFileName = () => {
    if (selectedImage) {
      return selectedImage.name.length > 20
        ? selectedImage.name.substring(0, 20) + "..."
        : selectedImage.name;
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Starting profile update...");
    console.log("Current user before update:", user);
    console.log("Form data being submitted:", formData);

    try {
      // Prepare form data for API
      const updateData = {
        name: formData.name || `${user.fname} ${user.lname}`,
        email: formData.email || user.email,
        dob: formData.dob || user.dob,
        gender: formData.gender || user.gender,
        mobile: formData.mobile || user.mobile,
        dial_code: "91",
        country_id: "1",
        address: formData.address || user.address,
        anniversary: formData.anniversary,
        vendor_location_uuid: selectedLocationUuid,
        profile_pic: selectedImage || user.profile_pic,
      };
      console.log("📤 Dispatching updateUserProfile with:", {
        ...updateData,
        profile_pic: selectedImage ? "[File]" : null,
      });
      // Dispatch the update profile action
      const result = await dispatch(updateUserProfile(updateData));

      console.log("📥 Update result:", result);

      if (updateUserProfile.fulfilled.match(result)) {
        console.log("✅ Profile update successful!");
        console.log("Updated user data:", result.payload);

        setIsEditing(false);
        setShowSuccess(true);
        setSelectedImage(null);
        setImagePreview(null);

        // Hide success message after 3 seconds
        const timeout = setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        return () => clearTimeout(timeout);
        // Clear form fields after successful update
      } else {
        toastError("Failed to update profile");
        console.log("❌ Profile update failed:", result.payload);
      }
    } catch (error) {
      toastError("Failed to update profile");
      console.log("❌ Profile update error:", error);
    }
  };

  // Format mobile number for display
  const getFormattedMobile = () => {
    if (!user?.mobile) return "Not provided";

    let mobile = user.mobile;
    if (mobile.startsWith("91") && mobile.length > 10) {
      mobile = mobile.substring(2);
    }

    if (mobile.length === 10) {
      return `+91 ${mobile.slice(0, 3)}-${mobile.slice(3, 6)}-${mobile.slice(
        6
      )}`;
    }

    return mobile;
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center p-8 w-full">
        <div className="w-12 h-12 border-4 border-[#c59d5f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="lg:w-3/4 bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-400 font-medium">
              Profile updated successfully!
            </span>
          </div>
        )}

        {/* Profile Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
          <p className="text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="p-6 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border border-white/10 rounded-xl relative">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={!isEditing}
                />
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] flex items-center justify-center overflow-hidden">
                  {imagePreview || user?.profile_pic ? (
                    <img
                      src={
                        imagePreview || user.profile_pic || "/placeholder.svg"
                      }
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-black" />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Camera size={20} className="text-white" />
                    <span className="text-white text-xs ml-1">Upload</span>
                  </div>
                )}
              </div>

              {/* Show selected image name when editing */}
              {isEditing && selectedImage && (
                <div className="mt-2 text-center">
                  <span className="text-sm text-[#c59d5f] bg-white/10 px-3 py-1 rounded-full">
                    📷 {getImageFileName()}
                  </span>
                </div>
              )}

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {user?.display_name ||
                    `${user?.fname} ${user?.lname}` ||
                    "User"}
                </h2>
                <p className="text-[#c59d5f] text-sm mb-2">
                  {user?.email || getFormattedMobile()}
                </p>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                  Member since{" "}
                  {new Date(user?.createdAt || Date.now()).getFullYear()}
                </span>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-xl ${
                  isEditing
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-[#c59d5f]/20 text-[#c59d5f] hover:bg-[#c59d5f]/30"
                } transition-colors`}
                disabled={isLoading}>
                {isEditing ? <X size={20} /> : <Edit2 size={20} />}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div className="p-6 border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold text-[#c59d5f] mb-4 flex items-center">
                  <User size={18} className="mr-2" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#232526]/80 border border-white/10 rounded-lg focus:outline-none focus:border-[#c59d5f] text-white"
                        required
                      />
                    ) : (
                      <p className="text-white py-3">
                        {`${user?.fname} ${user?.lname}` || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#232526]/80 border border-white/10 rounded-lg focus:outline-none focus:border-[#c59d5f] text-white"
                      />
                    ) : (
                      <p className="text-white py-3">
                        {user?.dob || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Anniversary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Anniversary
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="anniversary"
                        value={formData.anniversary}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#232526]/80 border border-white/10 rounded-lg focus:outline-none focus:border-[#c59d5f] text-white"
                      />
                    ) : (
                      <p className="text-white py-3">
                        {user?.anniversary || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-[13px] border border-white/10 rounded-lg focus:outline-none focus:border-[#c59d5f] text-white bg-[#232526]/80 outline-none">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-white py-3">
                        {user?.gender || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="p-6 border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold text-[#c59d5f] mb-4 flex items-center">
                  <Mail size={18} className="mr-2" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#232526]/80 border border-white/10 rounded-lg focus:outline-none focus:border-[#c59d5f] text-white"
                      />
                    ) : (
                      <p className="text-white py-3">
                        {user?.email || "Not provided"}
                      </p>
                    )}
                    {user?.is_email_verify && (
                      <span className="text-xs text-green-400 mt-1 inline-block">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Mobile Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 bg-[#232526]/80 border border-white/10 rounded-lg focus:outline-none focus:border-[#c59d5f] text-white"
                      />
                    ) : (
                      <p className="text-white py-3">{getFormattedMobile()}</p>
                    )}
                    {user?.is_mobile_verify && (
                      <span className="text-xs text-green-400 mt-1 inline-block">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="p-6 border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold text-[#c59d5f] mb-4 flex items-center">
                  <MapPin size={18} className="mr-2" />
                  Address Information
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#232526]/80 border border-white/10 rounded-lg focus:outline-none focus:border-[#c59d5f] text-white"
                      />
                    ) : (
                      <p className="text-white py-3">
                        {user?.address || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Locality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Locality
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#232526]/80 border border-white/10 rounded-lg focus:outline-none focus:border-[#c59d5f] text-white"
                      />
                    ) : (
                      <p className="text-white py-3">
                        {user?.locality || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedImage(null);
                    setImagePreview(null);
                    // Reset form data to current user values
                    if (user) {
                      setFormData({
                        name: user.fname || "",
                        dob: user.dob || "",
                        anniversary: user.anniversary || "",
                        email: user.email || "",
                        mobile: user.mobile?.replace(/^91/, "") || "",
                        address: user.address || "",
                        locality: user.locality || "",
                        gender: user.gender || "",
                      });
                    }
                  }}
                  className="px-6 py-3 border-2 border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                  disabled={isLoading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-lg text-black font-semibold hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all flex items-center space-x-2"
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
