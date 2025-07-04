// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import LocationSelectorPanel from "../ui/LocationSelectorPanel";
// import CartPopup from "../ui/CartPopup";
// import ProfileDropdown from "../ui/ProfileDropdown";
// import MobileMenu from "../ui/MobileMenu";

// const NAV_LINKS = [
//   { label: "Home", href: "/" },
//   { label: "Services", href: "/services" },
//   { label: "Gift Card", href: "/gift-card" },
//   { label: "About Us", href: "/about-us" },
//   { label: "Contact Us", href: "/contact-us" },
// ];

// export default function Header() {
//   const [scrolled, setScrolled] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const pathname = usePathname();

//   // Re-introduced immediate hide-on-scroll logic
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       // Set the "scrolled" state for background/style changes
//       setScrolled(currentScrollY > 10);

//       // Hide navbar if scrolling down (and not at the very top). Show if scrolling up.
//       // The check `currentScrollY > 10` prevents it from hiding on small jitters at the top of the page.
//       if (currentScrollY > lastScrollY && currentScrollY > 10) {
//         setIsVisible(false); // Hide when scrolling down
//       } else {
//         setIsVisible(true); // Show when scrolling up
//       }

//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY]);

//   return (
//     <>
//       <header
//         className={`w-full left-0 z-50 transition-all duration-500 ease-out ${
//           scrolled
//             ? // When scrolled, the navbar's visibility is controlled by the `isVisible` state.
//               `fixed ${
//                 isVisible ? "top-0" : "-top-24"
//               } backdrop-blur-xl bg-black/90 shadow-2xl border-b border-white/10`
//             : // When at the top of the page, it has a transparent gradient background.
//               "absolute top-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-md"
//         }`}
//         style={{ fontFamily: "'Poppins', sans-serif" }}>
//         {/* Animated background gradient */}
//         <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f]/5 via-transparent to-[#c59d5f]/5 opacity-50" />

//         {/* Floating particles effect */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div
//             className="absolute w-2 h-2 bg-[#c59d5f]/30 rounded-full animate-float-1"
//             style={{ top: "20%", left: "10%" }}
//           />
//           <div
//             className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-2"
//             style={{ top: "60%", left: "80%" }}
//           />
//           <div
//             className="absolute w-1.5 h-1.5 bg-[#c59d5f]/20 rounded-full animate-float-3"
//             style={{ top: "40%", left: "60%" }}
//           />
//         </div>

//         <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-8 relative z-10">
//           {/* Enhanced Left Logo + Location */}
//           <div className="flex items-center group">
//             <div className="relative">
//               {/* Glow effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-lg blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

//               <div className="relative border-2 rounded-lg w-10 h-10 flex items-center justify-center mr-3 border-white/60 hover:border-[#c59d5f] transition-all duration-300 bg-black/30 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3">
//                 <span className="text-lg font-bold bg-gradient-to-r from-white to-[#c59d5f] bg-clip-text text-transparent">
//                   B
//                 </span>
//               </div>
//             </div>

//             <div className="relative">
//               <span className="hidden sm:inline font-bold text-xl text-white tracking-wide group-hover:text-[#c59d5f] transition-colors duration-300">
//                 BELLE FEMME
//               </span>
//               {/* Underline animation */}
//               <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] group-hover:w-full transition-all duration-500" />
//             </div>
//             <LocationSelectorPanel />
//           </div>

//           {/* Improved Center Nav (Desktop) */}
//           <nav className="flex-1 justify-center hidden lg:flex">
//             <ul className="flex space-x-6 uppercase font-semibold tracking-wider text-sm relative text-white">
//               {NAV_LINKS.map((link) => {
//                 const isActive = pathname === link.href;
//                 return (
//                   <li key={link.href} className="relative">
//                     <Link
//                       href={link.href}
//                       className={`${
//                         isActive ? "text-[#c59d5f]" : "text-white"
//                       } relative px-2 py-1 inline-block transition-all duration-200 hover:text-[#c59d5f]`}>
//                       {link.label}
//                       {/* Enhanced underline for active link */}
//                       <span
//                         className={`absolute left-0 right-0 -bottom-1 h-0.5 rounded-full transition-all duration-300 ${
//                           isActive
//                             ? "bg-[#c59d5f] w-full scale-x-100"
//                             : "bg-[#c59d5f]/70 w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100"
//                         }`}
//                       />
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           {/* Enhanced Right Icons (Desktop) */}
//           <div
//             id="cart-icon"
//             className="hidden lg:flex items-center text-xl relative text-white h-[80px] space-x-1">
//             <CartPopup />
//             <ProfileDropdown />
//           </div>
//           <div
//             id="cart-icon"
//             className="lg:hidden flex items-center text-xl relative text-white gap-5">
//             <CartPopup />
//             <MobileMenu navLinks={NAV_LINKS} />
//           </div>

//           {/* Mobile Menu */}
//         </div>

//         {/* Bottom glow line */}
//         <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c59d5f]/50 to-transparent" />
//       </header>

//       {/* Enhanced Animations */}
//       <style jsx>{`
//         @keyframes float-1 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-20px) rotate(180deg);
//           }
//         }
//         @keyframes float-2 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-15px) rotate(-180deg);
//           }
//         }
//         @keyframes float-3 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-25px) rotate(90deg);
//           }
//         }
//         .animate-float-1 {
//           animation: float-1 6s ease-in-out infinite;
//         }
//         .animate-float-2 {
//           animation: float-2 8s ease-in-out infinite;
//         }
//         .animate-float-3 {
//           animation: float-3 7s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import LocationSelectorPanel from "../ui/LocationSelectorPanel";
// import CartPopup from "../ui/CartPopup";
// import ProfileDropdown from "../ui/ProfileDropdown";
// import MobileMenu from "../ui/MobileMenu";

// const NAV_LINKS = [
//   { label: "Home", href: "/" },
//   { label: "Services", href: "/services" },
//   { label: "Gift Card", href: "/gift-card" },
//   { label: "About Us", href: "/about-us" },
//   { label: "Contact Us", href: "/contact-us" },
// ];

// export default function Header() {
//   const [scrolled, setScrolled] = useState(false);
//   const pathname = usePathname();

//   // Simplified useEffect to only detect if the page has been scrolled.
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []); // Empty dependency array ensures this runs only once.

//   return (
//     <>
//       <header
//         className={`w-full left-0 z-50 transition-all duration-500 ease-out ${
//           scrolled
//             ? // When scrolled, the navbar is always fixed at the top.
//               `fixed top-0 backdrop-blur-xl bg-black/90 shadow-2xl border-b border-white/10`
//             : // When not scrolled, it's positioned absolutely at the top.
//               "absolute top-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-md"
//         }`}
//         style={{ fontFamily: "'Poppins', sans-serif" }}>
//         {/* Animated background gradient */}
//         <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f]/5 via-transparent to-[#c59d5f]/5 opacity-50" />

//         {/* Floating particles effect */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div
//             className="absolute w-2 h-2 bg-[#c59d5f]/30 rounded-full animate-float-1"
//             style={{ top: "20%", left: "10%" }}
//           />
//           <div
//             className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-2"
//             style={{ top: "60%", left: "80%" }}
//           />
//           <div
//             className="absolute w-1.5 h-1.5 bg-[#c59d5f]/20 rounded-full animate-float-3"
//             style={{ top: "40%", left: "60%" }}
//           />
//         </div>

//         <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-8 relative z-10">
//           {/* Enhanced Left Logo + Location */}
//           <div className="flex items-center group">
//             <div className="relative">
//               {/* Glow effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-lg blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

//               <div className="relative border-2 rounded-lg w-10 h-10 flex items-center justify-center mr-3 border-white/60 hover:border-[#c59d5f] transition-all duration-300 bg-black/30 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3">
//                 <span className="text-lg font-bold bg-gradient-to-r from-white to-[#c59d5f] bg-clip-text text-transparent">
//                   B
//                 </span>
//               </div>
//             </div>

//             <div className="relative">
//               <span className="hidden sm:inline font-bold text-xl text-white tracking-wide group-hover:text-[#c59d5f] transition-colors duration-300">
//                 BELLE FEMME
//               </span>
//               {/* Underline animation */}
//               <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] group-hover:w-full transition-all duration-500" />
//             </div>
//             <LocationSelectorPanel />
//           </div>

//           {/* Improved Center Nav (Desktop) */}
//           <nav className="flex-1 justify-center hidden lg:flex">
//             <ul className="flex space-x-6 uppercase font-semibold tracking-wider text-sm relative text-white">
//               {NAV_LINKS.map((link) => {
//                 const isActive = pathname === link.href;
//                 return (
//                   <li key={link.href} className="relative">
//                     <Link
//                       href={link.href}
//                       className={`${
//                         isActive ? "text-[#c59d5f]" : "text-white"
//                       } relative px-2 py-1 inline-block transition-all duration-200 hover:text-[#c59d5f]`}>
//                       {link.label}
//                       {/* Enhanced underline for active link */}
//                       <span
//                         className={`absolute left-0 right-0 -bottom-1 h-0.5 rounded-full transition-all duration-300 ${
//                           isActive
//                             ? "bg-[#c59d5f] w-full scale-x-100"
//                             : "bg-[#c59d5f]/70 w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100"
//                         }`}
//                       />
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           {/* Enhanced Right Icons (Desktop) */}
//           <div
//             id="cart-icon"
//             className="hidden lg:flex items-center text-xl relative text-white h-[80px] space-x-1">
//             <CartPopup />
//             <ProfileDropdown />
//           </div>
//           <div
//             id="cart-icon"
//             className="lg:hidden flex items-center text-xl relative text-white gap-5">
//             <CartPopup />
//             <MobileMenu navLinks={NAV_LINKS} />
//           </div>

//           {/* Mobile Menu */}
//         </div>

//         {/* Bottom glow line */}
//         <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c59d5f]/50 to-transparent" />
//       </header>

//       {/* Enhanced Animations */}
//       <style jsx>{`
//         @keyframes float-1 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-20px) rotate(180deg);
//           }
//         }
//         @keyframes float-2 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-15px) rotate(-180deg);
//           }
//         }
//         @keyframes float-3 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-25px) rotate(90deg);
//           }
//         }
//         .animate-float-1 {
//           animation: float-1 6s ease-in-out infinite;
//         }
//         .animate-float-2 {
//           animation: float-2 8s ease-in-out infinite;
//         }
//         .animate-float-3 {
//           animation: float-3 7s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LocationSelectorPanel from "../ui/LocationSelectorPanel";
import CartPopup from "../ui/CartPopup";
import ProfileDropdown from "../ui/ProfileDropdown";
import MobileMenu from "../ui/MobileMenu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gift Card", href: "/gifts" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Re-instated the full scroll logic to handle visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state for basic style changes
      setScrolled(currentScrollY > 0);

      // Determine visibility for hide/show effect on larger screens
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`w-full left-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? // When scrolled, this complex class applies:
              // - Default (mobile/tablet): It's fixed at the top (`top-0`).
              // - Desktop (`lg:`): The top position depends on the `isVisible` state, creating the hide/show effect.
              `fixed top-0 ${
                isVisible ? "lg:top-0" : "lg:-top-24"
              } backdrop-blur-xl bg-black/90 shadow-2xl border-b border-white/10`
            : // When not scrolled, it's positioned absolutely at the top.
              "absolute top-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-md"
        }`}
        style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f]/5 via-transparent to-[#c59d5f]/5 opacity-50" />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-2 h-2 bg-[#c59d5f]/30 rounded-full animate-float-1"
            style={{ top: "20%", left: "10%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-2"
            style={{ top: "60%", left: "80%" }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-[#c59d5f]/20 rounded-full animate-float-3"
            style={{ top: "40%", left: "60%" }}
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-8 relative z-10">
          {/* Enhanced Left Logo + Location */}
          <div className="flex items-center group">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] rounded-lg blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

              <div className="relative border-2 rounded-lg w-10 h-10 flex items-center justify-center mr-3 border-white/60 hover:border-[#c59d5f] transition-all duration-300 bg-black/30 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg font-bold bg-gradient-to-r from-white to-[#c59d5f] bg-clip-text text-transparent">
                  B
                </span>
              </div>
            </div>

            <div className="relative">
              <span className="hidden sm:inline font-bold text-xl text-white tracking-wide group-hover:text-[#c59d5f] transition-colors duration-300">
                BELLE FEMME
              </span>
              {/* Underline animation */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] group-hover:w-full transition-all duration-500" />
            </div>
            <LocationSelectorPanel />
          </div>

          {/* Improved Center Nav (Desktop) */}
          <nav className="flex-1 justify-center hidden lg:flex">
            <ul className="flex space-x-6 uppercase font-semibold tracking-wider text-sm relative text-white">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={`${
                        isActive ? "text-[#c59d5f]" : "text-white"
                      } relative px-2 py-1 inline-block transition-all duration-200 hover:text-[#c59d5f]`}>
                      {link.label}
                      {/* Enhanced underline for active link */}
                      <span
                        className={`absolute left-0 right-0 -bottom-1 h-0.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-[#c59d5f] w-full scale-x-100"
                            : "bg-[#c59d5f]/70 w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Enhanced Right Icons (Desktop) */}
          <div
            id="cart-icon"
            className="hidden lg:flex items-center text-xl relative text-white h-[80px] space-x-1">
            <CartPopup />
            <ProfileDropdown />
          </div>
          <div
            id="cart-icon"
            className="lg:hidden flex items-center text-xl relative text-white gap-5">
            <CartPopup />
            <MobileMenu navLinks={NAV_LINKS} />
          </div>

          {/* Mobile Menu */}
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c59d5f]/50 to-transparent" />
      </header>

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }
        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(90deg);
          }
        }
        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
