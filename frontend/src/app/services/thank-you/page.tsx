"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { clearBookingData } from "../../store/slices/bookingSlice";
import AuthGuard from "@/app/components/auth/AuthGuard";
import { Calendar, Copy, Home, User } from "lucide-react";
import { toastInfo } from "@/app/components/common/toastService";

/* eslint-disable @typescript-eslint/no-explicit-any */

const AppointmentConfirmationContent = () => {
  // --- ALL YOUR ORIGINAL LOGIC IS PRESERVED ---
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { selectedDate, selectedSlot } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const { selectedLocationByName } = useAppSelector((state) => state.services);

  const formatDisplayDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const month = dateObj.toLocaleDateString("en-US", { month: "short" });
    const dayNum = dateObj.getDate();
    const year = dateObj.getFullYear();
    return { day, month, dayNum, year };
  };

  const handleCopy = () => {
    if (bookingId) {
      toastInfo("Booking ID copied to clipboard!");
      navigator.clipboard.writeText(bookingId);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("User not found, cannot retrieve cart.");
      return;
    }
    const storedCart = localStorage.getItem(`booking-services`);
    if (storedCart) {
      setCart(() => {
        const parsedCart = JSON.parse(storedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
      });
      dispatch(clearBookingData());
      localStorage.removeItem("booking-services");
    }
  }, [bookingId, dispatch, user]);

  const dateInfo = selectedDate ? formatDisplayDate(selectedDate) : null;

  const handleAddToCalendar = () => {
    if (!selectedDate || !selectedSlot || cart.length === 0) {
      alert("Missing appointment details");
      return;
    }
    const dateObj =
      typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate;
    const title = `Appointment at The Belle Femme Salon`;
    const details = `Services: ${cart
      .map((item: { name: any }) => item.name)
      .join(", ")}`;
    const location = selectedLocationByName || "";
    const startDate = dateObj.toISOString().split("T")[0].replace(/-/g, "");
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate}T100000/${startDate}T120000&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}`;
    window.open(calendarUrl, "_blank");
  };

  // --- NEW BEAUTIFUL UI BEGINS HERE ---
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div
          className="w-full h-full bg-cover bg-center animate-kenburns"
          style={{ backgroundImage: "url('/images/service/thankyou.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 mt-24 my-16 mx-4 w-full max-w-lg lg:max-w-2xl">
        <div className="bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 md:p-10 border border-white/10">
          <div className="flex flex-col items-center text-center">
            {/* Headings */}
            <p className="text-green-400 font-bold text-base tracking-wider mb-2 animate-fadeInUp animation-delay-100">
              HURRAY! YOUR BOOKING IS CONFIRMED
            </p>
            <h1
              className="pb-2 text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3 animate-fadeInUp animation-delay-200"
              style={{ textWrap: "balance" }}>
              See you soon!
            </h1>
            <p className="text-center text-gray-400 text-base md:text-lg mb-8 animate-fadeInUp animation-delay-300">
              Thank you for making an appointment with us.
            </p>
          </div>

          {/* Booking ID */}
          {bookingId && (
            <div className="mb-6 p-4 bg-black/50 rounded-lg border border-white/10 animate-fadeInUp animation-delay-400">
              <p className="text-sm text-gray-400 mb-1 text-center">
                Booking ID
              </p>
              <div className="flex justify-between items-center">
                <p className="font-mono text-[#c59d5f] font-semibold text-lg tracking-widest">
                  {bookingId}
                </p>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md hover:bg-white/10 transition-colors">
                  <Copy size={20} className="text-gray-300" />
                </button>
              </div>
            </div>
          )}

          {/* Appointment Details Card */}
          <div className="bg-black/50 rounded-xl border border-white/10 p-4 md:p-6 mb-8 animate-fadeInUp animation-delay-500">
            <h2 className="font-bold text-white text-lg mb-4 text-center">
              Your Appointment Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-400 font-semibold mb-1">
                  Salon
                </span>
                <div className="font-semibold text-white text-base">
                  The Belle Femme
                </div>
                <div className="text-gray-400 text-sm mt-0.5">
                  {selectedLocationByName || "NYC"}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-400 font-semibold mb-1">
                  Services
                </span>
                {cart.length > 0 ? (
                  <>
                    <p className="font-semibold text-white">{cart[0].name}</p>
                    {cart.length > 1 && (
                      <p className="text-sm text-gray-300">
                        {" "}
                        + {cart.length - 1} more
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-semibold text-white">-</p>
                )}
              </div>
            </div>
            {dateInfo && selectedSlot && (
              <div className="text-gray-300 text-sm flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <Calendar size={16} className="text-[#c59d5f] shrink-0" />
                <span>
                  {dateInfo.day}, {dateInfo.month} {dateInfo.dayNum},{" "}
                  {dateInfo.year} at {selectedSlot}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 animate-fadeInUp animation-delay-600">
            <button
              onClick={handleAddToCalendar}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-bold text-lg py-3.5 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-[#c59d5f]/40">
              Add To My Calendar
            </button>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-3.5 rounded-lg border border-white/20 bg-white/10 text-white font-bold text-base hover:bg-white/20 hover:text-[#c59d5f] transition-all duration-300 flex items-center justify-center gap-2">
                <Home size={20} />
                Go To Home
              </button>
              <button
                onClick={() => router.push("/settings/appointments/upcoming")}
                className="flex-1 py-3.5 rounded-lg border border-white/20 bg-white/10 text-white font-bold text-base hover:bg-white/20 hover:text-[#c59d5f] transition-all duration-300 flex items-center justify-center gap-2">
                <User size={20} />
                My Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Adding custom keyframes for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes kenburns {
          0% {
            transform: scale(1.1) translate(0, 0);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-kenburns {
          animation: kenburns 15s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

// The main page component that uses Suspense
export default function ThankYouPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<LoadingSpinner />}>
        <AppointmentConfirmationContent />
      </Suspense>
    </AuthGuard>
  );
}

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#c59d5f] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400">Loading Confirmation...</p>
    </div>
  </div>
);
