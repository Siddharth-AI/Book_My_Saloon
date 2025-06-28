"use client";

import Image from "next/image";

export default function StaticMapHero() {
  return (
    <>
      <div className="mt-20"></div>
      <div className="w-full flex items-center justify-center bg-black overflow-hidden">
        <Image
          src="/images/contact-us/map.webp"
          alt="Map"
          width={1000}
          height={600}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
    </>
  );
}
