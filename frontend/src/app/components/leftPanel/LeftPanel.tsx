/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { removeFromCart } from "../../store/slices/cartSlice";
import { useRouter } from "next/navigation";
import ClientOnly from "../common/ClientOnly";

interface LeftPanelProps {
  content?: string;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ content }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);
  // Note: We no longer need to read the general UI state for the slot in this component
  const { selectedDate } = useAppSelector((state) => state.ui);

  const dateObj =
    typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate;

  return (
    <div
      className={`${
        content === "summary"
          ? "gap-3"
          : "shadow md:rounded-2xl gap-2 md:gap-6 md:p-6 bg-gradient-to-br from-[#232526]/80  via-[#414345]/90 to-[#c59d5f]/10 border border-white/10"
      } flex flex-col relative`}
      style={{ backdropFilter: "blur(12px)" }}>
      {/* Card Header */}
      {content === "summary" ? (
        <h2 className="font-bold mb-2 text-white text-xl">Summary</h2>
      ) : (
        <div className="hidden md:block">
          <div className="flex items-center gap-6 relative mb-4">
            <div className="ml-44">
              <h2 className="font-bold text-xl mb-1 mt-2 text-white">
                The Belle Femme Salon
              </h2>
              <div className="flex flex-col text-gray-400">
                <div className="flex items-center gap-2 mb-1">
                  <ClientOnly>
                    <svg width="18" height="18" fill="none">
                      <circle
                        cx="9"
                        cy="9"
                        r="8"
                        stroke="#888"
                        strokeWidth="2"
                      />
                      <circle cx="9" cy="9" r="3" fill="#888" />
                    </svg>
                  </ClientOnly>
                  <span>NYC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`${
          content === "summary" ? "h-96" : ""
        } bg-white/10 p-4 shadow border border-white/20 overflow-hidden overflow-y-scroll max-h-[700px] categories_scroll`}>
        <div className="font-semibold my-4 text-[#c59d5f] flex items-center justify-between">
          {dateObj && (
            <>
              <span>
                {dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                | {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
              </span>
              <span className="text-[#c59d5f] text-xs flex items-center gap-1">
                👤 Single operator
              </span>
            </>
          )}
        </div>

        <ClientOnly
          fallback={
            <div className="italic text-gray-400 py-4">Loading cart...</div>
          }>
          {cart.length === 0 && (
            <div className="italic text-gray-400 py-4">
              No services in cart.
            </div>
          )}
          <div className="flex gap-3 operator_scroll overflow-x-auto md:flex-col md:gap-0 ">
            {cart.map((item: any, index: any) => (
              <div
                key={`left-panel-item-${index}-${item.id}`}
                className="bg-white/10 border border-white/20 rounded-lg my-2 p-3 flex flex-col gap-2 min-w-[280px] max-w-full lg:w-full">
                <div className="flex justify-between items-center lg:items-start flex-wrap">
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-gray-400 text-xs flex items-center gap-1">
                    <svg width="16" height="16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke="#888"
                        strokeWidth="1"
                      />
                      <path
                        d="M8 4v4l2 2"
                        stroke="#888"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    {item.duration} min
                  </div>
                </div>
                <div className="flex lg:flex-row lg:justify-between lg:items-center flex-col">
                  {/* --- THIS IS THE FIX for LeftPanel.tsx --- */}
                  {/* It now reads the time and operator from each specific item */}
                  <small className="text-gray-400">
                    {item.timeSlot && item.operator
                      ? `With ${item.operator} at ${item.timeSlot}`
                      : "Pick a time slot"}
                  </small>

                  <div className="flex items-center gap-2 font-bold text-[#c59d5f]">
                    <div>₹ {item.price?.toFixed(2)}</div>
                    <button
                      className="text-red-500 hover:text-red-700 text-lg"
                      onClick={() => dispatch(removeFromCart(index))}
                      aria-label="Remove">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ClientOnly>
      </div>

      {!content && (
        <button
          className="text-[#c59d5f] font-semibold text-sm hover:underline self-start mt-2 cursor-pointer mb-2"
          onClick={() => router.push("/services")}>
          + Add Service
        </button>
      )}

      {content && (
        <div className="mx-auto">
          <button
            className="text-[#f0f0f0] font-semibold text-2xl bg-[#c59d5f] cursor-pointer w-60 py-2 rounded-xl hover:bg-[#c59c5fdb]"
            onClick={() => router.push("/services/slots")}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
