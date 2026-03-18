"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);

  // Responsive: Adjust visible items based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleItems(1);
      else if (window.innerWidth < 1024) setVisibleItems(2);
      else setVisibleItems(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play (pauses on hover handled by parent logic if needed, simple interval here)
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000); // Slow, premium rotation
    return () => clearInterval(timer);
  }, []);

  // Calculate visible cards based on circular index
  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < visibleItems; i++) {
      const itemIndex = (index + i) % testimonials.length;
      cards.push(testimonials[itemIndex]);
    }
    return cards;
  };

  return (
    <section className="py-24 bg-slate-800 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-900/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary-800/20 rounded-full blur-[100px]" />

      <div className="container relative z-10">
        <SectionHeader
          title="Voices of Zenith"
          subtitle="Guest Stories"
          center={true}
          light={true} 
          className="mb-16"
        />

        <div className="relative">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {getVisibleCards().map((item, i) => (
                <motion.div
                  key={item.uId} // Key must be unique to trigger animation
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.9 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.1,
                  }}
                  className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-lg relative group hover:border-primary-500/50 transition-colors duration-500"
                >
                  {/* Giant Quote Icon */}
                  <Quote className="absolute top-6 right-6 text-white/5 w-16 h-16 group-hover:text-primary-500/10 transition-colors duration-500 rotate-180" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        size={14}
                        className={cn(
                          starIdx < item.rating
                            ? "fill-primary-500 text-primary-500"
                            : "fill-white/10 text-white/10",
                        )}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <div className="mb-8 min-h-30">
                    <p className="font-display text-lg md:text-xl text-white/90 leading-relaxed italic">
                      "{item.comment}"
                    </p>
                  </div>

                  {/* Profile */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-secondary-900 font-bold font-display text-lg">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white tracking-wide">
                        {item.name}
                      </h4>
                      <p className="text-xs text-primary-400 font-medium uppercase tracking-widest mb-1">
                        {item.profession}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-white/40">
                        <MapPin size={10} /> {item.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-12">
            {/* Progress Bar */}
            <div className="flex-1 max-w-xs hidden md:flex gap-2">
              {testimonials.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1 rounded-full flex-1 transition-all duration-500",
                    idx === index ? "bg-primary-500" : "bg-white/10",
                  )}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 ml-auto">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-secondary-900 transition-all active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-secondary-900 transition-all active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
