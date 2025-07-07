/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import FormRow from "@/app/components/gift/FormRow";
import Link from "next/link";

const GiftCanvas = dynamic(() => import("@/app/components/gift/GiftCanvas"), {
  ssr: false,
});

const QuantityInput = () => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex items-center border border-gray-300 w-24">
      <button
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        className="px-3 py-1 text-lg">
        -
      </button>
      <input
        type="text"
        value={quantity}
        readOnly
        className="w-full text-center border-l border-r"
      />
      <button
        onClick={() => setQuantity((q) => q + 1)}
        className="px-3 py-1 text-lg">
        +
      </button>
    </div>
  );
};

export default function GiftCustomizationPage() {
  const params = useParams();
  const occasionSlug = params.occasion as string;
  const occasionTitle = occasionSlug
    ? occasionSlug.replace(/-/g, " ").toUpperCase()
    : "";

  const [mainImage, setMainImage] = useState(
    `/images/gift/${occasionTitle}/christmas-card.webp`
  );
  const [message, setMessage] = useState("");
  const [selectedGift, setSelectedGift] = useState<string>("");
  const [receiver, setReceiver] = useState("");

  const stageRef = useRef<any>(null);

  const thumbnails = [
    `/images/gift/${occasionTitle}/${occasionTitle}-thumb1.webp`,
    `/images/gift/${occasionTitle}/${occasionTitle}-thumb2.webp`,
    `/images/gift/${occasionTitle}/${occasionTitle}-thumb3.webp`,
    `/images/gift/${occasionTitle}/${occasionTitle}-thumb4.webp`,
  ];

  const handleDownload = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement("a");
      link.download = "giftcard.png";
      link.href = uri;
      link.click();
    }
  };

  return (
    <div className="py-32">
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
        <Link
          href="/gifts/value-gifts"
          className="hover:underline text-[#8B7355] font-semibold">
          Value Gift
        </Link>
        <span>/</span>
        <span className="text-gray-400 lowercase">{occasionTitle}</span>
      </nav>

      <h1 className="shadow-lg shadow-[#8B7355] pb-8 text-3xl text-[#8B7355] tracking-widest text-center mb-8">
        CUSTOMISE YOUR {occasionTitle} GIFT CARD
      </h1>

      <div className="bg-[#F0F0F0] max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12">
        {/* Left Column: Live Canvas */}
        <div>
          <div className="mb-4 border">
            <GiftCanvas
              designUrl={mainImage}
              message={message}
              receiver={receiver}
              selectedGift={selectedGift}
              ref={stageRef}
            />
          </div>

          <div className="flex space-x-2">
            {thumbnails.map((thumb) => (
              <button key={thumb} onClick={() => setMainImage(thumb)}>
                <img
                  src={thumb}
                  alt="Thumbnail"
                  className="w-20 h-20 border hover:border-amber-600"
                />
              </button>
            ))}
          </div>

          <div className="mt-8 text-gray-700 space-y-4">
            <p>
              Give the gift of wellness to your loved ones for this Christmas &
              pamper them to a luxury spa experience.
            </p>
            <h3 className="font-bold text-lg text-gray-800">T&C:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Voucher valid for 12 months.</li>
              <li>Redeemable at any Carisma Spa around the island.</li>
              <li>Intercontinental Hotel - St Julians</li>
              <li>Hyatt Regency Hotel - St Julians</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Form */}
        <div>
          <h1 className="text-2xl text-[#8B7355] tracking-widest mb-2">
            {occasionTitle} GIFTCARDS
          </h1>

          <p className="text-xl text-gray-500 mb-6">
            {selectedGift ? `€${selectedGift}` : "€50"}
          </p>

          <FormRow label="Select Your Gift *">
            <select
              className="w-full p-2 border border-gray-300"
              value={selectedGift}
              onChange={(e) => setSelectedGift(e.target.value)}>
              <option value="">Select</option>
              <option value="50">Voucher for €50</option>
              <option value="100">Voucher for €100</option>
              <option value="150">Voucher for €150</option>
            </select>
          </FormRow>

          <FormRow label="Gift Card Design *">
            <select className="w-full p-2 border border-gray-300">
              <option>Select</option>
              <option>Christmas Design</option>
              <option>Standard Design</option>
            </select>
          </FormRow>

          <FormRow label="Gift Receiver *">
            <input
              type="text"
              className="w-full p-2 border border-gray-300"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          </FormRow>

          <FormRow label="Customised Message *">
            <textarea
              rows={4}
              maxLength={200}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300"
            />
            <p className="text-right text-sm text-gray-500">
              {message.length}/200
            </p>
          </FormRow>

          <FormRow label="Quantity *">
            <QuantityInput />
          </FormRow>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleDownload}
              className="w-full bg-[#BFA78A] text-white py-3 tracking-widest font-bold hover:bg-amber-600">
              DOWNLOAD GIFT CARD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
