// "use client";

import Comingsoon from "../components/common/ComingSoon";

// import React, { useState } from "react";
// import Image from "next/image";
// import belleImg from "../../../public/images/belle_femme.png";
// import { AiOutlineSafety } from "react-icons/ai";

// const categories = [
//   {
//     img: "/images/gift_birthday.png",
//     label: "Happy Birthday",
//   },
//   {
//     img: "/images/gift_congrats.png",
//     label: "Congratulations",
//   },
//   {
//     img: "/images/gift_thankyou.png",
//     label: "Thank You",
//   },
//   {
//     img: "/images/gift_all.png",
//     label: "View All",
//   },
// ];

// const amounts = [15000, 10000, 7000, 3500];

// export default function GiftCardPage() {
//   const [selectedCategory, setSelectedCategory] = useState(0);
//   const [selectedAmount, setSelectedAmount] = useState<number | null>(
//     amounts[0]
//   );
//   const [customAmount, setCustomAmount] = useState("");
//   const [recipient, setRecipient] = useState({ name: "", email: "" });
//   const [sender, setSender] = useState({ name: "", message: "" });

//   return (
//     <div className="min-h-screen bg-black text-white font-sans mt-20 mx-auto">
//       <div className="w-[1220px] mx-auto flex flex-col md:flex-row md:justify-center gap-10 py-10 px-4">
//         {/* Left: Card Preview */}
//         <div className="w-full md:w-[450px] flex flex-col items-center">
//           <div className="w-full aspect-square rounded-xl mb-6 flex items-center justify-center bg-neutral-900">
//             <Image
//               width={450}
//               height={450}
//               src={categories[selectedCategory].img}
//               alt={categories[selectedCategory].label}
//               className="w-full h-full object-cover p-4 pt-0 rounded-xl"
//             />
//           </div>
//           <div className="w-full px-2 text-base">
//             <div className="font-semibold text-lg mb-3">
//               Belle Femme Spa E-Gift Card
//             </div>
//             <div className="mb-1">
//               From: <span className="font-medium">{sender.name || "-"}</span>
//             </div>
//             <div className="mb-1">
//               To: <span className="font-medium">{recipient.name || "-"}</span>
//             </div>
//             <div className="mb-2">
//               Message:{" "}
//               <span className="font-medium">{sender.message || "-"}</span>
//             </div>
//           </div>
//           <div className="flex justify-center w-full mt-6">
//             <Image
//               src={belleImg}
//               alt="Belle Femme Spa"
//               className="w-24"
//               width={100}
//               height={40}
//             />
//           </div>
//         </div>

//         {/* Right: Form */}
//         <div className="flex-1 max-w-2xl mx-auto">
//           <h1 className="text-2xl font-bold text-center mb-2 tracking-wider">
//             Belle Femme SPA E-GIFT CARD
//           </h1>
//           <div className="text-center text-gray-300 mb-6">
//             Your quest for an ideal gift concludes here.
//           </div>
//           <div className="flex justify-center gap-8 mb-4">
//             <div className="flex flex-col items-center gap-1">
//               <Image
//                 width={32}
//                 height={32}
//                 src="/images/placeholder.png"
//                 alt="Premium Locations"
//                 className="w-10 h-10"
//               />
//               <div className="text-sm text-gray-300">Premium Locations</div>
//             </div>
//             <div className="flex flex-col items-center gap-1">
//               <Image
//                 width={32}
//                 height={32}
//                 src="/images/placeholder.png"
//                 alt="Certified Therapists"
//                 className="w-10 h-10"
//               />
//               <div className="text-sm text-gray-300">Certified Therapists</div>
//             </div>
//             <div className="flex flex-col items-center gap-1">
//               {/* <img src={AiOutlineSafety} alt="Commitment to Hygiene" className="w-10 h-10" /> */}
//               <AiOutlineSafety className="w-10 h-10 text-[#FFD700] font-extrabold" />
//               <div className="text-sm text-gray-300">Commitment to Hygiene</div>
//             </div>
//           </div>
//           <div className="text-center font-semibold mb-8 tracking-wider">
//             REDEEMABLE ACROSS 85+ LOCATIONS PAN INDIA
//           </div>

//           {/* Category */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Choose Your Category</div>
//             <div className="flex gap-4">
//               {categories.map((cat, idx) => (
//                 <div
//                   key={cat.label}
//                   className={`relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-150 flex flex-col items-center justify-center
//                     border-gray-700 text-white
//                     ${selectedCategory === idx ? "border-[#FFD700]" : ""}
//                     hover:border-[#FFD700] hover:shadow-lg
//                   `}
//                   onClick={() => setSelectedCategory(idx)}>
//                   <Image
//                     width={32}
//                     height={32}
//                     src={"/images/placeholder.png"}
//                     alt={cat.label}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute bottom-1 left-0 w-full text-xs text-black bg-[#FFD700] bg-opacity-80 text-center py-1 font-semibold">
//                     {cat.label}
//                   </div>
//                   {selectedCategory === idx && (
//                     <div className="absolute top-2 right-2 bg-[#FFD700] text-black rounded-full w-6 h-6 flex items-center justify-center font-bold shadow">
//                       ✓
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Amount */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Set an amount</div>
//             <div className="flex gap-3 flex-wrap">
//               {amounts.map((amt) => (
//                 <button
//                   key={amt}
//                   className={`rounded-xl px-6 py-2 font-semibold border-2 transition-all duration-150
//                     border-gray-700 text-white
//                     ${selectedAmount === amt ? "border-[#FFD700]" : ""}
//                     hover:border-[#FFD700] hover:text-[#FFD700]
//                   `}
//                   onClick={() => {
//                     setSelectedAmount(amt);
//                     setCustomAmount("");
//                   }}
//                   type="button">
//                   ₹{amt.toLocaleString()}
//                 </button>
//               ))}
//               <div className="flex items-center border-2 border-gray-700 rounded-xl px-2 h-11 bg-black">
//                 <span className="text-gray-400 mr-2">₹</span>
//                 <input
//                   className="bg-transparent outline-none text-white w-20"
//                   type="number"
//                   placeholder="Enter amount"
//                   value={customAmount}
//                   min={1}
//                   onChange={(e) => {
//                     setCustomAmount(e.target.value);
//                     setSelectedAmount(null);
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Delivery Info */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Delivery info</div>
//             <div className="flex items-center gap-4 mb-2">
//               <label className="w-28 font-medium">Delivery date</label>
//               <input
//                 className="flex-1 rounded-lg border border-gray-700 bg-black text-white px-4 py-2"
//                 value="NOW"
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Recipient Info */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">RECIPIENT&apos;S INFO</div>
//             <div className="flex items-center gap-4 mb-2">
//               <label className="w-28 font-medium">Name:</label>
//               <input
//                 className="flex-1 rounded-lg border border-gray-700 bg-black text-white px-4 py-2"
//                 value={recipient.name}
//                 onChange={(e) =>
//                   setRecipient({ ...recipient, name: e.target.value })
//                 }
//                 placeholder="Recipient's name"
//               />
//             </div>
//             <div className="flex items-center gap-4 mb-2">
//               <label className="w-28 font-medium">Email:</label>
//               <input
//                 className="flex-1 rounded-lg border border-gray-700 bg-black text-white px-4 py-2"
//                 value={recipient.email}
//                 onChange={(e) =>
//                   setRecipient({ ...recipient, email: e.target.value })
//                 }
//                 placeholder="Recipient's email"
//                 type="email"
//               />
//             </div>
//           </div>

//           {/* Sender Info */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">YOUR INFO</div>
//             <div className="flex items-center gap-4 mb-2">
//               <label className="w-28 font-medium">Name:</label>
//               <input
//                 className="flex-1 rounded-lg border border-gray-700 bg-black text-white px-4 py-2"
//                 value={sender.name}
//                 onChange={(e) => setSender({ ...sender, name: e.target.value })}
//                 placeholder="Your name"
//               />
//             </div>
//             <div className="flex items-center gap-4 mb-2">
//               <label className="w-28 font-medium">Message:</label>
//               <textarea
//                 className="flex-1 rounded-lg border border-gray-700 bg-black text-white px-4 py-2 min-h-[48px] resize-y"
//                 value={sender.message}
//                 onChange={(e) =>
//                   setSender({ ...sender, message: e.target.value })
//                 }
//                 placeholder="Your message"
//                 rows={3}
//               />
//             </div>
//           </div>

//           <button className="w-full mt-6 bg-black border-2 border-[#FFD700] text-white font-bold py-3 rounded-xl text-lg transition hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700]">
//             ADD TO CART
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// File: app/gift-card/page.tsx

// File: app/gift-card/page.tsx

export default function page() {
  return <Comingsoon />;
}
