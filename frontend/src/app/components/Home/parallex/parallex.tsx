"use client";

import { useRef, useEffect, useState } from "react";

export default function ParallaxImage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const progress = (sectionCenter - viewportCenter) / (windowHeight / 2);
      const clamped = Math.max(Math.min(progress, 1), -1);
      setOffset(clamped * 80); // Adjust 80 for more/less parallax
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[75vh] overflow-hidden bg-[#181818] bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/parallax-image/hairs.webp')",
        backgroundPosition: `center ${offset}px`,
        backgroundAttachment: "fixed",
      }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-20" />

      {/* Text Content */}
      <div className="absolute top-1/2 left-1/2 w-full max-w-[900px] text-center z-30 text-white px-5 -translate-x-1/2 -translate-y-1/2">
        {/* Makeover Script Text */}
        <span className="absolute left-1/2 -top-[110px] -translate-x-1/2 font-[Quentinregular] text-[8vw] text-[rgba(180,150,100,0.35)] whitespace-nowrap pointer-events-none z-40">
          Makeover
        </span>
        {/* Subheading */}
        <div className="tracking-[0.2em] text-base font-semibold mb-2.5">
          NEW YORK &nbsp;·&nbsp; SINCE 2004
        </div>
        {/* Main Heading */}
        <h1 className="text-5xl font-extrabold mb-5 tracking-[0.03em]">
          LOVE IS IN THE HAIR
        </h1>
        {/* Description */}
        <p className="text-lg text-[#e0e0e0] mb-10">
          You dream about sleek, healthy looking hair that looks picture
          perfect, ready to rock on any occasion? We will make your dreams come
          true.
        </p>
        {/* Button */}
        <button className="px-10 py-4 border-2 border-white bg-transparent text-white font-bold text-lg tracking-wide rounded transition-colors duration-200 hover:bg-[#c59d5f] hover:text-white cursor-pointer">
          VIEW MORE
        </button>
      </div>
    </section>
  );
}
