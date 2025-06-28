// "use client";

// import "react-multi-carousel/lib/styles.css";
// import Carousel from "react-multi-carousel";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Image from "next/image";
// import type { FC } from "react";

// // Responsive breakpoints for react-multi-carousel
// const responsive = {
//   desktop: {
//     breakpoint: { max: 4000, min: 1024 },
//     items: 1,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 640 },
//     items: 1,
//   },
//   mobile: {
//     breakpoint: { max: 640, min: 0 },
//     items: 1,
//   },
// };

// // ✅ Props type for image slide
// type ImageSlideProps = {
//   src: string;
//   alt: string;
// };

// const ImageSlide: FC<ImageSlideProps> = ({ src, alt }) => (
//   <div className="relative w-full lg:h-[78vh] md:h-[55vh] h-[40vh]">
//     <Image
//       src={src}
//       alt={alt}
//       fill
//       className="object-cover"
//       priority
//       sizes="100vw"
//     />
//   </div>
// );

// // ✅ Props type for custom arrow components
// type ArrowProps = {
//   onClick?: () => void;
// };

// const CustomLeftArrow: FC<ArrowProps> = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="absolute left-2 md:left-4 top-1/2 z-10 transform -translate-y-1/2 bg-black/40 p-1 md:p-2 rounded-full text-white"
//     aria-label="Previous slide"
//     style={{ outline: "none" }}>
//     <ChevronLeft className="text-white" size={24} />
//   </button>
// );

// const CustomRightArrow: FC<ArrowProps> = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="absolute right-2 md:right-4 top-1/2 z-10 transform -translate-y-1/2 bg-black/40 p-1 md:p-2 rounded-full text-white"
//     aria-label="Next slide"
//     style={{ outline: "none" }}>
//     <ChevronRight className="text-white" size={24} />
//   </button>
// );

// export default function MultiImageCarousel() {
//   return (
//     <>
//       <div className="mt-20"></div>
//       <div className="w-full lg:h-[78vh] md:h-[55vh] h-[40vh] relative brightness-75">
//         <Carousel
//           responsive={responsive}
//           infinite
//           autoPlay
//           autoPlaySpeed={3000}
//           keyBoardControl
//           showDots={false}
//           customLeftArrow={<CustomLeftArrow />}
//           customRightArrow={<CustomRightArrow />}
//           containerClass="carousel-container h-full"
//           itemClass="h-full"
//           renderButtonGroupOutside>
//           {images.map((img, idx) => (
//             <ImageSlide
//               key={`slide-${idx}`}
//               src={img}
//               alt={`Slide ${idx + 1}`}
//             />
//           ))}
//         </Carousel>
//       </div>
//     </>
//   );
// }

"use client";

import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";

// ✅ 1. Update the images array to include position information
const images = [
  { src: "/images/hero-section/homehero1.webp", position: "center" },
  { src: "/images/hero-section/homehero2.webp", position: "center" },
  { src: "/images/hero-section/homehero3.webp", position: "top" },
  { src: "/images/hero-section/homehero4.webp", position: "center" },
  { src: "/images/hero-section/homehero5.webp", position: "center" },
  { src: "/images/hero-section/homehero6.webp", position: "center" }, // You can also use "bottom", "left", "right", etc.
  { src: "/images/hero-section/homehero7.webp", position: "center" },
];

// Responsive breakpoints for react-multi-carousel
const responsive = {
  desktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
  },
};

// ✅ 2. Update Props type to accept 'position'
type ImageSlideProps = {
  src: string;
  alt: string;
  position: string; // Add the position property
};

const ImageSlide: FC<ImageSlideProps> = ({ src, alt, position }) => (
  <div className="relative w-full lg:h-[78vh] md:h-[55vh] h-[40vh]">
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      priority
      sizes="100vw"
      // ✅ 3. Apply the dynamic object-position style
      style={{ objectPosition: position }}
    />
  </div>
);

// Props type for custom arrow components
type ArrowProps = {
  onClick?: () => void;
};

const CustomLeftArrow: FC<ArrowProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 md:left-4 top-1/2 z-10 transform -translate-y-1/2 bg-black/40 p-1 md:p-2 rounded-full text-white"
    aria-label="Previous slide"
    style={{ outline: "none" }}>
    <ChevronLeft className="text-white" size={24} />
  </button>
);

const CustomRightArrow: FC<ArrowProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 md:right-4 top-1/2 z-10 transform -translate-y-1/2 bg-black/40 p-1 md:p-2 rounded-full text-white"
    aria-label="Next slide"
    style={{ outline: "none" }}>
    <ChevronRight className="text-white" size={24} />
  </button>
);

export default function MultiImageCarousel() {
  return (
    <>
      <div className="mt-20"></div>
      <div className="w-full lg:h-[78vh] md:h-[55vh] h-[40vh] relative brightness-60">
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={3000}
          keyBoardControl
          showDots={false}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          containerClass="carousel-container h-full"
          itemClass="h-full"
          renderButtonGroupOutside>
          {/* ✅ 4. Map over the new array and pass the props */}
          {images.map((img, idx) => (
            <ImageSlide
              key={`slide-${idx}`}
              src={img.src}
              alt={`Slide ${idx + 1}`}
              position={img.position}
            />
          ))}
        </Carousel>
      </div>
    </>
  );
}
