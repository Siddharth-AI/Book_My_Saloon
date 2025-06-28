/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { removeFromCart } from "../store/slices/cartSlice";
import { useRouter, usePathname } from "next/navigation";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import ClientOnly from "../components/common/ClientOnly";

// Define props for the component, especially for the 'view' page functionality
interface BookingBottomBarProps {
  accepted?: boolean;
  handleCheckboxChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenPolicyModal?: () => void;
  handleBookAppointment?: () => void;
}

// --- MAIN COMPONENT ---
const BookingBottomBar: React.FC<BookingBottomBarProps> = ({
  accepted,
  handleCheckboxChange,
  handleOpenPolicyModal,
  handleBookAppointment,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Redux state
  const cart = useAppSelector((state) => state.cart.items);
  const bookingState = useAppSelector((state) => state.booking);
  const { selectedDate, selectedSlot } = useAppSelector((state) => state.ui);

  // Local state for the dropdown view
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine which page view to render based on the URL
  const pageType = pathname.endsWith("/view")
    ? "view"
    : pathname.endsWith("/slots")
    ? "slots"
    : "services";

  // Don't render the bar if the cart is empty, except on the final 'view' page
  if (cart.length === 0 && pageType !== "view") {
    return null;
  }

  // --- RENDER FUNCTIONS FOR EACH PAGE TYPE ---

  const renderServicesContent = () => (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold text-white">
          {cart.length} {cart.length === 1 ? "Service" : "Services"} Added
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/services/slots")}
            className="px-6 py-2 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all">
            Continue
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 border-t-2 border-white/10 pt-4 max-h-60 overflow-y-auto">
          <ClientOnly
            fallback={<div className="text-gray-400">Loading...</div>}>
            {cart.map((item: any, index: number) => (
              <div
                key={`${item.id}-${index}`}
                className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                <div>
                  <p className="text-white font-semibold">{item.name}</p>
                  <p className="text-gray-400 text-sm">{item.duration} min</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-white">
                    ₹{item.price?.toFixed(2)}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(index))}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </ClientOnly>
        </div>
      )}
    </>
  );

  const renderSlotsContent = () => (
    <div className="flex justify-between items-center">
      <div className="font-bold text-white">
        {cart.length} {cart.length === 1 ? "Service" : "Services"} Selected
      </div>
      <button
        onClick={() => router.push("/services/view")}
        disabled={!selectedDate || !selectedSlot}
        className="px-6 py-2 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#c59d5f]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        Continue
      </button>
    </div>
  );

  const renderViewContent = () => (
    <div>
      <div className="flex items-start space-x-3 mb-4">
        <input
          type="checkbox"
          id="policyCheck"
          checked={accepted}
          onChange={handleCheckboxChange}
          className="mt-1 w-4 h-4 accent-[#c59d5f] bg-gray-700 border-gray-600 rounded focus:ring-[#c59d5f]"
        />
        <label htmlFor="policyCheck" className="text-sm text-gray-300">
          I have read and accept{" "}
          <button
            onClick={handleOpenPolicyModal}
            className="text-[#c59d5f] hover:underline transition-colors font-semibold">
            all policies
          </button>
          .
        </label>
      </div>
      <button
        className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
          accepted && !bookingState.loading
            ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black shadow-lg hover:shadow-[#c59d5f]/40"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
        disabled={!accepted || bookingState.loading}
        onClick={handleBookAppointment}>
        {bookingState.loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black mr-2"></div>
            Creating Booking...
          </div>
        ) : (
          "Book Appointment"
        )}
      </button>
    </div>
  );

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full p-2 sm:p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-30 md:hidden">
      <div className="max-w-3xl mx-auto bg-[#1c1c22] border-2 border-white/10 rounded-2xl shadow-2xl p-4 transition-all duration-300">
        {pageType === "services" && renderServicesContent()}
        {pageType === "slots" && renderSlotsContent()}
        {pageType === "view" && renderViewContent()}
      </div>
    </div>
  );
};

export default BookingBottomBar;
