"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  UserPlus,
  Sparkles,
  LogOut,
  Loader2,
  Settings,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { logoutUser } from "../../store/slices/authSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { openModal } from "../../store/slices/modalSlice";

type AuthScreen =
  | "login"
  | "password"
  | "forgot"
  | "otp"
  | "signup"
  | "success";

export default function ProfileDropdown() {
  const Router = useRouter();
  const dispatch = useAppDispatch();
  const { user, tempToken, isLoadingProfile, isInitialized, isLoggingOut } =
    useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAuthAction = (screen: AuthScreen) => {
    dispatch(openModal(screen));
    setIsOpen(false);
  };

  const handleAccountSetting = () => {
    Router.push("/settings/profile");
    setIsOpen(false);
  };

  const handleLogout = async () => {
    console.log("🚪 Logout button clicked");
    setIsOpen(false);

    try {
      // Call the logout API
      await dispatch(logoutUser()).unwrap();
      console.log("✅ Logout completed successfully");

      dispatch(clearCart()); // This triggers cart clearing too
      Router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.log("❌ Logout error:", error);
      // Even if API fails, the user will be logged out locally
    }
  };

  // Don't render anything until initialized
  if (!isInitialized) {
    return (
      <div className="relative p-3 ml-3 rounded-xl bg-white/10 backdrop-blur-xl border-1 border-white/20">
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is logged in, show user profile
  if (user?.isLoggedIn) {
    const getDisplayName = () => {
      if (user.display_name && user.display_name.trim()) {
        return user.display_name;
      }

      const firstName = user.fname || "";
      const lastName = user.lname || "";

      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }

      if (user.email) {
        return user.email.split("@")[0];
      }

      if (user.mobile) {
        return `User ${user.mobile.slice(-4)}`;
      }

      return "User";
    };

    const getFormattedMobile = () => {
      if (!user.mobile) return null;

      let mobile = user.mobile;
      if (mobile.startsWith("91") && mobile.length > 10) {
        mobile = mobile.substring(2);
      }

      if (mobile.length === 10) {
        return `${mobile.slice(0, 3)}-${mobile.slice(3, 6)}-${mobile.slice(6)}`;
      }

      return mobile;
    };

    const displayName = getDisplayName();
    const formattedMobile = getFormattedMobile();

    return (
      <div
        ref={dropdownRef}
        className="relative h-[45.6px] pb-5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <button
          className={`${
            user.profile_pic !== null ? "" : ""
          } relative overflow-hidden w-[46px] h-[45.5px] ml-3  rounded-xl bg-white/10 backdrop-blur-xl border-1 border-white/20 transition-all duration-300 group ${
            isOpen
              ? "bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border-[#c59d5f]/50 shadow-2xl shadow-[#c59d5f]/25"
              : "hover:bg-white/10 hover:border-[#c59d5f]/30"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          disabled={isLoggingOut}>
          {isLoggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#c59d5f] mx-auto" />
          ) : user.profile_pic !== null ? (
            <Image
              src={user.profile_pic}
              width={50}
              height={0}
              className="rounded-xl"
              alt="user image"
            />
          ) : (
            <User
              className={`w-11 h-11 transition-all duration-300 p-3 ${
                isOpen
                  ? "text-[#c59d5f] scale-110"
                  : "text-white group-hover:text-[#c59d5f]"
              }`}
            />
          )}

          <div
            className={`absolute inset-0 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-2xl blur-lg transition-opacity duration-300 ${
              isOpen ? "opacity-30" : "opacity-0"
            }`}
          />
        </button>

        <div
          className={`absolute right-0 top-16 w-80 bg-black/95 backdrop-blur-2xl border-2 border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-500 z-50 ${
            isOpen
              ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
              : "opacity-0 pointer-events-none translate-y-4 scale-95"
          }`}>
          <div className="p-4 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-xl blur-md opacity-75 animate-pulse" />
                <div className="relative w-12 h-12 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-xl flex items-center justify-center shadow-xl">
                  <div className="">
                    {user.profile_pic !== null ? (
                      <Image
                        src={user.profile_pic}
                        width={50}
                        height={0}
                        className="rounded-xl"
                        alt="user image"
                      />
                    ) : (
                      <User
                        className={`w-12 h-12 transition-all duration-300 p-3 ${
                          isOpen
                            ? "text-black scale-110"
                            : "text-white group-hover:text-[#c59d5f]"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {displayName}
                </p>
                <p className="text-[#c59d5f] text-xs font-medium truncate">
                  {user.email || formattedMobile || "Welcome!"}
                </p>
              </div>
            </div>
          </div>
          {/* <Link href="/settings/profile"> */}
          <div
            className="p-4 border-b border-white/10 cursor-pointer hover:bg-[#c59d5f]/20 transition-colors duration-300"
            onClick={handleAccountSetting}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl " />
                <div className="relative rounded-xl flex items-center justify-center shadow-xl">
                  <Settings className="w-6 h-6 text-[#f4d03f]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  Account Settings
                </p>
              </div>
            </div>
          </div>
          {/* </Link> */}
          <div
            className="p-4 border-b border-white/10 cursor-pointer hover:bg-[#c59d5f]/20 transition-colors duration-300"
            onClick={handleLogout}>
            <button
              className="w-full flex space-x-3 rounded-xl font-medium cursor-pointer  transition-all duration-300 group text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoggingOut}>
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-[#f4d03f]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">
                      Logging out...
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <LogOut className="ml-1 w-6 h-6 text-[#f4d03f]" />
                  <p className="text-white font-semibold text-sm">Logout</p>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-gradient-to-r from-black/80 to-black/60 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Welcome to Belle Femme
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state if we have a token and are loading profile (page refresh scenario)
  if (tempToken && isLoadingProfile) {
    return (
      <div className="relative p-3 ml-3 rounded-xl bg-white/10 backdrop-blur-xl border-1 border-white/20">
        <div className="w-5 h-5 border-2 border-[#c59d5f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is not logged in, show login options (NEW USERS)
  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <button
        className={`relative p-3 ml-3 rounded-xl bg-white/10 backdrop-blur-xl border-1 border-white/20 transition-all duration-300 group ${
          isOpen
            ? "bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border-[#c59d5f]/50 shadow-2xl shadow-[#c59d5f]/25 scale-105"
            : "hover:bg-white/10 hover:border-[#c59d5f]/30"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}>
        <User
          className={`w-5 h-5 transition-all duration-300 ${
            isOpen
              ? "text-[#c59d5f] scale-110"
              : "text-white group-hover:text-[#c59d5f]"
          }`}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-2xl blur-lg transition-opacity duration-300 ${
            isOpen ? "opacity-30" : "opacity-0"
          }`}
        />
      </button>

      <div
        className={`absolute right-0 top-16 w-72 bg-black/95 backdrop-blur-2xl border-2 border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-500 z-50 ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
            : "opacity-0 pointer-events-none translate-y-4 scale-95"
        }`}>
        <div className="p-4 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-xl blur-md opacity-75 animate-pulse" />
              <div className="relative w-10 h-10 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-5 h-5 text-black animate-bounce" />
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Welcome Back!</p>
              <p className="text-[#c59d5f] text-xs font-medium">
                Join Belle Femme today
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <button
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-semibold hover:shadow-xl hover:shadow-[#c59d5f]/40 transition-all duration-300 transform hover:scale-105 group text-sm"
            onClick={() => handleAuthAction("login")}>
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Create Account</span>
          </button>
        </div>

        <div className="p-4 bg-gradient-to-r from-black/80 to-black/60 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Secure & encrypted authentication
            <br />
            <span className="text-[#c59d5f]">Your privacy is our priority</span>
          </p>
        </div>
      </div>
    </div>
  );
}
