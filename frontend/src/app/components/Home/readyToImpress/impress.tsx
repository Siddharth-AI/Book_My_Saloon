// "use client";

// import "./impress.module.css";
// import { motion, useAnimation, useInView } from "framer-motion";
// import { useRef, useEffect, useState } from "react";
// import Image from "next/image";
// import image1 from "../../../../../public/images/impress/impress1.webp";
// import image2 from "../../../../../public/images/impress/impress2.webp";
// import back from "../../../../../public/images/impress/impressbg.webp";

// export default function BeautyHero() {
//   // Parallax background logic
//   const sectionRef = useRef(null);
//   const [parallaxY, setParallaxY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!sectionRef.current) return;
//       const rect = sectionRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;
//       const sectionCenter = rect.top + rect.height / 2;
//       const viewportCenter = windowHeight / 2;
//       const progress = (sectionCenter - viewportCenter) / (windowHeight / 2);
//       const clamped = Math.max(Math.min(progress, 1), -1);
//       setParallaxY(clamped * 80); // Adjust for more/less parallax
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     handleScroll();
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Ref and in-view detection for images
//   const imagesRef = useRef(null);
//   const isInView = useInView(imagesRef, { once: true, margin: "-100px" });
//   const controls = useAnimation();

//   useEffect(() => {
//     if (isInView) {
//       controls.start({ opacity: 1, y: 0, scale: 1 });
//     }
//   }, [isInView, controls]);

//   // Holographic effect variants
//   const holoVariants = {
//     rest: {
//       scale: 1,
//       rotateX: 0,
//       rotateY: 0,
//       boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
//     },
//     hover: {
//       scale: 1.06,
//       rotateX: -6,
//       rotateY: 6,
//       boxShadow:
//         "0 8px 40px 0 rgba(255, 200, 100, 0.20), 0 2px 10px 0 rgba(160, 110, 60, 0.12)",
//       transition: { type: "spring", stiffness: 400, damping: 16, mass: 0.8 },
//     },
//   };

//   return (
//     <section
//       ref={sectionRef}
//       className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center brightness-90"
//       style={{
//         backgroundImage: `url(${back.src})`,
//         backgroundPosition: `center ${parallaxY}px`,
//         backgroundRepeat: "no-repeat",
//         backgroundAttachment: "fixed",
//         transition: "background-position 0.1s linear",
//       }}>
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black opacity-25 z-0" />

//       {/* Beauty Text Overlay */}
//       <span
//         className="absolute left-[3vw] top-[210px] pointer-events-none select-none z-10 opacity-75"
//         style={{
//           letterSpacing: "0.075em",
//           whiteSpace: "nowrap",
//           userSelect: "none",
//           fontFamily: "Quentinregular, cursive",
//           fontSize: "10rem",
//           fontWeight: 700,
//           color: "rgba(160,130,90,1)", // Use full color, opacity handled by Tailwind
//         }}>
//         Beauty
//       </span>

//       {/* Content */}
//       <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-6xl mx-auto px-6 py-20">
//         {/* Text Section */}
//         <div className="flex-1 text-center md:text-left">
//           <h2 className="text-6xl font-bold text-white mb-4 tracking-tight">
//             <span className="block text-2xl font-normal text-gray-400 mb-2">
//               NEW YORK · SINCE 2004
//             </span>
//             READY TO IMPRESS
//           </h2>
//           <p className="text-gray-200 max-w-lg mb-8 mx-auto md:mx-0">
//             Get ready to impress others with your looks. Just flaunt yourself in
//             front of other and make yourself look Prettier.
//           </p>
//           <a
//             href="#"
//             className="inline-block px-8 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full shadow hover:bg-yellow-400 transition">
//             READ MORE
//           </a>
//         </div>

//         {/* Images with Animation */}
//         <div
//           className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 md:mt-0"
//           ref={imagesRef}>
//           {[image1, image2].map((img, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, y: 40, scale: 0.95 }}
//               animate={controls}
//               transition={{ duration: 0.2, delay: 0.2 + idx * 0.15 }}
//               variants={holoVariants}
//               whileHover="hover"
//               whileTap="hover"
//               className="holo-card rounded-lg overflow-hidden shadow-lg cursor-pointer relative"
//               style={{ willChange: "transform" }}>
//               <Image
//                 src={img}
//                 alt={idx === 0 ? "Hairdresser styling hair" : "Hair styling"}
//                 width={286}
//                 height={352}
//                 className="object-cover w-[286px] h-[352px] md:h-[352px] transition-all duration-300"
//                 style={{ objectPosition: "center" }}
//               />
//               {/* Holographic overlay */}
//               <div className="holo-overlay pointer-events-none" />
//             </motion.div>
//           ))}
//         </div>
//       </div>
//       {/* Holographic CSS */}
//       <style jsx>{`
//         .holo-card {
//           position: relative;
//           overflow: hidden;
//         }
//         .holo-overlay {
//           content: "";
//           position: absolute;
//           inset: 0;
//           z-index: 2;
//           opacity: 0;
//           pointer-events: none;
//           transition: opacity 0.25s;
//           background: linear-gradient(
//             120deg,
//             rgba(255, 220, 120, 0.22) 0%,
//             rgba(200, 160, 90, 0.18) 40%,
//             rgba(160, 110, 60, 0.14) 70%,
//             rgba(255, 240, 200, 0.18) 100%
//           );
//           mix-blend-mode: lighten;
//           filter: blur(2px) saturate(1.2);
//         }
//         .holo-card:hover .holo-overlay,
//         .holo-card:focus .holo-overlay {
//           opacity: 1;
//           animation: holo-shimmer 0.5s linear;
//         }
//         @keyframes holo-shimmer {
//           0% {
//             background-position: 0% 50%;
//           }
//           100% {
//             background-position: 100% 50%;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useRef, useEffect, useState, FC } from "react";
import Image from "next/image";

const BeautyHero: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const progress = (sectionCenter - viewportCenter) / (windowHeight / 2);
      const clamped = Math.max(Math.min(progress, 1), -1);
      setParallaxY(clamped * 80); // Adjust this value for more/less parallax
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- IMAGE ANIMATION LOGIC ---
  const imagesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(imagesRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0, scale: 1 });
    }
  }, [isInView, controls]);

  // --- FRAMER MOTION VARIANTS ---
  const holoVariants: Variants = {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    },
    hover: {
      scale: 1.06,
      rotateX: -6,
      rotateY: 6,
      boxShadow:
        "0 8px 40px 0 rgba(255, 200, 100, 0.20), 0 2px 10px 0 rgba(160, 110, 60, 0.12)",
      transition: { type: "spring", stiffness: 400, damping: 16, mass: 0.8 },
    },
  };

  const images: { src: string; alt: string }[] = [
    {
      src: "/images/impress/impress1.webp",
      alt: "Hairdresser styling a client's hair",
    },
    { src: "/images/impress/impress2.webp", alt: "Close-up of hair styling" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center brightness-90"
      style={{
        backgroundImage: `url(images/impress/impressbg.webp)`,
        backgroundPosition: `center ${parallaxY}px`,
        backgroundAttachment: "fixed",
        transition: "background-position 0.1s linear",
      }}>
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black opacity-25" />

      {/* Background Text */}
      <span className="font-beauty-script absolute left-[3vw] top-[210px] z-10 select-none text-[10rem] font-bold leading-none tracking-wider text-[rgba(160,130,90,1)] opacity-75 pointer-events-none">
        Beauty
      </span>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 md:flex-row">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-6xl font-bold tracking-tight text-white">
            <span className="mb-2 block text-2xl font-normal text-gray-400">
              NEW YORK · SINCE 2004
            </span>
            READY TO IMPRESS
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-200 md:mx-0">
            Get ready to impress with your looks. Flaunt yourself and feel
            prettier than ever before.
          </p>
          <a
            href="#"
            className="mt-8 inline-block rounded-full bg-yellow-500 px-8 py-3 font-semibold text-gray-900 shadow-lg transition-colors hover:bg-yellow-400">
            READ MORE
          </a>
        </div>

        {/* Images Section */}
        <div
          ref={imagesRef}
          className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 md:mt-0">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg"
              style={{ willChange: "transform" }}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={controls}
              transition={{ duration: 0.2, delay: 0.2 + idx * 0.15 }}
              variants={holoVariants}
              whileHover="hover"
              whileTap="hover">
              <Image
                src={img.src}
                alt={img.alt}
                width={286}
                height={352}
                className="h-[352px] w-[286px] object-cover object-center transition-all duration-300"
              />
              {/* Holographic Overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-holo-shimmer"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(255,220,120,0.22) 0%, rgba(200,160,90,0.18) 40%, rgba(160,110,60,0.14) 70%, rgba(255,240,200,0.18) 100%)",
                  mixBlendMode: "lighten",
                  filter: "blur(2px) saturate(1.2)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeautyHero;
