"use client";
import { useEffect, useState } from "react";

export default function AboutOurStory() {
  // State to control backgroundAttachment
  const [bgAttachment, setBgAttachment] = useState("scroll");

  useEffect(() => {
    // This runs only in the browser
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setBgAttachment("fixed");
      } else {
        setBgAttachment("scroll");
      }
    };

    // Set on mount
    handleResize();

    // Update on resize for responsiveness
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-[70vh] md:min-h-[90vh] py-12 md:py-20 overflow-hidden flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/images/about-us/aboutus3.webp')",
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundAttachment: bgAttachment,
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      {/* Overlay for readability */}
      <div
        className="absolute inset-0 bg-white/60 md:bg-white/40 z-0"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-6 flex flex-col items-center z-10 text-center">
        <div className="w-full md:w-2/3 mx-auto relative flex flex-col items-center">
          {/* Large "Story" script */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
            style={{
              fontFamily: "Quentinregular, cursive",
              fontSize: "clamp(3rem, 18vw, 13rem)",
              color: "#c59d5f",
              opacity: 0.3,
              zIndex: 1,
              whiteSpace: "nowrap",
            }}>
            Story
          </div>
          <div className="relative z-10 pt-20 md:pt-40">
            <h3 className="text-xs md:text-sm font-medium tracking-widest mb-2 uppercase text-gray-700">
              New York • SINCE 2004
            </h3>
            <h3 className="text-2xl md:text-3xl tracking-widest font-bold mb-6 md:mb-8">
              ABOUT OUR STORY
            </h3>
            <p className="text-gray-700 mb-6 text-sm md:text-base px-2 md:px-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, ut labore
              et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi.
            </p>
            <button className="border-b text-[#c59d5f] border-gray-400 pb-1 hover:text-gray-800 transition">
              READ MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
