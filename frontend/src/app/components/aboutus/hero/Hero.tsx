"use client";
import { useEffect, useState } from "react";

export default function Hero() {
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
    <div className="relative h-[18rem] md:h-[30rem] overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/images/about-us/aboutus1.webp')",
          backgroundSize: "cover",
          backgroundAttachment: bgAttachment,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-10" aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20">
        <p className="text-base md:text-lg italic mb-2">Made for you</p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-center">
          ABOUT US
        </h1>
      </div>
    </div>
  );
}
