"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/useCartStore";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Events", href: "/bookings/event" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count, setOpen } = useCartStore();

  // Scroll listener for transparent -> solid transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-secondary-900/95 backdrop-blur-md py-4 shadow-xl"
          : "bg-transparent py-6",
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <span
            className={cn(
              "font-display text-2xl font-bold tracking-wider",
              isScrolled ? "text-primary-500" : "text-white",
            )}
          >
            HOTEL<span className="text-white">ZENITH</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary-500",
                pathname === link.href ? "text-primary-500" : "text-white/90",
              )}
            >
              {link.name}
            </Link>
          ))}

          {/* Cart Icon */}
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 text-white hover:text-primary-500 transition-colors"
          >
            <ShoppingBag size={24} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Reserve Button */}
          <Link
            href="/bookings/table"
            className="bg-primary-500 text-white px-6 py-2 rounded-sm font-medium uppercase text-xs tracking-widest hover:bg-primary-600 transition-colors"
          >
            Book a Table
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-secondary-900 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-3xl text-white hover:text-primary-500"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
