/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, X, Trash2, ArrowRight } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { removeFromCart } from "../../store/slices/cartSlice";
import ClientOnly from "../common/ClientOnly";

export default function CartPopup() {
  const [showCart, setShowCart] = useState(false);
  const cart = useAppSelector((state) => state.cart.items);
  const isHydrated = useAppSelector((state) => state.cart.isHydrated);
  const dispatch = useAppDispatch();
  const cartRef = useRef<HTMLDivElement | null>(null);

  // Close cart on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (cartRef.current && !cartRef.current.contains(target)) {
        setShowCart(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPrice = cart.reduce((sum: any, item: any) => sum + item.price, 0);

  const handleRemoveItem = (index: number) => {
    dispatch(removeFromCart(index));
  };

  return (
    <div className="relative">
      {/* Enhanced Cart Button */}
      <button
        id="cart-icon"
        className="relative p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
        onClick={() => setShowCart((prev) => !prev)}>
        <ShoppingBag className="w-5 h-5 text-white group-hover:text-[#c59d5f] transition-colors duration-300" />

        {/* Cart Count Badge - wrapped in ClientOnly */}
        <ClientOnly>
          {isHydrated && cart.length > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs font-bold text-black">
                {cart.length}
              </span>
            </div>
          )}
        </ClientOnly>

        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Enhanced Cart Popup */}
      {showCart && (
        <ClientOnly
          fallback={
            <div className="absolute right-0 top-16 w-96 h-32 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c59d5f]"></div>
            </div>
          }>
          <div
            ref={cartRef}
            className="absolute -right-[75px] w-80 sm:right-0 top-16 sm:w-96 max-h-[550px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in slide-in-from-top duration-300">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-xl blur-md opacity-75 animate-pulse" />
                  <div className="relative w-10 h-10 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-xl flex items-center justify-center shadow-xl">
                    <ShoppingBag className="w-5 h-5 text-black animate-bounce" />
                  </div>
                </div>
                <span className="font-semibold text-white">Cart</span>
                {cart.length > 0 && (
                  <span className="px-2 py-1 bg-[#c59d5f]/20 text-[#c59d5f] text-xs rounded-full font-medium">
                    {cart.length} items
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 group">
                <X className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto max-h-80 categories_scroll">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 font-medium mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-gray-500 text-sm">
                    Add some services to get started
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {cart.map((item: any, index: any) => (
                    <div
                      key={`cart-item-${index}-${item.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group animate-in slide-in-from-left"
                      style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm group-hover:text-[#c59d5f] transition-colors duration-300">
                          {item.name}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">Service</p>
                      </div>

                      <div className="flex sm:flex-row flex-col ml-3 sm:ml-0 items-center space-x-3">
                        <span className="text-[#c59d5f] font-semibold text-sm">
                          ₹{item.price}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/50 to-black/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 font-medium">Total</span>
                  <span className="text-white font-bold text-lg">
                    ₹{totalPrice}
                  </span>
                </div>

                <Link
                  href="/services/slots"
                  className="w-72 flex mx-auto items-center justify-center space-x-2 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#c59d5f]/25 transition-all duration-300 transform hover:scale-105 group"
                  onClick={() => setShowCart(false)}>
                  <span className="text-lg">Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            )}
          </div>
        </ClientOnly>
      )}
    </div>
  );
}
