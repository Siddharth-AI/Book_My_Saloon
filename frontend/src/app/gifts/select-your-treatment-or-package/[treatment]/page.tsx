/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

// Mock data for the treatment. In a real app, you'd fetch this.
const treatments: { [key: string]: any } = {
  "short-and-sweet": {
    title: "Short & Sweet",
    price: 65,
    mainImg: "/images/birthday-gift-card.png",
    thumbnails: [
      "/images/thumb-1.png",
      "/images/thumb-2.png",
      "/images/thumb-3.png",
      "/images/thumb-4.png",
      "/images/thumb-5.png",
      "/images/thumb-6.png",
      "/images/thumb-7.png",
    ],
    treatmentChoices: [
      "Japanese Neck, Back & Shoulder Massage",
      "Therapeutic Massage",
      "Indian Head Massage",
      "Foot Reflexology",
      "Face and Decollete Massage",
    ],
    facilityPass: [
      "3h Spa Day Facility Pass",
      "Soothing Head or Foot Massage",
      "Spa Kit Rental (Bathrobe, Slippers, Towels)",
      "3h Free Parking",
    ],
  },
  // Add other treatments here...
};

// Reusable components from previous steps
const FormRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

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

export default function TreatmentCustomizationPage() {
  // 2. Remove params from props
  const params = useParams(); // 3. Get params using the hook
  const treatmentSlug = params.treatment as string; // 4. Access the specific param

  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");

  const treatmentData =
    treatments[treatmentSlug] || treatments["short-and-sweet"];
  const [mainImage, setMainImage] = useState(treatmentData.mainImg);

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
          href="/gifts/select-your-treatment-or-package"
          className="hover:underline text-[#8B7355] font-semibold">
          Spa Service Gift
        </Link>
        <span>/</span>
        <span className="text-gray-400 lowercase">{treatmentSlug}</span>
      </nav>
      <h1 className="shadow-lg shadow-[#8B7355] pb-8 text-3xl text-[#8B7355] tracking-widest text-center mb-8 uppercase">
        CUSTOMISE YOUR {treatmentSlug} GIFT CARD
      </h1>
      <div className=" bg-[#F0F0F0] max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12">
        {/* Left Column: Image & Details */}
        <div>
          <div className="mb-4">
            <Image
              src={mainImage}
              alt="Gift Card"
              width={600}
              height={400}
              className="w-full"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {treatmentData.thumbnails.map((thumb: string) => (
              <button
                key={thumb}
                onClick={() => setMainImage(thumb.replace("thumb", "card"))}
                className="flex-shrink-0">
                <Image
                  src={thumb}
                  alt="Thumbnail"
                  width={60}
                  height={80}
                  className="w-16 h-20 border hover:border-amber-600"
                />
              </button>
            ))}
          </div>
          <div className="mt-8 text-gray-700 space-y-4 text-sm">
            <h3 className="font-bold text-gray-800">
              Choice of {treatmentData.title} & Spa Day Package (30 Mins)
            </h3>
            <h4 className="font-semibold text-gray-800">
              Choice of {treatmentData.title} Treatments Each
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {treatmentData.treatmentChoices.map((choice: string) => (
                <li key={choice}>{choice}</li>
              ))}
            </ul>
            <ul className="list-disc list-inside space-y-1 mt-4">
              {treatmentData.facilityPass.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Form */}
        <div>
          <h1 className="text-2xl text-[#8B7355] tracking-widest mb-2">
            {treatmentData.title.toUpperCase()} - GIFT CARD
          </h1>
          <p className="text-xl text-gray-500 mb-6">
            €{treatmentData.price}.00
          </p>

          <form>
            <FormRow label="Location *">
              <select className="w-full p-2 border border-gray-300 bg-gray-50">
                <option>Select</option>
                <option>Intercontinental Hotel - St Julians</option>
                <option>Hyatt Regency Hotel - St Julians</option>
              </select>
            </FormRow>
            <FormRow label="Gift Card Occasion *">
              <select className="w-full p-2 border border-gray-300 bg-gray-50">
                <option>Select</option>
                <option>Happy Birthday</option>
                <option>Thank You</option>
                <option>Congratulations</option>
              </select>
            </FormRow>

            <FormRow label="Gift Receiver *">
              <input
                type="text"
                maxLength={25}
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full p-2 border border-gray-300"
              />
              <p className="text-right text-sm text-gray-500">
                {receiver.length}/25
              </p>
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
                type="submit"
                className="w-full bg-[#BFA78A] text-white py-3 tracking-widest font-bold hover:bg-amber-600">
                BUY NOW
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
// Note: This code assumes you have the necessary images in your public directory.
