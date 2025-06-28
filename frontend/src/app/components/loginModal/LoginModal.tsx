"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  User,
  Mail,
  Phone,
  Check,
  Loader2,
  Lock,
  Shield,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  sendOTP,
  verifyOTP,
  completeRegistration,
  loginWithPassword,
  clearError,
  resetOTPState,
  resetForgotPasswordState,
  getUserProfile,
  sendForgotPasswordOTP,
  resetPassword,
} from "../../store/slices/authSlice";
import { toastError } from "../common/toastService";
type ScreenType =
  | "login"
  | "password"
  | "forgot"
  | "otp"
  | "signup"
  | "success"
  | "reset-password";

interface UserData {
  fullName: string;
  email: string;
  mobile: string;
  isLoggedIn: boolean;
}

// Props now align with what the layout provides
interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  screen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  onUserLogin?: (userData: UserData) => void; // This is optional
}

export default function LoginModal({
  show,
  onClose,
  screen,
  setScreen,
  onUserLogin,
}: LoginModalProps) {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    otpSent,
    otpSentTo,
    otpContact,
    isVerifying,
    isRegistering,
    user,
    alreadyRegistered,
    skipProfile,
    isLoadingProfile,
    forgotPasswordOtpSent,
    forgotPasswordOtpSentTo,
    forgotPasswordContact,
    isResettingPassword,
  } = useAppSelector((state) => state.auth);
  // console.log(user);
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  // const [customError, setCustomError] = useState<string | null>(null);
  const [tab, setTab] = useState<"mobile" | "email">("mobile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [countryCode] = useState(91);
  const [showSuccessFor3Sec, setShowSuccessFor3Sec] = useState(false);
  const [fetchedUserAfterOTP, setFetchedUserAfterOTP] = useState(false);

  useEffect(() => {
    if (!show) {
      return;
    }
    console.log(error, "error occured==================");
    if (error) {
      if (screen === "password") {
        if (tab === "mobile") {
          toastError(
            "The mobile number or password you entered is incorrect. Please try again."
          );
        } else {
          toastError(
            "The email or password you entered is incorrect. Please try again."
          );
        }
      } else if (screen === "otp" || screen === "reset-password") {
        toastError(
          "The verification code is incorrect or has expired. Please check the code and try again."
        );
      } else if (screen === "forgot") {
        if (tab === "mobile") {
          toastError(
            "We couldn't find an account with that mobile number. Please check the number and try again."
          );
        } else {
          toastError(
            "We couldn't find an account with that email address. Please check the address and try again."
          );
        }
      } else if (screen === "login") {
        if (tab === "mobile") {
          toastError(
            "The mobile number you entered is incorrect. Please try again."
          );
        } else {
          toastError("The email you entered is incorrect. Please try again.");
        }
      } else if (screen === "signup") {
        toastError(
          "Could not create your account. The email or mobile number may already be in use. Please check your details and try again."
        );
      } else {
        toastError(error);
      }
    }
    // It's good practice to clear the error in Redux after showing it
    dispatch(clearError());
  }, [error, screen, tab, dispatch]);

  // useEffect(() => {
  //   // Clear any previous errors when the user switches screens
  //   if (error) {
  //     dispatch(clearError());
  //   }
  // }, [screen, dispatch]);

  useEffect(() => {
    if (show) {
      setTab("mobile");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setPhoneNumber("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setOtp("");
      setResetOtp("");
      setShowSuccessFor3Sec(false);
      setFetchedUserAfterOTP(false);
      dispatch(clearError());
      dispatch(resetOTPState());
      dispatch(resetForgotPasswordState());

      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, dispatch]);

  // Handle successful login (when user is already registered and skip profile)
  useEffect(() => {
    if (
      alreadyRegistered &&
      skipProfile &&
      !isLoadingProfile &&
      !fetchedUserAfterOTP
    ) {
      // Fetch user profile after successful OTP verification
      dispatch(getUserProfile()).then((result) => {
        console.log(result, "==========getUserProfile result");
        if (result.type === "auth/getUserProfile/fulfilled") {
          setFetchedUserAfterOTP(true);
          setScreen("success");
          setShowSuccessFor3Sec(true);

          // Show success screen for 3 seconds
          setTimeout(() => {
            setShowSuccessFor3Sec(false);
            type PayloadType = {
              display_name?: string;
              fname?: string;
              lname?: string;
              email?: string;
              mobile?: string;
            };
            const payloadObj = result.payload as PayloadType;
            const userData: UserData = {
              fullName:
                payloadObj.display_name ||
                `${payloadObj.fname ?? ""} ${payloadObj.lname ?? ""}`,
              email: payloadObj.email || "",
              mobile: payloadObj.mobile || "",
              isLoggedIn: true,
            };
            // Log user data to console for debugging
            console.log(userData, "success user data");
            // Call the onUserLogin callback with user data if provided
            // This allows parent components to handle the login state
            onUserLogin?.(userData);
            onClose();
          }, 2000); // 3 seconds
        }
      });
    }
  }, [
    alreadyRegistered,
    skipProfile,
    isLoadingProfile,
    fetchedUserAfterOTP,
    dispatch,
    onUserLogin,
    onClose,
    setScreen,
  ]);

  // Handle when user data is available after OTP verification and profile fetch
  useEffect(() => {
    if (
      user &&
      user.isLoggedIn &&
      fetchedUserAfterOTP &&
      !showSuccessFor3Sec &&
      screen !== "success"
    ) {
      setScreen("success");
      setShowSuccessFor3Sec(true);

      // Show success screen for 3 seconds
      setTimeout(() => {
        setShowSuccessFor3Sec(false);
        const userData: UserData = {
          fullName: user.display_name || `${user.fname} ${user.lname}`,
          email: user.email || "",
          mobile: user.mobile || "",
          isLoggedIn: true,
        };
        onUserLogin?.(userData);
        onClose();
      }, 2000); // 3 seconds
    }
  }, [
    user,
    fetchedUserAfterOTP,
    showSuccessFor3Sec,
    screen,
    onUserLogin,
    onClose,
    setScreen,
  ]);

  // Auto navigate to OTP screen when OTP is sent
  useEffect(() => {
    if (otpSent) {
      setScreen("otp");
    }
  }, [otpSent, setScreen]);

  // Auto navigate to reset password screen when forgot password OTP is sent
  useEffect(() => {
    if (forgotPasswordOtpSent) {
      setScreen("reset-password");
    }
  }, [forgotPasswordOtpSent, setScreen]);

  if (!show) return null;

  const handleSendOTP = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    const payload = {
      type: tab,
      vendorLocationUuid: selectedLocationUuid,
      ...(tab === "mobile"
        ? { mobile: phoneNumber, dialCode: countryCode, countryId: "1" }
        : { email }),
    };

    dispatch(sendOTP(payload));
  };

  const handleSendForgotPasswordOTP = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    const payload = {
      type: tab,
      vendorLocationUuid: selectedLocationUuid,
      ...(tab === "mobile"
        ? { mobile: phoneNumber, dialCode: countryCode, countryId: "1" }
        : { email }),
    };

    dispatch(sendForgotPasswordOTP(payload));

    setResetOtp("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleVerifyOTP = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    const payload = {
      type: otpSentTo!,
      otp,
      vendorLocationUuid: selectedLocationUuid,
      ...(otpSentTo === "mobile"
        ? { mobile: phoneNumber, dialCode: countryCode, countryId: "1" }
        : { email: email }),
    };

    console.log(payload, "verfiy otp eroor======================");

    const result = await dispatch(verifyOTP(payload));
    if (
      result.type === "auth/verifyOTP/fulfilled" &&
      result.payload &&
      typeof result.payload !== "string" &&
      result.payload.data &&
      result.payload.data.data
    ) {
      const { already_registered, skip_profile } = result.payload.data.data;
      console.log(already_registered, "already_registered=>>>>>>>>>>>>>>>>>>");
      console.log(skip_profile, "skip_profile=>>>>>>>>>>>>>>>>>>>>>");
      if (!already_registered || !skip_profile) {
        // New user needs to complete profile
        console.log("set signup screen");
        setScreen("signup");
      }
      // For existing users, the useEffect above will handle fetching profile and success screen
    }
  };

  const handleResetPassword = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    if (password !== confirmPassword) {
      toastError("Passwords do not match. Please try again.");
      return;
    }

    const payload = {
      type: forgotPasswordOtpSentTo!,
      verificationCode: resetOtp,
      password,
      vendorLocationUuid: selectedLocationUuid,
      ...(forgotPasswordOtpSentTo === "mobile"
        ? { mobile: phoneNumber, dialCode: countryCode, countryId: "1" }
        : { email }),
    };

    const result = await dispatch(resetPassword(payload));
    if (result.type === "auth/resetPassword/fulfilled") {
      // Show success message and redirect to login
      setScreen("success");
      setShowSuccessFor3Sec(true);

      setTimeout(() => {
        setShowSuccessFor3Sec(false);
        setScreen("login");
        // Reset all form fields
        setPhoneNumber("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setResetOtp("");
        dispatch(resetForgotPasswordState());
      }, 3000);
    }
  };

  const handleCompleteSignup = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    // Validate required fields based on verification method
    if (otpSentTo === "mobile" && !email) {
      toastError("Email is a required field.");
      return;
    }

    if (otpSentTo === "email" && !phoneNumber) {
      toastError("Mobile number is a required field.");
      return;
    }

    if (!fullName || !password) {
      toastError("Full name and password are required.");
      return;
    }

    // Make sure otpSentTo is not null before proceeding
    if (!otpSentTo) {
      toastError("Verification method not detected. Please try again.");
      return;
    }

    // Create a properly typed request body
    const requestBody: {
      password: string;
      name: string;
      mobile?: string;
      email?: string;
      vendor_location_uuid: string;
      verified_by: "mobile" | "email";
      gender: string;
      dial_code: string;
      country_id: string;
    } = {
      password: password,
      name: fullName,
      vendor_location_uuid: selectedLocationUuid,
      verified_by: otpSentTo, // Use the actual verification method without default
      gender: " ",
      dial_code: "91",
      country_id: "1",
    };

    // Add mobile or email based on verification method
    if (otpSentTo === "mobile") {
      // If verified by mobile, we already have the mobile number but need to collect email
      requestBody.mobile = `91${phoneNumber}`;
      requestBody.email = email;
    } else {
      // If verified by email, we already have the email but need to collect mobile
      requestBody.email = email;
      requestBody.mobile = `91${phoneNumber}`;
    }

    console.log("📤 Registration request body:", {
      ...requestBody,
      password: "***",
    });

    const result = await dispatch(
      completeRegistration({
        fullName,
        password,
        vendorLocationUuid: selectedLocationUuid,
        ...(otpSentTo === "mobile"
          ? { mobile: phoneNumber, email }
          : { email, mobile: phoneNumber }),
      })
    );

    if (result.type === "auth/completeRegistration/fulfilled") {
      setScreen("success");
      setShowSuccessFor3Sec(true);

      // Show success screen for 3 seconds
      setTimeout(() => {
        setShowSuccessFor3Sec(false);
        let userData: UserData = {
          fullName: "",
          email: "",
          mobile: "",
          isLoggedIn: true,
        };
        if (result.payload && typeof result.payload !== "string") {
          userData = {
            fullName:
              result.payload.display_name ||
              `${result.payload.fname ?? ""} ${result.payload.lname ?? ""}`,
            email: result.payload.email || "",
            mobile: result.payload.mobile || "",
            isLoggedIn: true,
          };
        }
        onUserLogin?.(userData);
        onClose();
      }, 3000); // 3 seconds
    }
  };

  const handlePasswordLogin = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    const payload = {
      type: tab,
      password,
      vendorLocationUuid: selectedLocationUuid,
      ...(tab === "mobile" ? { mobile: phoneNumber } : { email }),
    };

    const result = await dispatch(loginWithPassword(payload));
    if (result.type === "auth/loginWithPassword/fulfilled") {
      setScreen("success");
      setShowSuccessFor3Sec(true);

      // Show success screen for 3 seconds
      setTimeout(() => {
        setShowSuccessFor3Sec(false);
        let userData: UserData = {
          fullName: "",
          email: "",
          mobile: "",
          isLoggedIn: true,
        };
        if (result.payload && typeof result.payload !== "string") {
          userData = {
            fullName:
              result.payload.display_name ||
              `${result.payload.fname ?? ""} ${result.payload.lname ?? ""}`,
            email: result.payload.email || "",
            mobile: result.payload.mobile || "",
            isLoggedIn: true,
          };
        }
        onUserLogin?.(userData);
        onClose();
      }, 3000); // 3 seconds
    }
  };

  const renderTabs = () => (
    <div className="flex mb-6 bg-black/30 rounded-xl p-1">
      <button
        className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-300
          ${
            tab === "mobile"
              ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black shadow-lg"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
        onClick={() => setTab("mobile")}>
        Mobile
      </button>
      <button
        className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-300
          ${
            tab === "email"
              ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black shadow-lg"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
        onClick={() => setTab("email")}>
        Email
      </button>
    </div>
  );

  // const renderError = () => {
  //   if (!error) return null;

  //   return (
  //     <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
  //       <p className="text-red-400 text-sm">{error}</p>
  //     </div>
  //   );
  // };

  // const renderErrors = () => {
  //   if (!customError) return null;

  //   return (
  //     <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
  //       <p className="text-red-400 text-sm">{customError}</p>
  //     </div>
  //   );
  // };

  const renderLoginScreen = () => (
    <>
      <div className="flex justify-end">
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-bold text-xl mb-2 text-white">
          Login or sign up
        </h3>
        <p className="text-center text-gray-400 text-sm">
          Login or sign up using your mobile number or email address
        </p>
      </div>

      {/* {renderErrors()} */}
      {renderTabs()}

      {tab === "mobile" ? (
        <div className="mb-5">
          <label className="block font-medium text-sm text-white mb-1.5">
            Mobile Number*
          </label>
          <div className="flex rounded-lg overflow-hidden bg-white/10 border border-white/20 focus-within:border-[#c59d5f] transition-colors duration-300">
            <button
              className="px-3 bg-black/30 text-[#c59d5f] font-medium text-sm focus:outline-none border-r border-white/10"
              type="button">
              +{countryCode}
            </button>
            <input
              type="tel"
              className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
              placeholder="9977004451"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <label className="block font-medium text-sm text-white mb-1.5">
            Email Address*
          </label>
          <input
            type="email"
            className="w-full rounded-lg px-3 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <button
        className="w-full py-2.5 mb-4 rounded-lg font-medium text-sm text-black bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleSendOTP}
        disabled={
          isLoading ||
          (!phoneNumber && tab === "mobile") ||
          (!email && tab === "email")
        }>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Verification Code"
        )}
      </button>

      <div className="flex items-center my-4">
        <span className="flex-1 h-px bg-white/10"></span>
        <span className="mx-3 text-gray-400 text-xs">Or</span>
        <span className="flex-1 h-px bg-white/10"></span>
      </div>

      <button
        className="w-full py-2.5 rounded-lg font-medium text-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
        onClick={() => setScreen("password")}>
        Login with password
      </button>
    </>
  );

  const renderOTPScreen = () => (
    <>
      <div className="flex justify-between items-center">
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={() => setScreen("login")}>
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-bold text-xl mb-2 text-white">
          Verify OTP
        </h3>
        <p className="text-center text-gray-400 text-sm">
          We&apos;ve sent a verification code to your{" "}
          <span className="text-[#c59d5f] font-medium">{otpContact}</span>
        </p>
      </div>

      {/* {renderErrors()} */}

      <div className="mb-5">
        <label className="block font-medium text-sm text-white mb-1.5">
          Enter OTP*
        </label>
        <input
          type="text"
          className="w-full rounded-lg px-3 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm text-center tracking-widest"
          placeholder="0000"
          maxLength={4}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      <button
        className="w-full py-2.5 mb-4 rounded-lg font-medium text-sm text-black bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleVerifyOTP}
        disabled={isVerifying || otp.length !== 4}>
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

      <div className="text-center">
        <button
          className="text-[#c59d5f] hover:text-[#f4d03f] font-medium text-xs transition-colors duration-300 disabled:opacity-50"
          onClick={handleSendOTP}
          disabled={isLoading}>
          {isLoading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </>
  );

  const renderSignupScreen = () => (
    <>
      <div className="flex justify-between items-center">
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={() => setScreen("otp")}>
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-bold text-xl mb-2 text-white">
          Complete Your Profile
        </h3>
        <p className="text-center text-gray-400 text-sm">
          Please fill in your details to create your account
        </p>
      </div>

      {/* {renderErrors()} */}

      <div className="space-y-4 mb-5">
        <div>
          <label className="block font-medium text-sm text-white mb-1.5">
            Full Name*
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              className="w-full rounded-lg pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        {otpSentTo === "mobile" ? (
          <div>
            <label className="block font-medium text-sm text-white mb-1.5">
              Email Address*
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="email"
                className="w-full rounded-lg pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block font-medium text-sm text-white mb-1.5">
              Mobile Number*
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <div className="flex rounded-lg overflow-hidden bg-white/10 border border-white/20 focus-within:border-[#c59d5f] transition-colors duration-300">
                <button
                  className="px-3 bg-black/30 text-[#c59d5f] font-medium text-sm focus:outline-none border-r border-white/10"
                  type="button">
                  +{countryCode}
                </button>
                <input
                  type="tel"
                  className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                  placeholder="9977004439"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block font-medium text-sm text-white mb-1.5">
            Password*
          </label>
          <div className="flex items-center rounded-lg overflow-hidden bg-white/10 border border-white/20 focus-within:border-[#c59d5f] transition-colors duration-300">
            <input
              type={showPassword ? "text" : "password"}
              className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="px-3 py-2.5 bg-transparent text-gray-400 hover:text-white transition-colors duration-300"
              type="button"
              onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button
        className="w-full py-2.5 mb-4 rounded-lg font-medium text-sm text-black bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleCompleteSignup}
        disabled={isRegistering || !fullName || !password}>
        {isRegistering ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </>
  );

  const renderSuccessScreen = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Check className="text-black" size={32} />
        </div>
        <h3 className="font-bold text-xl mb-2 text-white">
          {screen === "success" && isResettingPassword
            ? "Password Reset Successfully!"
            : alreadyRegistered
            ? "Welcome Back to Belle Femme!"
            : "Welcome to Belle Femme!"}
        </h3>
        <p className="text-gray-400 text-sm">
          {screen === "success" && isResettingPassword
            ? "Your password has been reset successfully. You can now login with your new password."
            : alreadyRegistered
            ? "You have been logged in successfully"
            : "Your account has been created successfully"}
        </p>
      </div>

      {user && !isResettingPassword && (
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <p className="text-white font-medium">
            Hello,{" "}
            {user?.display_name || `${user?.fname} ${user?.lname}` || fullName}!
          </p>
          <p className="text-gray-400 text-sm">
            You are now logged in and ready to explore
          </p>
        </div>
      )}

      {/* 3-second countdown indicator */}
      {showSuccessFor3Sec && (
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-1 mb-2">
            <div className="bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] h-1 rounded-full animate-[shrink_3s_linear_forwards]"></div>
          </div>
          <p className="text-gray-400 text-xs">
            {screen === "success" && isResettingPassword
              ? "Redirecting to login..."
              : "Redirecting in a moment..."}
          </p>
        </div>
      )}
    </div>
  );

  const renderPasswordScreen = () => (
    <>
      <div className="flex justify-end">
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-bold text-xl mb-2 text-white">
          Get Logged In!
        </h3>
        <p className="text-center text-gray-400 text-sm">
          Login using your mobile number or email address
        </p>
      </div>

      {/* {renderErrors()} */}
      {renderTabs()}

      {tab === "mobile" ? (
        <div className="mb-4">
          <label className="block font-medium text-sm text-white mb-1.5">
            Mobile Number*
          </label>
          <div className="flex rounded-lg overflow-hidden bg-white/10 border border-white/20 focus-within:border-[#c59d5f] transition-colors duration-300">
            <button
              className="px-3 bg-black/30 text-[#c59d5f] font-medium text-sm focus:outline-none border-r border-white/10"
              type="button">
              +{countryCode}
            </button>
            <input
              type="tel"
              className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
              placeholder="9977004451"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block font-medium text-sm text-white mb-1.5">
            Email Address*
          </label>
          <input
            type="email"
            className="w-full rounded-lg px-3 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <div className="mb-5">
        <label className="block font-medium text-sm text-white mb-1.5">
          Password*
        </label>
        <div className="flex items-center rounded-lg overflow-hidden bg-white/10 border border-white/20 focus-within:border-[#c59d5f] transition-colors duration-300">
          <input
            type={showPassword ? "text" : "password"}
            className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="px-3 py-2.5 bg-transparent text-gray-400 hover:text-white transition-colors duration-300"
            type="button"
            onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="text-right mt-2">
          <button
            className="text-[#c59d5f] hover:text-[#f4d03f] font-medium text-xs transition-colors duration-300"
            onClick={() => setScreen("forgot")}>
            Forgot Password?
          </button>
        </div>
      </div>

      <button
        className="w-full py-2.5 mb-4 rounded-lg font-medium text-sm text-black bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handlePasswordLogin}
        disabled={
          isLoading ||
          !password ||
          (!phoneNumber && tab === "mobile") ||
          (!email && tab === "email")
        }>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      <div className="flex items-center my-4">
        <span className="flex-1 h-px bg-white/10"></span>
        <span className="mx-3 text-gray-400 text-xs">Or</span>
        <span className="flex-1 h-px bg-white/10"></span>
      </div>

      <button
        className="w-full py-2.5 rounded-lg font-medium text-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
        onClick={() => setScreen("login")}>
        Sign up or login with Verification Code
      </button>
    </>
  );

  const renderForgotPasswordScreen = () => (
    <>
      <div className="flex justify-between items-center">
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={() => setScreen("password")}>
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-bold text-xl mb-2 text-white">
          Forgot Password
        </h3>
        <p className="text-center text-gray-400 text-sm">
          Please enter your registered email/mobile number to reset your
          password.
        </p>
      </div>

      {/* {renderErrors()} */}
      {renderTabs()}

      {tab === "mobile" ? (
        <div className="mb-5">
          <label className="block font-medium text-sm text-white mb-1.5">
            Mobile Number*
          </label>
          <div className="flex rounded-lg overflow-hidden bg-white/10 border border-white/20 focus-within:border-[#c59d5f] transition-colors duration-300">
            <button
              className="px-3 bg-black/30 text-[#c59d5f] font-medium text-sm focus:outline-none border-r border-white/10"
              type="button">
              +{countryCode}
            </button>
            <input
              type="tel"
              className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
              placeholder="9977004451"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <label className="block font-medium text-sm text-white mb-1.5">
            Email Address*
          </label>
          <input
            type="email"
            className="w-full rounded-lg px-3 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <button
        className="w-full py-2.5 mb-4 rounded-lg font-medium text-sm text-black bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleSendForgotPasswordOTP}
        disabled={
          isLoading ||
          (!phoneNumber && tab === "mobile") ||
          (!email && tab === "email")
        }>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Code"
        )}
      </button>
    </>
  );

  const renderResetPasswordScreen = () => (
    <>
      <div className="flex justify-between items-center">
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={() => setScreen("forgot")}>
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-bold text-xl mb-2 text-white">
          Set New Password
        </h3>
        <p className="text-center text-gray-400 text-sm">
          We&apos;ve sent a verification code to your{" "}
          <span className="text-[#c59d5f] font-medium">
            {forgotPasswordContact}
          </span>
        </p>
      </div>

      {/* {renderErrors()} */}

      <div className="space-y-4 mb-5">
        <div>
          <label className="block font-medium text-sm text-white mb-1.5">
            Verification Code*
          </label>
          <div className="relative">
            <Shield
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              className="w-full rounded-lg pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm text-center tracking-widest"
              placeholder="0000"
              maxLength={4}
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm text-white mb-1.5">
            New Password*
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
              type="button"
              onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm text-white mb-1.5">
            Confirm Password*
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full rounded-lg pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 focus:border-[#c59d5f] text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 text-sm"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}>
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <button
        className="w-full py-2.5 mb-4 rounded-lg font-medium text-sm text-black bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleResetPassword}
        disabled={
          isResettingPassword ||
          !resetOtp ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword ||
          resetOtp.length !== 4
        }>
        {isResettingPassword ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Changing Password...
          </>
        ) : (
          "Change Password"
        )}
      </button>

      <div className="text-center">
        <button
          className="text-[#c59d5f] hover:text-[#f4d03f] font-medium text-xs transition-colors duration-300 disabled:opacity-50"
          onClick={handleSendForgotPasswordOTP}
          disabled={isLoading}>
          {isLoading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md mx-auto animate-scaleIn">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[#c59d5f]/20 animate-gradientShift" />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-1 h-1 bg-[#c59d5f]/30 rounded-full animate-float1"
              style={{ top: "10%", left: "20%" }}
            />
            <div
              className="absolute w-2 h-2 bg-[#c59d5f]/20 rounded-full animate-float2"
              style={{ top: "70%", left: "80%" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-white/10 rounded-full animate-float3"
              style={{ top: "30%", left: "60%" }}
            />
          </div>

          {/* Modal content */}
          <div className="relative p-6 sm:p-8">
            {/* Show loading state when fetching profile */}
            {isLoadingProfile ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#c59d5f]" />
                <p className="text-white">Loading your profile...</p>
              </div>
            ) : (
              <>
                {screen === "login" && renderLoginScreen()}
                {/* password,otp,reset-password,forgot,login*/}
                {screen === "otp" && renderOTPScreen()}
                {screen === "signup" && renderSignupScreen()}
                {screen === "success" && renderSuccessScreen()}
                {screen === "password" && renderPasswordScreen()}
                {screen === "forgot" && renderForgotPasswordScreen()}
                {screen === "reset-password" && renderResetPasswordScreen()}
              </>
            )}
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c59d5f]/50 to-transparent" />
        </div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: translateY(20px) scale(0.98);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .animate-gradientShift {
          animation: gradientShift 8s ease infinite;
          background-size: 200% 200%;
        }

        .animate-float1 {
          animation: float1 4s ease-in-out infinite;
        }

        .animate-float2 {
          animation: float2 6s ease-in-out infinite;
        }

        .animate-float3 {
          animation: float3 5s ease-in-out infinite;
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-shrink {
          animation: shrink 3s linear forwards;
        }
      `}</style>
    </div>
  );
}
