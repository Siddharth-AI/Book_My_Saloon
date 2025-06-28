"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Added Eye, EyeOff, and a better Loader
import {
  changePassword,
  resetChangePasswordState,
} from "../../store/slices/changePasswordSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

export default function ChangePasswordPage() {
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  // --- ENHANCEMENT: State for password visibility ---
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useAppDispatch();
  const {
    loading,
    error: apiError,
    successMessage,
  } = useAppSelector((state) => state.changePassword);

  useEffect(() => {
    return () => {
      dispatch(resetChangePasswordState());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (newPassword.length < 8) {
      setFormError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("New and confirm passwords do not match.");
      return;
    }

    dispatch(
      changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        vendor_location_uuid: selectedLocationUuid,
      })
    );
  };

  return (
    // --- ENHANCEMENT: Responsive padding for the page container ---
    <div className="lg:w-3/4 bg-black/80 overflow-hidden shadow-2xl">
      <main className="w-full max-w-md bg-black text-white rounded-2xl border-2 border-white/10 shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">
          Change Password
        </h1>

        {successMessage && (
          <div
            className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-md mb-4 text-sm"
            role="alert">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {apiError && (
          <div
            className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-4 text-sm"
            role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        {formError && !apiError && (
          <div
            className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-4 text-sm"
            role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Current Password with Visibility Toggle --- */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59d5f] text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* --- New Password with Visibility Toggle --- */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59d5f] text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* --- Confirm Password with Visibility Toggle --- */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59d5f] text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading === "pending"}
            className="w-full bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105">
            {loading === "pending" ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
