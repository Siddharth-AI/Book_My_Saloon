/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  setCart,
  saveCartToStorage,
  clearBookingDetailsFromCart,
} from "../../store/slices/cartSlice";
import {
  setSelectedDate,
  setSelectedOperator,
  setSelectedSlot,
} from "../../store/slices/uiSlice";
import { filterOperatorsByServices } from "../../store/slices/operatorsSlice";
import {
  fetchTimeSlots,
  resetTimeSlotsError,
} from "../../store/slices/timeSlotsSlice";
import LeftPanel from "../../components/leftPanel/LeftPanel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookingBottomBar from "../BookingBottomBar";
import { toastError, toastWarning } from "../../components/common/toastService"; // Ensure toastWarning is imported

const jsDayToName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// --- Helper Functions (unchanged) ---
function isSameDate(d1: Date, d2: Date) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSlotInPast(slotMinutes: number, selectedDate: string): boolean {
  const now = new Date();
  const selectedDateObj = new Date(selectedDate);

  if (!isSameDate(now, selectedDateObj)) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes < currentMinutes;
}

const parseTimeStringToDate = (timeString: string, baseDate: Date): Date => {
  const time = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!time) return baseDate;

  let hours = parseInt(time[1], 10);
  const minutes = parseInt(time[2], 10);
  const ampm = time[3].toUpperCase();

  if (ampm === "PM" && hours < 12) {
    hours += 12;
  }
  if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTimeFromDate = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const Slots: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);
  const operatorsState = useAppSelector((state) => state.operators);
  const timeSlotsState = useAppSelector((state) => state.timeSlots);
  const servicesState = useAppSelector((state) => state.services);
  const { selectedDate, selectedOperator, selectedSlot } = useAppSelector(
    (state) => state.ui
  );
  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const selectedDateObj = new Date(selectedDate);

  // Watch for errors when fetching operators
  useEffect(() => {
    if (operatorsState.error) {
      toastError("Could not load operators. Please refresh the page.");
      // Optional: dispatch an action to clear the error from the Redux store
      dispatch(resetTimeSlotsError());
    }
  }, [operatorsState.error]);

  // Watch for errors when fetching time slots
  useEffect(() => {
    if (timeSlotsState.error) {
      toastError(
        "Could not load time slots. Please try selecting another date."
      );
      // Optional: dispatch an action to clear the error from the Redux store
      dispatch(resetTimeSlotsError());
    }
  }, [timeSlotsState.error]);

  const displayOperators = useMemo(
    () => [
      {
        id: -1,
        name: "No Preference",
        img: "/images/user.png",
      },
      ...operatorsState.filteredOperators.map((op: any) => ({
        id: op.id,
        name: op.display_name || op.name,
        img: op.staff_img || "/images/user.png",
      })),
    ],
    [operatorsState.filteredOperators]
  );

  // NEW: Watch for the specific case where no single operator is available
  useEffect(() => {
    if (displayOperators.length === 1 && cart.length > 1) {
      toastWarning(
        "Heads up: No single operator provides all selected services."
      );
    }
  }, [displayOperators, cart]);

  const hasValidImageExtension = (url: string): boolean => {
    return /\.(jpg|jpeg|png|gif|svg)$/i.test(url);
  };

  useEffect(() => {
    if (operatorsState.operators.length > 0) {
      const cartServiceIds = cart.map((item: any) => item.id);
      dispatch(filterOperatorsByServices(cartServiceIds));
    }
  }, [dispatch, cart, operatorsState.operators]);

  // useEffect(() => {
  //   // This function's "return" is a cleanup function.
  //   // It runs automatically whenever you navigate away from this page.
  //   return () => {
  //     if (!isProceeding) {
  //       // <-- ADD THIS CONDITION
  //       dispatch(resetBookingFlow()); // Resets operator and slot
  //       dispatch(clearBookingDetailsFromCart()); // Removes details from cart items
  //     }
  //   };
  // }, [dispatch, isProceeding]);

  useEffect(() => {
    if (servicesState.selectedLocationUuid && selectedDate) {
      const dateString = formatDateForAPI(selectedDateObj);
      const serviceIds = cart.map((item: any) => item.id);
      dispatch(
        fetchTimeSlots({
          locationUuid: servicesState.selectedLocationUuid,
          startDate: dateString,
          endDate: dateString,
          serviceIds,
        })
      );
    }
  }, [dispatch, servicesState.selectedLocationUuid, selectedDate, cart]);

  const processedSlots = useMemo(() => {
    const selectedDateString = formatDateForAPI(selectedDateObj);
    const slotsForSelectedDate = timeSlotsState.slots.filter(
      (slot: any) => slot.date === selectedDateString
    );
    const filteredSlots = slotsForSelectedDate.filter((slot: any) => {
      if (!slot.available) return true;
      if (isSameDate(now, selectedDateObj)) {
        return !isSlotInPast(slot.start_time, selectedDate);
      }
      return true;
    });
    return {
      morning: filteredSlots.filter((slot: any) => slot.period === "morning"),
      afternoon: filteredSlots.filter(
        (slot: any) => slot.period === "afternoon"
      ),
      evening: filteredSlots.filter((slot: any) => slot.period === "evening"),
    };
  }, [timeSlotsState.slots, selectedDate, selectedDateObj, now]);

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const datesArray = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(currentYear, currentMonthIndex, i + 1)
  );

  useEffect(() => {
    dispatch(setSelectedSlot(""));
    dispatch(clearBookingDetailsFromCart());
  }, [dispatch, selectedOperator, selectedDate, currentMonthIndex]);

  // --- NEW: A single handler for when a user clicks a time slot ---
  const handleSlotSelection = (slotTime: string) => {
    // 1. Set the selected slot in the UI (to highlight the button)
    dispatch(setSelectedSlot(slotTime));

    // 2. Immediately calculate the sequential times for the cart
    const operatorName =
      displayOperators[selectedOperator]?.name || "No Preference";
    const currentStartTime = parseTimeStringToDate(slotTime, selectedDateObj);

    const updatedCart = cart.map((item: any) => {
      const itemTimeSlot = formatTimeFromDate(currentStartTime);
      // Assumes each 'item' in the cart has a 'time' property in minutes.
      const durationInMinutes = item.duration || 0;

      const updatedItem = {
        ...item,
        operator: operatorName,
        selectedDate: selectedDateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        selectedDay: selectedDateObj.toLocaleDateString("en-US", {
          weekday: "long",
        }),
        timeSlot: itemTimeSlot,
      };

      currentStartTime.setMinutes(
        currentStartTime.getMinutes() + durationInMinutes
      );

      return updatedItem;
    });

    // 3. Update the cart in the Redux store with the newly calculated times
    dispatch(setCart(updatedCart));
  };

  function handleSlotBook() {
    // This function is now simpler. The cart is already updated.
    // It just needs to save and navigate.
    dispatch(saveCartToStorage());
    router.push("/services/view");
  }

  const handleContinueClick = () => {
    // Check if an operator is selected. "No Preference" is at index 0, so any selection is valid.
    // Assuming initial state for selectedOperator is null or undefined.
    const isOperatorSelected =
      selectedOperator !== null && selectedOperator !== undefined;

    if (!isOperatorSelected || !selectedSlot) {
      // Build a specific error message
      let errorMessage = "Please select";
      if (!isOperatorSelected && !selectedSlot) {
        errorMessage += " an operator and a time slot.";
      } else if (!isOperatorSelected) {
        errorMessage += " an operator.";
      } else {
        errorMessage += " a time slot.";
      }
      toastError(errorMessage); // Use the toast service!
      return; // Stop the function here
    }

    // If validation passes, call the original booking function
    handleSlotBook();
  };

  function renderSlotSection(title: string, slots: any[], isLoading: boolean) {
    return (
      <div className="mb-4">
        <h4 className="text-center font-bold mb-3 text-white">
          {title}
          {!isLoading && (
            <span className="text-xs font-normal ml-2 text-gray-400">
              ({slots.filter((s) => s.available).length} available)
            </span>
          )}
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {isLoading && slots.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#c59d5f]/30 border-t-[#c59d5f]"></div>
              <span className="ml-2 text-gray-400">Loading slots...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="col-span-full text-center italic text-gray-400 py-4">
              No slots available for this time period.
            </div>
          ) : (
            slots.map((slot) => {
              const isPastSlot =
                isSlotInPast(slot.start_time, selectedDate) &&
                isSameDate(now, selectedDateObj);
              const isDisabled = !slot.available || isPastSlot;
              return (
                <button
                  key={`${slot.start_time}-${slot.end_time}`}
                  className={`rounded-lg px-2 py-1.5 border text-center cursor-pointer transition-all duration-200 text-sm ${
                    isDisabled
                      ? "bg-gray-700/50 text-gray-500 border-gray-700 cursor-not-allowed"
                      : selectedSlot === slot.start_time_formatted
                      ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black border-[#c59d5f] font-bold shadow-md"
                      : "bg-white/5 text-white border-white/20 hover:border-[#c59d5f]/50 hover:bg-white/10"
                  }`}
                  // --- MODIFIED: onClick now calls our new handler ---
                  onClick={() =>
                    !isDisabled &&
                    handleSlotSelection(slot.start_time_formatted)
                  }
                  disabled={isDisabled}
                  title={
                    isPastSlot
                      ? "Time has passed"
                      : !slot.available
                      ? "Not available"
                      : `Available: ${slot.start_time_formatted}`
                  }>
                  {slot.start_time_formatted}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ... The rest of your JSX return statement remains unchanged ...
  return (
    <div className="min-h-screen bg-white/10">
      <div
        className="w-full bg-[#2d2d2d] py-28 pl-11 pt-32 relative"
        style={{
          backgroundImage: "url('/images/service/slotbooking.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: 0,
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl pt-10 font-bold tracking-wide text-white drop-shadow-lg">
            SELECT A TIME & OPERATOR
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[400px]">
            <LeftPanel />
          </div>

          <div className="w-full lg:w-2/3 xl:w-3/4 min-w-0">
            <div
              className="bg-gradient-to-br from-[#232526]/80 via-[#414345]/90 to-[#c59d5f]/10 p-4 sm:p-6 shadow-xl flex flex-col gap-4 rounded-2xl border border-white/10"
              style={{ backdropFilter: "blur(12px)" }}>
              <div className="bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 rounded-lg px-4 py-3 shadow font-semibold text-lg text-white border border-white/10">
                Choose Your Operator
                {cart.length > 0 && (
                  <span className="block sm:inline text-sm font-normal sm:ml-2 text-gray-300">
                    (Showing operators for all selected services)
                  </span>
                )}
              </div>
              {operatorsState.loading ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c59d5f]/30 border-t-[#c59d5f]"></div>
                  <span className="ml-3 text-white">Loading operators...</span>
                </div>
              ) : (
                //  operatorsState.error ? (
                //   <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                //     Error loading operators: {operatorsState.error}
                //   </div>
                // ) :
                <>
                  {displayOperators.length === 1 && cart.length > 0 && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-yellow-300 text-sm">
                      No single operator provides all selected services. Please
                      modify your cart or choose &quot;No Preference&quot;.
                    </div>
                  )}
                  <div className="flex flex-nowrap gap-4 overflow-x-auto pb-3 -mx-4 px-4">
                    {displayOperators.map((op, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-start text-center cursor-pointer p-2 transition-all duration-200 rounded-lg flex-shrink-0 w-24
                                ${
                                  selectedOperator === idx
                                    ? "border-[#c59d5f] bg-gradient-to-b from-[#c59d5f]/20 to-transparent"
                                    : "border-transparent"
                                } border-2`}
                        onClick={() => dispatch(setSelectedOperator(idx))}
                        title={op.name}>
                        <Image
                          width={56}
                          height={56}
                          src={
                            op.img && hasValidImageExtension(op.img)
                              ? op.img
                              : "/images/user.png"
                          }
                          alt={op.name}
                          className="rounded-full object-cover w-14 h-14 mb-2 border-2 border-white/20"
                        />
                        <div className="text-xs text-white w-full truncate">
                          {op.name}
                        </div>
                        {op.id === -1 && (
                          <div className="text-[10px] text-gray-400">
                            Any available
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 rounded-lg px-4 py-3 shadow font-semibold text-lg text-white border border-white/10 flex justify-between items-center">
                <div>Choose Your Appointment</div>
                <select
                  className="bg-[#232526]/80 text-[#c59d5f] font-bold outline-none rounded-md px-2 py-1 border border-white/20 text-sm"
                  value={`${currentMonthIndex}-${currentYear}`}
                  onChange={(e) => {
                    const [month, year] = e.target.value.split("-").map(Number);
                    setCurrentMonthIndex(month);
                    setCurrentYear(year);
                  }}>
                  {Array.from({ length: 3 }, (_, i) => {
                    const date = new Date(
                      now.getFullYear(),
                      now.getMonth() + i
                    );
                    const monthIndex = date.getMonth();
                    const year = date.getFullYear();
                    return (
                      <option
                        key={`${monthIndex}-${year}`}
                        value={`${monthIndex}-${year}`}>
                        {`${date.toLocaleString("default", {
                          month: "long",
                        })} ${year}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-3 -mx-4 px-4 operator_scroll">
                {datesArray.map((dateObj) => {
                  if (
                    currentMonthIndex === now.getMonth() &&
                    currentYear === now.getFullYear() &&
                    dateObj <
                      new Date(now.getFullYear(), now.getMonth(), now.getDate())
                  ) {
                    return null;
                  }
                  return (
                    <button
                      key={dateObj.toDateString()}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border w-14 flex-shrink-0 transition-all duration-200
                              ${
                                isSameDate(dateObj, selectedDateObj)
                                  ? "bg-gradient-to-b from-[#c59d5f] to-[#f4d03f]/80 text-black border-[#c59d5f] font-bold"
                                  : "bg-white/5 text-white border-white/20 hover:border-[#c59d5f]/50"
                              }`}
                      onClick={() =>
                        dispatch(setSelectedDate(dateObj.toISOString()))
                      }>
                      <span className="text-xs">
                        {jsDayToName[dateObj.getDay()]}
                      </span>
                      <span className="font-bold text-lg">
                        {dateObj.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="font-semibold text-[#c59d5f] text-center md:text-left">
                {selectedDateObj.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  weekday: "long",
                })}
                {isSameDate(now, selectedDateObj) && (
                  <span className="text-xs ml-2 text-yellow-400">(Today)</span>
                )}
              </div>

              {timeSlotsState.error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                  Error loading time slots: {timeSlotsState.error}
                </div>
              )}

              {renderSlotSection(
                "Morning",
                processedSlots.morning,
                timeSlotsState.loading
              )}
              {renderSlotSection(
                "Afternoon",
                processedSlots.afternoon,
                timeSlotsState.loading
              )}
              {renderSlotSection(
                "Evening",
                processedSlots.evening,
                timeSlotsState.loading
              )}

              <div className="hidden md:block mt-4">
                <div className="flex justify-between items-center bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 px-4 py-2 rounded-lg font-semibold border border-white/10">
                  <div className="text-white">{cart.length} services</div>
                  <div className="text-[#c59d5f]">
                    ₹
                    {cart
                      .reduce(
                        (acc: number, curr: any) => acc + (curr.price || 0),
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
                <button
                  className={`w-full mt-4 py-3 rounded-xl font-bold text-lg transition ${
                    cart.length > 0
                      ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black hover:scale-105"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={cart.length === 0}
                  onClick={handleContinueClick}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden sticky bottom-0">
        <BookingBottomBar />
      </div>
    </div>
  );
};

export default Slots;
