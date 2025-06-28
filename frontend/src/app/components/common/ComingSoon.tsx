// File: app/gift-card/page.tsx or a reusable component

"use client";

import { PartyPopper } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
  // Add this prop to control the layout
  isEmbedded?: boolean;
}

export default function Comingsoon({ isEmbedded = false }: ComingSoonProps) {
  // Define base classes that are shared
  const containerClasses =
    "relative flex flex-col items-center justify-center text-center px-4 w-full";

  // Conditionally apply classes for either full-screen or embedded mode
  const layoutClasses = isEmbedded
    ? "py-20" // Simple padding for when it's inside another container
    : "min-h-screen bg-black overflow-hidden"; // Full-screen styles for the standalone page

  return (
    // Main container now uses dynamic classes

    <div className={`${containerClasses} ${layoutClasses}`}>
      {/* Background glow effects will only show on the standalone page */}
      {!isEmbedded && (
        <>
          <div className="absolute top-0 -left-1/3 w-2/3 h-2/3 bg-gradient-to-r from-[#c59d5f]/20 to-black rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 -right-1/3 w-2/3 h-2/3 bg-gradient-to-l from-[#f4d03f]/20 to-black rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        </>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Animated Icon with responsive padding */}
        <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-full mb-6 sm:mb-8 animate-fadeInUp">
          <PartyPopper
            className="text-[#f4d03f] animate-bounce"
            size={40} // Adjusted size for better mobile display
            strokeWidth={1.5}
          />
        </div>

        {/* Main Heading with responsive font sizes */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#f4d03f] via-white to-[#c59d5f] bg-clip-text text-transparent mb-4 animate-fadeInUp animation-delay-200">
          Coming Soon
        </h1>

        {/* Subheading with responsive font sizes */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-8 animate-fadeInUp animation-delay-400">
          We&apos;re working hard to bring you something amazing.
          <br />
          Stay updated with us, thank you for your patience!
        </p>

        {/* Go Back Home Button with responsive padding */}
        <Link href="/">
          <button className="px-6 py-3 sm:px-8 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-bold rounded-lg shadow-lg hover:shadow-[#c59d5f]/40 transform hover:scale-105 transition-all duration-300 animate-fadeInUp animation-delay-600">
            Go Back Home
          </button>
        </Link>
      </div>

      {/* Adding custom keyframes for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}
