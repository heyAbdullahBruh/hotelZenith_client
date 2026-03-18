"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Star,
  ChefHat,
  Wine,
} from "lucide-react";

// --- Configuration ---
const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const exploreLinks = [
  { name: "Culinary Menu", href: "/menu", icon: ChefHat },
  { name: "Table Reservations", href: "/bookings/table", icon: Star },
  { name: "Private Dining", href: "/bookings/event", icon: Wine },
  { name: "Gift Experiences", href: "/gift-cards", icon: Star },
];

const companyLinks = [
  { name: "Our Heritage", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Press Room", href: "/press" },
  { name: "Contact", href: "/contact" },
];

const contactDetails = [
  { icon: MapPin, text: "123 Luxury Ave, Manhattan, NY 10012" },
  { icon: Phone, text: "+1 (888) 000-ZENITH" },
  { icon: Mail, text: "concierge@hotelzenith.com" },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#050505] text-white overflow-hidden border-t border-white/5">
      {/* --- Ambient Lighting Effects --- */}
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-primary-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-150 h-100 bg-blue-900/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10 pt-24 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* --- TOP ROW: Brand & VIP Newsletter --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24 border-b border-white/5 pb-16">
            {/* Brand Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 space-y-8"
            >
              <div className="space-y-4">
                <h2 className="font-display text-5xl font-bold tracking-tight text-white">
                  HOTEL<span className="text-primary-500 italic">ZENITH</span>
                </h2>
                <p className="text-white/50 text-lg leading-relaxed font-light max-w-md">
                  A sanctuary where culinary artistry meets exceptional
                  hospitality. Defining the standard of luxury since 1985.
                </p>
              </div>

              {/* Social Icons - Magnetic Hover */}
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    className="group relative w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:border-primary-500/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <social.icon
                      size={18}
                      className="relative z-10 text-white/70 group-hover:text-white transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Card */}
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 md:p-10 backdrop-blur-sm">
                {/* Subtle sheen animation */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-primary-500/20 blur-[50px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold text-white">
                      Join the Inner Circle
                    </h3>
                    <p className="text-white/40 text-sm max-w-62.5">
                      Subscribe for exclusive tasting menus, private event
                      invites, and seasonal offers.
                    </p>
                  </div>

                  <form className="w-full md:w-auto flex-1 flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-black/20 border border-white/10 rounded-sm px-4 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button className="bg-primary-500 text-white px-8 py-4 rounded-sm font-bold uppercase text-[11px] tracking-widest hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 group">
                      Subscribe{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- MIDDLE ROW: Links & Info --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
            {/* Exploration Links */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="font-display text-lg text-white">Experience</h4>
              <ul className="space-y-4">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors"
                    >
                      <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                        <link.icon size={14} />
                      </span>
                      <span className="text-sm tracking-wide">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="font-display text-lg text-white">The Hotel</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-white/50 hover:text-primary-400 transition-colors text-sm"
                    >
                      <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-primary-500 transition-colors" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Details */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="font-display text-lg text-white">Concierge</h4>
              <ul className="space-y-6">
                {contactDetails.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex gap-4 text-sm text-white/60 group"
                  >
                    <detail.icon
                      size={18}
                      className="text-primary-500 shrink-0 mt-0.5 group-hover:text-white transition-colors"
                    />
                    <span className="leading-relaxed">{detail.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Hours Widget */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="font-display text-lg text-white">Opening Hours</h4>
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                {[
                  { day: "Mon - Thu", time: "11:00 AM - 10:00 PM" },
                  { day: "Fri - Sat", time: "11:00 AM - 11:30 PM" },
                  { day: "Sunday", time: "10:00 AM - 09:00 PM" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm pb-3 border-b border-white/5 last:border-0 last:pb-0"
                  >
                    <span className="text-white/80">{item.day}</span>
                    <span className="text-primary-400 font-mono text-xs">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* --- BOTTOM ROW: Footer Meta --- */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 relative z-20"
          >
            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-[11px] text-white/30 uppercase tracking-wider font-medium mb-4 md:mb-0">
              <span>&copy; {currentYear} Hotel Zenith</span>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>

            <button
              onClick={handleScrollToTop}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-500 hover:text-white transition-colors"
            >
              Back to Top <ArrowRight size={14} className="-rotate-90" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* --- GIANT WATERMARK TEXT --- */}
      {/* This sits behind everything at the very bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none z-0">
        <h1 className="font-display font-black text-[15vw] leading-[0.75] text-center text-white/2 tracking-tighter whitespace-nowrap translate-y-[20%]">
          HOTEL ZENITH
        </h1>
      </div>
    </footer>
  );
}
