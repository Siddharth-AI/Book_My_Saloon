/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type React from "react";
import { useEffect, useCallback, useRef } from "react";
import LeftPanel from "../../components/leftPanel/LeftPanel";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearCartAfterSuccessfulBooking } from "../../store/slices/cartSlice";
import { FiArrowLeft } from "react-icons/fi";
import {
  createBooking,
  clearBookingError,
  type BookingService,
} from "../../store/slices/bookingSlice";
import {
  setBookingComment,
  resetBookingComment,
  setSelectedSlot,
  setSelectedDate,
} from "../../store/slices/uiSlice";
import { openModal } from "../../store/slices/modalSlice";
import BookingBottomBar from "../BookingBottomBar";
import { toastError } from "@/app/components/common/toastService";

const Page = () => {
  const { user, tempToken } = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart.items);
  const { selectedDate, selectedSlot, bookingComment } = useAppSelector(
    (state) => state.ui
  );
  const servicesState = useAppSelector((state) => state.services);
  const bookingState = useAppSelector((state) => state.booking);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const hasHandledBookingSuccess = useRef(false);

  useEffect(() => {
    if (cart.length > 0) {
      const firstItem = cart[0];
      // If the UI has no selected slot, but the cart does, restore it.
      if (!selectedSlot && firstItem?.timeSlot) {
        console.log("Restoring selectedSlot from cart:", firstItem.timeSlot);
        dispatch(setSelectedSlot(firstItem.timeSlot));
      }
      // Also ensure the date is synchronized
      if (firstItem?.selectedDate) {
        const dateInState = new Date(selectedDate).toDateString();
        const dateInCart = new Date(firstItem.selectedDate).toDateString();
        if (dateInState !== dateInCart) {
          console.log(
            "Restoring selectedDate from cart:",
            firstItem.selectedDate
          );
          dispatch(setSelectedDate(firstItem.selectedDate));
        }
      }
    }
  }, [cart, selectedSlot, selectedDate, dispatch]);

  useEffect(() => {
    if (
      bookingState.bookingId &&
      !bookingState.loading &&
      !hasHandledBookingSuccess.current
    ) {
      hasHandledBookingSuccess.current = true;

      // Save cart to localStorage before clearing
      try {
        if (bookingState.bookingId) {
          localStorage.setItem(`booking-services`, JSON.stringify(cart));
        }
      } catch (error) {
        console.log("Error saving booking services:", error);
        toastError("Couldn't save your booking details");
      }

      // Clear cart and comment after successful booking
      dispatch(clearCartAfterSuccessfulBooking());
      dispatch(resetBookingComment());

      // Navigate to confirmation page with a delay to ensure state updates complete
      router.push(`/services/thank-you?bookingId=${bookingState.bookingId}`);
    }
  }, [bookingState.bookingId, bookingState.loading, cart, dispatch, router]);

  // Add this useEffect to reset the ref when component unmounts or booking starts
  useEffect(() => {
    if (bookingState.loading) {
      hasHandledBookingSuccess.current = false;
    }
  }, [bookingState.loading]);

  // The function returned by useEffect is a "cleanup" function.
  useEffect(() => {
    // It runs when this component unmounts (e.g., when you go to another page).
    return () => {
      dispatch(clearBookingError());
    };
  }, [dispatch]);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleAccept = () => {
    setAccepted(true);
    setShowModal(false);
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccepted(e.target.checked);
  };

  // Handle comment change and save to Redux
  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(setBookingComment(e.target.value));
    },
    [dispatch]
  );

  // Helper function to convert time slot to minutes
  const timeSlotToMinutes = (timeSlot: string): number => {
    const [time, period] = timeSlot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + (minutes || 0);

    if (period === "PM" && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period === "AM" && hours === 12) {
      totalMinutes = minutes || 0;
    }

    return totalMinutes;
  };

  // Helper function to format date for API
  const formatDateForAPI = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleConfirmation = async () => {
    if (!accepted) {
      toastError("Please accept the terms and conditions to proceed.");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      toastError("Please select a date and time slot.");
      return;
    }

    if (cart.length === 0) {
      toastError("Your cart is empty. Please add services before booking.");
      return;
    }

    console.log(cart, "cart=>>>>>>>>>>>>>>data when i booking");

    if (!servicesState.selectedLocationUuid) {
      toastError("Location information is missing. Please try again.");
      return;
    }

    if (!tempToken && !user) {
      toastError("You must be logged in to book an appointment.");
      dispatch(openModal("login"));
      return;
    }

    try {
      // 1. Set the starting point for the very first service
      let nextAvailableTimeInMinutes = timeSlotToMinutes(selectedSlot);
      // Prepare services data for API
      // const services: BookingService[] = cart.map((item: any) => {
      //   console.log(cart, "my timeslot=>>>>>>>>>>>>>>>>>>>>>>>>>");
      //   console.log(cart.timeSlot, "my timeslot=>>>>>>>>>>>>>>>>>>>>>>>>>");
      //   console.log(selectedSlot, "selectedslot=>>>>>>>>>>>>>>>>>>>>>>>>>");
      //   const startTime = timeSlotToMinutes(selectedSlot);
      //   const endTime = startTime + (item.duration || 30);

      //   return {
      //     service_id: item.id,
      //     service_name: item.name,
      //     start_time: startTime,
      //     end_time: endTime,
      //   };
      // });

      // 2. Map over the cart to create services with chained times
      const services: BookingService[] = cart.map((item: any) => {
        const startTime = nextAvailableTimeInMinutes;
        const endTime = startTime + (item.duration || 30);

        // 3. IMPORTANT: Update the starting time for the *next* service in the loop
        nextAvailableTimeInMinutes = endTime;

        return {
          service_id: item.id,
          service_name: item.name,
          start_time: startTime,
          end_time: endTime,
        };
      });

      // Calculate total
      const serviceTotal = cart.reduce(
        (acc: number, cur: any) => acc + (cur.price || 0),
        0
      );
      const tax = 19.07;
      const total = serviceTotal + tax;

      // Prepare booking payload with comment from Redux state
      const bookingPayload = {
        vendor_location_uuid: servicesState.selectedLocationUuid,
        booking_date: formatDateForAPI(selectedDate),
        booking_comment: bookingComment || "", // Use comment from Redux state
        booking_status: "tentative",
        merge_services_of_same_staff: true,
        total: Math.round(total * 100) / 100,
        services,
      };

      console.log("Creating booking with payload:", bookingPayload);

      // Dispatch the booking creation
      const result = await dispatch(createBooking(bookingPayload));
      console.log(result, "result from create booking");

      if (createBooking.rejected.match(result)) {
        // The error message is in result.payload
        const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : "An unknown booking error occurred.";

        // toastError(errorMessage);
        toastError("Booking failed: Time slot is unavailable.");
        console.log("Booking failed:", errorMessage);
      }
      if (bookingState.error) {
        toastError("Booking failed: Time slot is unavailable.");
        // toastError(
        //   "The selected time slot may have just become unavailable. Please try selecting a different slot or time."
        // );
        console.log("Booking error:", bookingState.error);
      }
      if (createBooking.rejected.match(result)) {
        console.log(`Booking failed: ${result.payload}`);
      }
    } catch (error) {
      console.log("Booking error in catch block", error);
      toastError(
        "We've run into a temporary glitch. Please refresh the page and try again."
      );
    }
  };

  const serviceTotal = cart.reduce(
    (acc: number, cur: any) => acc + (cur.price || 0),
    0
  );
  const tax = 19.07;
  const totalPayable = serviceTotal + tax;

  return (
    <div className="min-h-screen bg-white/10">
      <div
        className="w-full bg-[#2d2d2d] py-24 lg:py-32 pl-11 relative"
        style={{
          backgroundImage: "url('/images/service/viewBooking.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom 10px",
          backgroundAttachment: "fixed",
          zIndex: 0,
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl pt-10 font-bold tracking-wide text-white drop-shadow-lg">
            Appointment Booking
          </h1>
        </div>
      </div>

      <div className="px-4bg-white/10 py-5">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* Left Panel */}
          <div className="w-full lg:w-[800px] relative">
            <div
              className="bg-gradient-to-br from-[#232526]/80 via-[#414345]/90 to-[#c59d5f]/10 p-6 shadow relative rounded-2xl border border-white/10 hover:text-[#c59d5f] text-white transition-colors duration-200 group mb-4 py-2 hover:shadow-2xl hover:shadow-[#c59d5f]/10"
              onClick={() => router.back()}>
              <button
                className="rounded-2xl flex items-center gap-2"
                aria-label="Go back to previous page">
                <FiArrowLeft className="w-7 h-7 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="font-semibold text-xl pr-1 ">Back</span>
              </button>
            </div>
            <LeftPanel />
          </div>

          {/* Right Panel */}
          <div className="w-full bg-gradient-to-br from-[#232526]/80 via-[#414345]/90 to-[#c59d5f]/10 p-6 shadow relative rounded-2xl border border-white/10">
            {/* Error Display */}
            {/* {bookingState.error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex justify-between items-center animate-fadeIn">
                <div>
                  <p className="font-semibold">Booking Failed</p>
                  <p className="text-sm">
                    The selected time slot may have just become unavailable.
                    Please try selecting a different slot or time.
                  </p>
                </div>
                <button
                  onClick={() => dispatch(clearBookingError())}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close error message">
                  <FiX size={20} />
                </button>
              </div>
            )} */}

            {/* Main Card */}
            <div className="rounded-2xl p-6 border shadow-sm bg-white/10 mb-4 border-white/20">
              <h4 className="text-xl font-bold mb-4 text-[#c59d5f]">
                Add Instruction
              </h4>
              <div className="mb-6">
                <textarea
                  value={bookingComment}
                  onChange={handleCommentChange}
                  className="w-full p-4 border bg-white/10 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Write something..."
                  rows={4}
                />
              </div>

              <h4 className="text-xl font-bold mb-4 text-[#c59d5f]">
                Pricing Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Service Total</span>
                  <span className="font-bold text-white">
                    ₹ {serviceTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Tax</span>
                  <span className="font-bold text-white">
                    ₹ {tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-lg text-[#c59d5f]">
                    Total Payable
                  </span>
                  <span className="font-bold text-lg text-white">
                    ₹ {totalPayable.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Policy and Button Card */}
            <div className="bg-white/10 rounded-2xl p-6 border shadow-sm border-white/20 hidden md:block">
              <div className="flex items-start space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="policyCheck"
                  checked={accepted}
                  onChange={handleCheckbox}
                  className="mt-1 w-4 h-4 text-[#c59d5f] border-gray-300 rounded focus:ring-[#c59d5f]"
                />
                <label htmlFor="policyCheck" className="text-sm text-gray-300">
                  <button
                    onClick={handleOpenModal}
                    className="text-[#c59d5f] hover:underline transition-colors">
                    Read and accept all policies
                  </button>
                </label>
              </div>

              <button
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all relative ${
                  accepted && !bookingState.loading
                    ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black rounded-xl font-bold shadow hover:scale-101 hover:shadow-[#c59d5f]/40 transition-all duration-200"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                }`}
                disabled={!accepted || bookingState.loading}
                onClick={handleConfirmation}>
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
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                <div className="p-6 pb-3 border-b">
                  <h5 className="text-xl font-bold">Terms and Conditions</h5>
                </div>

                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-4 text-gray-700">
                    <p>
                      <strong>1. Booking Policy:</strong> All appointments are
                      subject to availability and confirmation.
                    </p>
                    <p>
                      <strong>2. Cancellation:</strong> Cancellations must be
                      made at least 24 hours in advance.
                    </p>
                    <p>
                      <strong>3. Payment:</strong> Payment is required at the
                      time of service.
                    </p>
                    <p>
                      <strong>4. Late Arrival:</strong> Please arrive 10 minutes
                      before your appointment time.
                    </p>
                    <p>
                      <strong>5. Health & Safety:</strong> Please inform us of
                      any allergies or health conditions.
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                  <button
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button
                    className="bg-[#c59d5f] hover:bg-[#b8914f] text-white font-semibold px-6 py-2 rounded-lg transition-colors min-w-[100px]"
                    onClick={handleAccept}>
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <BookingBottomBar
        accepted={accepted}
        handleCheckboxChange={() => setAccepted(!accepted)}
        handleOpenPolicyModal={() => setShowModal(true)}
        handleBookAppointment={handleConfirmation}
      />
    </div>
  );
};

export default Page;
