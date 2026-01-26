"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  ChevronDown,
  Utensils,
  Calendar,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/useCartStore";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Menu", href: "/menu" },
  { name: "Events", href: "/bookings/event" },
  { name: "Contact", href: "/contact" },
];

const userLinks = [
  { name: "My Dashboard", href: "/bookings/my-bookings", icon: Calendar },
  { name: "My Orders", href: "/my-orders", icon: Utensils },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const count = useCartStore((state) => state?.items?.length);
  const openCart = useCartStore((state) => state.setOpen);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- FIX: Lock Body Scroll when Menu is Open ---
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
          isScrolled
            ? "bg-secondary-900/90 backdrop-blur-md py-3 shadow-xl border-white/5"
            : "bg-secondary-900/30 py-6",
        )}
      >
        <div className="container flex items-center justify-between">
          {/* --- LOGO --- */}
          <Link href="/" className="relative z-50 group">
            <span
              className={cn(
                "font-display text-2xl font-bold tracking-wider transition-colors duration-300",
                "text-white",
              )}
            >
              HOTEL
              <span className="text-primary-500 group-hover:text-primary-400 transition-colors">
                ZENITH
              </span>
            </span>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-xs uppercase tracking-widest font-bold transition-all hover:text-primary-500 relative py-2",
                    pathname === link.href
                      ? "text-primary-500"
                      : "text-white/80",
                  )}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="w-px h-6 bg-white/20 mx-2" />

            <div className="flex items-center gap-4">
              {/* User Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-white/80 hover:text-primary-500 transition-colors py-2">
                  <User size={20} />
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      isUserMenuOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-0 w-48 bg-white rounded-md shadow-xl border-t-2 border-primary-500 py-2 overflow-hidden"
                    >
                      {userLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 transition-colors"
                        >
                          <link.icon size={16} />
                          {link.name}
                        </Link>
                      ))}
                      <div className="h-px bg-secondary-100 my-1" />
                      
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Cart */}
              <button
                onClick={() => openCart(true)}
                className="relative p-2 text-white/80 hover:text-primary-500 transition-colors"
              >
                <ShoppingBag size={22} />
                <AnimatePresence>
                  {mounted && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <Link
                href="/bookings/table"
                className="ml-2 bg-white text-secondary-900 px-5 py-2.5 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none translate-x-0 hover:translate-x-2px hover:translate-y-2px"
              >
                Book Table
              </Link>
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => openCart(true)}
              className="relative p-2 text-white hover:text-primary-500 transition-colors"
            >
              <ShoppingBag size={24} />
              {mounted && count > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {/* Only show Menu icon here. The Close icon is now inside the drawer */}
            <button
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER (MOVED OUTSIDE NAV IF POSSIBLE, OR HIGH Z-INDEX) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - z-index 50 (same as nav) to cover page, but below drawer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-secondary-900/80 backdrop-blur-sm z-55 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer - z-index 60 to sit ON TOP of navbar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-300px bg-secondary-900 border-l border-white/10 z-60 flex flex-col lg:hidden overflow-y-auto shadow-2xl"
            >
              {/* Internal Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="text-white font-display font-bold text-xl">
                  MENU
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8 flex-1">
                {/* Main Links */}
                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "font-display text-2xl text-white hover:text-primary-500 transition-colors flex items-center justify-between group",
                        pathname === link.href && "text-primary-500",
                      )}
                    >
                      {link.name}
                      <span className="w-0 group-hover:w-8 h-px bg-primary-500 transition-all duration-300" />
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* User Links Mobile */}
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-widest text-secondary-500 font-bold mb-4">
                    My Account
                  </p>
                  {userLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 text-white/80 hover:text-primary-500 transition-colors"
                    >
                      <link.icon size={20} />
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-8 bg-secondary-800">
                <Link
                  href="/bookings/table"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full bg-primary-500 text-white py-4 font-bold uppercase tracking-widest hover:bg-primary-600 transition-colors"
                >
                  Book a Table
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
