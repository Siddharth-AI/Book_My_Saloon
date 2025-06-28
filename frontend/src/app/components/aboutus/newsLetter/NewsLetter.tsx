"use client";
import { useEffect, useState } from "react";

export default function Newsletter() {
  // SSR-safe backgroundAttachment
  const [bgAttachment, setBgAttachment] = useState("scroll");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setBgAttachment("fixed");
      } else {
        setBgAttachment("scroll");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative py-16 md:py-32 bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          backgroundImage: "url('/images/about-us/aboutus2.webp')",
          backgroundSize: "cover",
          backgroundAttachment: bgAttachment,
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
      {/* Overlay Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <p className="text-sm md:text-md uppercase tracking-wider mb-4 md:mb-6">
          WANNA GREAT DEALS
        </p>
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-8 md:mb-12">
          GET ON THE LIST, ALWAYS GREAT NEWS FOR
          <br className="hidden sm:block" />
          CUPONS AND DISCOUNTS
        </h2>
        <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3 sm:gap-0">
          <input
            type="email"
            className="flex-1 p-3 border-0 focus:ring-0 text-black bg-white rounded-md sm:rounded-l-md sm:rounded-r-none"
            placeholder="Your email"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 sm:py-2 uppercase font-semibold rounded-md sm:rounded-r-md sm:rounded-l-none w-full sm:w-auto">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}
