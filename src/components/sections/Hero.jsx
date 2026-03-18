"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background - Replace with <video> tag for production */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-secondary-900/40 z-10" />{" "}
        {/* Overlay */}
        <div
          className="w-full h-full bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070')",
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 text-center text-white">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="block font-medium tracking-[0.3em] uppercase text-sm mb-6 text-primary-400"
        >
          Welcome to Hotel Zenith
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
        >
          Taste the <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-200 to-primary-500">
            Extraordinary
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-6 justify-center"
        >
          <Link
            href="/bookings/table"
            className="group relative px-8 py-4 flex items-center justify-center border border-white/10 rounded-sm uppercase tracking-widest text-sm font-bold bg-primary-500 hover:border-primary-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10 text-white/70 group-hover:text-amber-400 transition-colors">
              Book a Table
            </span>
          </Link>
          <Link
            href="/menu"
            className="border border-white hover:text-secondary-900 text-white px-8 py-4 uppercase tracking-widest text-sm font-bold transition-all group relative flex items-center justify-center bg-white/2 hover:border-primary-500/50 duration-300 overflow-hidden rounded-sm"
          >
            <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10  text-amber-400 group-hover:text-white/70 transition-colors">
              View Menu
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
