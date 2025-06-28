"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { openModal } from "@/app/store/slices/modalSlice";
import { logoutUser } from "@/app/store/slices/authSlice";
import { clearCart } from "@/app/store/slices/cartSlice";

interface MobileMenuProps {
  navLinks: Array<{ label: string; href: string }>;
}

export default function MobileMenu({ navLinks }: MobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const Router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  // console.log(user, "mobile menu======================");
  // Prevent body scroll when menu is open and ensure full height
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCart());
      Router.push("/");
    } catch (error) {
      console.log("❌ Logout error:", error);
    }
  };

  return (
    <>
      {/* Enhanced Hamburger Icon */}
      <button
        className="lg:hidden relative p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c59d5f]/30 transition-all duration-300 text-white focus:outline-none group overflow-hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open Menu">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <FiMenu className="relative z-10 text-xl group-hover:text-[#c59d5f] transition-colors duration-300" />

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </button>

      {/* FIXED: Full Screen Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          style={{ height: "100vh", width: "100vw" }}>
          {/* Enhanced Overlay */}
          <div
            className="flex-1 bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            style={{ height: "100vh" }}
          />

          {/* Enhanced Drawer */}
          <div
            className="w-80 bg-black/95 backdrop-blur-xl shadow-2xl flex flex-col animate-fadeInRight border-l border-white/10"
            style={{ height: "100vh" }}>
            {/* Enhanced Header */}
            <div className="relative flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-[#c59d5f]/10 to-transparent flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#c59d5f] rounded-full animate-pulse" />
                <span className="text-white font-bold text-lg">Menu</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 group"
                aria-label="Close">
                <FiX className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Navigation Links */}
            <div
              className="flex-1 overflow-y-auto p-6"
              style={{ height: "calc(100vh - 200px)" }}>
              <ul className="space-y-2">
                {navLinks.map((link, index) => (
                  <li
                    key={link.href}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        pathname === link.href
                          ? "bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border border-[#c59d5f]/30 text-[#c59d5f]"
                          : "text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                      }`}>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      <span className="font-medium">{link.label}</span>
                      <FiChevronRight
                        className={`transition-all duration-300 ${
                          pathname === link.href
                            ? "text-[#c59d5f]"
                            : "text-gray-500 group-hover:text-[#c59d5f]"
                        }`}
                      />
                    </Link>
                  </li>
                ))}
                {/* Enhanced Auth Section */}
                {!user ? (
                  <li
                    className="animate-fadeIn"
                    style={{ animationDelay: `${navLinks.length * 100}ms` }}>
                    <div
                      className="w-full flex items-center justify-between p-4 rounded-xl text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 group relative overflow-hidden"
                      onClick={() => {
                        dispatch(openModal("password"));
                        setMobileMenuOpen(false);
                      }}>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      <div className="flex items-center space-x-3 relative z-10">
                        <span className="font-medium">Login/Singup</span>
                      </div>
                      <FiChevronRight className="text-gray-500 group-hover:text-[#c59d5f] transition-colors duration-300" />
                    </div>
                  </li>
                ) : (
                  <>
                    <li
                      className="animate-fadeIn"
                      style={{ animationDelay: `${navLinks.length * 100}ms` }}>
                      <Link
                        href="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-between p-4 rounded-xl text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="flex items-center space-x-3 relative z-10">
                          <span className="font-medium">Accounts</span>
                        </div>
                        <FiChevronRight className="text-gray-500 group-hover:text-[#c59d5f] transition-colors duration-300" />
                      </Link>
                    </li>
                    <li
                      className="animate-fadeIn"
                      style={{ animationDelay: `${navLinks.length * 100}ms` }}>
                      <div
                        className="w-full flex items-center justify-between p-4 rounded-xl text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 group relative overflow-hidden"
                        onClick={() => handleLogout()}>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="flex items-center space-x-3 relative z-10">
                          <span className="font-medium">Logout</span>
                        </div>
                        <FiChevronRight className="text-gray-500 group-hover:text-[#c59d5f] transition-colors duration-300" />
                      </div>
                    </li>
                  </>
                )}
              </ul>
              <div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    Belle Femme
                    <br />
                    <span className="text-[#c59d5f]">
                      Premium Beauty Experience
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Auth Section */}
            {/* {!user && (
              <div className="p-6 bg-gradient-to-r from-black/80 to-black/60 border-t border-white/10 flex-shrink-0">
                <div className="space-y-3 mb-32"> */}
            {/* Login Button */}
            {/* <button className="w-full flex items-center justify-center space-x-3 p-4 text-white font-semibold hover:shadow-xl hover:shadow-[#c59d5f]/40 transition-all duration-300 transform hover:scale-105 group">
                    <FiUser className="group-hover:scale-110 transition-transform duration-300" />
                    <span>Login/Singup</span>
                  </button>
                </div> */}

            {/* Footer */}
            {/* <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    Belle Femme
                    <br />
                    <span className="text-[#c59d5f]">
                      Premium Beauty Experience
                    </span>
                  </p>
                </div> */}
            {/* </div> */}
            {/* )} */}
          </div>
        </div>
      )}

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </>
  );
}
