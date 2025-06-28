"use client";

import { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const testimonials = [
  {
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "MICHELLE ORTIZ",
    company: "VOGUE",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod nisi vel consectetur.",
    author: "JANE DOE",
    company: "ELLE",
  },
  {
    quote:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    author: "JOHN SMITH",
    company: "GQ",
  },
  {
    quote:
      "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.",
    author: "EMILY WATSON",
    company: "HARPER'S BAZAAR",
  },
  {
    quote:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "ALEX JOHNSON",
    company: "COSMOPOLITAN",
  },
];

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef();

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  // Auto-scroll effect
  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(next, 3500);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  // Pause on mouse enter/focus, resume on leave/blur
  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  return (
    <section
      className="relative bg-[#191818] py-12 md:py-24 text-center text-white overflow-hidden h-[440px] sm:h-[500px] md:h-[540px] flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}>
      {/* Background script text */}
      <span
        className="absolute left-1/2 top-0 -translate-x-1/2 mt-4 text-[10vw] md:text-[8vw] text-[#7b6a4b]/10 font-bold select-none pointer-events-none z-0 whitespace-nowrap"
        style={{ fontFamily: "Quentinregular, cursive" }}>
        They said
      </span>

      {/* Left Arrow */}
      <button
        onClick={prev}
        aria-label="Previous testimonial"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 text-2xl sm:text-4xl bg-black/30 hover:bg-black/60 rounded-full w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center transition"
        style={{ fontFamily: "inherit" }}>
        <MdKeyboardArrowLeft />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        aria-label="Next testimonial"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 text-2xl sm:text-4xl bg-black/30 hover:bg-black/60 rounded-full w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center transition"
        style={{ fontFamily: "inherit" }}>
        <MdKeyboardArrowRight />
      </button>

      <div className="relative z-10 max-w-2xl md:max-w-4xl mx-auto px-4 w-full">
        <div className="text-3xl sm:text-4xl mb-3 sm:mb-6">
          <span className="inline-block text-4xl sm:text-5xl font-bold">“</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
          TESTIMONIALS
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg transition-all duration-500 min-h-[64px] sm:min-h-[80px]">
          {testimonials[current].quote}
        </p>
        <div className="mb-6 sm:mb-8 text-xs sm:text-sm tracking-widest font-semibold text-gray-300">
          {testimonials[current].author} &bull; {testimonials[current].company}
        </div>
        {/* Carousel dots */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                current === idx ? "bg-white" : "bg-gray-500/50"
              } transition outline-none`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
