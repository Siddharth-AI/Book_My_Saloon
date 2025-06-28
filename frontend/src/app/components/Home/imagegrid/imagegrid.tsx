"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi"; // Using an icon for better UI

// --- DATA & TYPES ---
// Type definition for our image data
type GridImage = {
  src: string;
  alt: string;
  layoutClasses: string; // CSS classes for grid positioning
  overlay: {
    heading: string;
    link: string;
    buttonText: string;
  };
};

// Image data array with layout classes included
const images: GridImage[] = [
  {
    src: "/images/gird-image/imagegrid1.webp",
    alt: "A person receiving a modern, stylish haircut.",
    // Spans 2 columns on large screens
    layoutClasses: "sm:col-span-2 md:col-span-1 lg:col-span-2",
    overlay: {
      heading: "Modern Haircut",
      link: "/gallery/haircut",
      buttonText: "View More",
    },
  },
  {
    src: "/images/gird-image/imagegrid4.webp",
    alt: "Hair coloring process with classic techniques.",
    // Spans 2 rows on large screens
    layoutClasses: "sm:col-span-1 md:col-span-1 lg:row-span-2",
    overlay: {
      heading: "Classic Coloring",
      link: "/gallery/coloring",
      buttonText: "View More",
    },
  },
  {
    src: "/images/gird-image/imagegrid5.webp",
    alt: "Various professional hair styling tools on a table.",
    // Spans 2 rows on large screens
    layoutClasses: "sm:col-span-1 md:col-span-1 lg:row-span-2",
    overlay: {
      heading: "Styling Tools",
      link: "/gallery/tools",
      buttonText: "View More",
    },
  },
  {
    src: "/images/gird-image/imagegrid2.webp",
    alt: "A professional barber giving a sharp fade.",
    layoutClasses: "sm:col-span-1",
    overlay: {
      heading: "Professional Barber",
      link: "/gallery/barber",
      buttonText: "View More",
    },
  },
  {
    src: "/images/gird-image/imagegrid3.webp",
    alt: "A model showing off a trendy, modern look.",
    // Spans 2 columns on large screens
    layoutClasses: "sm:col-span-2 md:col-span-1 lg:col-span-2",
    overlay: {
      heading: "Trendy Looks",
      link: "/gallery/trendy",
      buttonText: "View More",
    },
  },
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ImageGrid() {
  return (
    <div className="mx-auto my-12 max-w-7xl px-4">
      {/* Grid layout defined directly with responsive modifiers.
        - Small screens (default): 1 column grid
        - Medium screens (sm): 2 column grid
        - Large screens (lg): 3 column grid with specific row heights
      */}
      <motion.div
        className="grid auto-rows-[250px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}>
        {images.map((img) => (
          <motion.div
            key={img.src}
            className={`group relative h-full w-full overflow-hidden rounded-xl ${img.layoutClasses}`}
            variants={itemVariants}>
            {/* The Image */}
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority // Prioritize loading images in the viewport
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* The Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            {/* The Content Overlay */}
            <div
              className="absolute inset-2.5 flex flex-col items-start justify-end p-6 text-white rounded-lg border-2 border-[#c59d5f] text-center
                         opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              <h3
                className="text-4xl font-bold text-[#c59d5f] transition-transform duration-300 ease-out group-hover:-translate-y-2"
                // Inline style for the custom font, as requested
                style={{ fontFamily: "Quentinregular, cursive" }}>
                {img.overlay.heading}
              </h3>
              <Link
                href={img.overlay.link}
                className="mt-2 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100 hover:border-white/80 hover:bg-white/20">
                {img.overlay.buttonText} <FiArrowUpRight />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
