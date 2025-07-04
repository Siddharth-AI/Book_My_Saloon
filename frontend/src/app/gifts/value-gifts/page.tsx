"use client";

import { OccasionCard } from "@/app/components/gift/OccasionCard";
import Link from "next/link";
const occasions = [
  { name: "Christmas", imgSrc: "/images/gift/christmas.webp" },
  { name: "Just For You", imgSrc: "/images/just-for-you.jpg" },
  { name: "Birthday", imgSrc: "/images/birthday.jpg" },
  { name: "Congratulations", imgSrc: "/images/congrats.jpg" },
  { name: "Anniversary", imgSrc: "/images/anniversary.jpg" },
  { name: "Thank You", imgSrc: "/images/thank-you.jpg" },
];

export default function ValueGiftsPage() {
  return (
    <div className=" py-32 px-4">
      <nav className="mb-4 text-sm text-gray-600 flex items-center justify-start ml-10 space-x-2">
        <Link href="/" className="hover:underline text-[#8B7355] font-semibold">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/gifts"
          className="hover:underline text-[#8B7355] font-semibold">
          Gift
        </Link>
        <span>/</span>
        <span className="text-gray-400">Spa Gift</span>
      </nav>
      <h1 className="text-center text-3xl text-[#8B7355] font-bold shadow-lg shadow-[#8B7355] pb-6 tracking-widest mb-8">
        SELECT YOUR GIFT OCCASION
      </h1>
      <p className="text-center text-gray-500 mb-12 text-lg">
        Choose your gift card design best fit for your occasion
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {occasions.map((occasion) => (
          <OccasionCard
            key={occasion.name}
            name={occasion.name}
            imgSrc={occasion.imgSrc}
          />
        ))}
      </div>

      {/* You can add the rest of the form for amount selection and personalization here */}
    </div>
  );
}
