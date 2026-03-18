"use client";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { label: "Years of Excellence", value: 15, suffix: "+" },
  { label: "Menu Items", value: 85, suffix: "" },
  { label: "Satisfied Guests", value: 50, suffix: "k+" },
  { label: "Award Winning Chefs", value: 12, suffix: "" },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-secondary-900 py-20 text-white">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="font-display text-4xl md:text-5xl font-bold text-primary-500">
              {isInView ? <CountUp end={stat.value} duration={2.5} /> : 0}
              {stat.suffix}
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
