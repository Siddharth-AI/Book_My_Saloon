import { TreatmentCard } from "@/app/components/gift/TreatmentCard";
import Link from "next/link";
const spaPackages = [
  // ... (add your spa packages data here)
  {
    title: "Short & Sweet",
    description: "An express treatment for those on the go.",
    details: ["Choice of Back Massage or Express Facial", "30 Minutes"],
    price: 45,
    imgSrc: "/images/short-sweet.jpg",
  },
  {
    title: "Time To Relax",
    description: "A perfect combination to de-stress.",
    details: ["Full Body Massage", "60 Minutes"],
    price: 80,
    imgSrc: "/images/time-to-relax.jpg",
  },
  // Add more packages...
];

export default function SelectTreatmentPage() {
  return (
    <div className="py-32 px-4 text-center">
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
        <span className="text-gray-400">Spa Service Gift</span>
      </nav>
      <h1 className="text-3xl text-[#8B7355] tracking-widest mb-8 font-bold shadow-lg shadow-[#8B7355] pb-6">
        SELECT YOUR TREATMENT OR PACKAGE
      </h1>
      <p className="text-gray-500 mb-12">
        You can gift any of our treatments or packages, or explore our website
        to choose the perfect treatment to give.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {spaPackages.map((pkg) => (
          <TreatmentCard
            key={pkg.title}
            title={pkg.title}
            description={pkg.description}
            details={pkg.details}
            price={pkg.price}
            imgSrc={pkg.imgSrc}
          />
        ))}
      </div>
    </div>
  );
}
