// src/components/HairGrid.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

// --- DATA & TYPES ---
type BoxData = {
  title: string;
  subtitle: string;
  desc: string;
  link: string;
  bg: "light" | "dark";
};

const boxes: BoxData[] = [
  {
    title: "Lovely",
    subtitle: "HAIRCUTS",
    desc: "PRODUCTS · NEW TRENDS",
    link: "/blog/haircuts",
    bg: "light",
  },
  {
    title: "Change",
    subtitle: "COLORING",
    desc: "EXPERTS · INNOVATIONS",
    link: "/blog/coloring",
    bg: "dark",
  },
  {
    title: "Perfect",
    subtitle: "HAIRSTYLES",
    desc: "NEW YORK · SINCE 2004",
    link: "/blog/hairstyles",
    bg: "light",
  },
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function HairGrid() {
  return (
    <div className="px-4 my-10">
      <motion.div
        className="grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3 mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}>
        {boxes.map((box) => (
          <motion.div
            key={box.subtitle}
            variants={itemVariants}
            className="group relative flex h-[450px] cursor-pointer items-center justify-center rounded-lg [transform-style:preserve-3d]">
            {/* Themed Background */}
            <div
              className={`absolute inset-0 h-full w-full rounded-lg transition-all duration-300
                ${box.bg === "dark" ? "bg-zinc-900" : "bg-zinc-50"}`}
            />

            {/* Hover Border - This div acts as the ::after pseudo-element */}
            <div
              className="pointer-events-none absolute inset-3 scale-95 rounded-md border-2 border-[#d4af37]
                         opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
            />

            {/* Content */}
            <div className="relative text-center [transform:translateZ(20px)]">
              <span
                className="block text-8xl text-[#d4af37] drop-shadow-sm"
                // Inline style for the custom font
                style={{ fontFamily: "Quentinregular, cursive" }}>
                {box.title}
              </span>
              <h2
                className={`text-2xl font-bold uppercase tracking-widest
                  ${box.bg === "dark" ? "text-white" : "text-zinc-900"}`}>
                {box.subtitle}
              </h2>
              <p
                className={`mt-2 text-sm uppercase tracking-[0.2em]
                  ${box.bg === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                {box.desc}
              </p>
              <Link
                href={box.link}
                className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-[#d4af37] transition-transform duration-300 group-hover:translate-x-1">
                Read More <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
