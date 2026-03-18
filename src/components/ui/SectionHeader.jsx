"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeader({
  title,
  subtitle,
  center = true,
  className,
}) {
  return (
    <div
      className={cn("mb-12", center ? "text-center" : "text-left", className)}
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-primary-500 font-medium tracking-[0.2em] text-xs uppercase block mb-3"
      >
        {subtitle}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className="font-display text-4xl md:text-5xl text-secondary-900 font-bold"
      >
        {title}
      </motion.h2>
      <div
        className={cn("h-1 w-20 bg-primary-500 mt-6", center ? "mx-auto" : "")}
      />
    </div>
  );
}
