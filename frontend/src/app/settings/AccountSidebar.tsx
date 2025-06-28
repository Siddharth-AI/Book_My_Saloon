"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Import the Link component
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Gift,
  Pencil,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAppDispatch } from "../store/hook";
import { logoutUser } from "../store/slices/authSlice";
import { clearCart } from "../store/slices/cartSlice";

const NAV_LINKS = [
  { id: "profile", href: "/settings/profile", label: "Profile", icon: User },
  {
    id: "appointments",
    href: "/settings/appointments/upcoming",
    label: "My Appointments",
    icon: Calendar,
  },
  {
    id: "giftcards",
    href: "/settings/giftcards",
    label: "My Giftcards",
    icon: Gift,
  },
  {
    id: "change-password",
    href: "/settings/change-password",
    label: "Change Password",
    icon: Pencil,
  },
];

const HELP_LINKS = [
  { id: "faqs", href: "/settings/faq", label: "FAQs", icon: HelpCircle },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const Router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path.startsWith("/settings/appointments")) {
      return pathname.startsWith("/settings/appointments");
    }
    return pathname === path;
  };
  const activeLink = [...NAV_LINKS, ...HELP_LINKS].find((link) =>
    isActive(link.href)
  );

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCart());
      Router.push("/");
    } catch (error) {
      console.log("❌ Logout error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavigationList = () => (
    <nav className="p-2">
      <ul className="space-y-1">
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.id}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  active
                    ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-semibold shadow-lg shadow-[#c59d5f]/20"
                    : "text-gray-300 hover:bg-white/10"
                }`}>
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-white/10 my-4"></div>
      <ul className="space-y-1">
        {HELP_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.id}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  active
                    ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-semibold shadow-lg shadow-[#c59d5f]/20"
                    : "text-gray-300 hover:bg-white/10"
                }`}>
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="w-full">
      <div className="hidden lg:block bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-black/50 border-b border-white/10">
          <h2 className="text-xl font-bold">Account</h2>
        </div>
        <NavigationList />
      </div>
      <div ref={dropdownRef} className="relative lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            {activeLink ? (
              <activeLink.icon size={20} className="text-[#c59d5f]" />
            ) : (
              <User size={20} />
            )}
            <span className="font-bold text-lg">
              {activeLink ? activeLink.label : "Account Menu"}
            </span>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`absolute top-full mt-2 w-full bg-[#1c1c22] rounded-2xl border-2 border-white/10 overflow-hidden shadow-2xl z-50 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}>
          <NavigationList />
        </div>
      </div>
    </div>
  );
}
