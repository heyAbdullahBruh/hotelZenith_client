"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { toast } from "sonner";

export default function FoodCard({ food }) {
  const addItem = useCartStore((state) => state.addItemOptimistic);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(); // Optimistic update
    toast.success(`${food.name} added to cart`);
    // In Phase 3, we connect this to the real API
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-sm shadow-sm hover:shadow-zenith transition-all duration-300 overflow-hidden border border-secondary-100"
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={food.image || "/api/placeholder/400/300"} // Fallback
          alt={food.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Diet Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          {food.isVegetarian && (
            <span className="bg-green-500/90 text-white text-[10px] px-2 py-1 uppercase tracking-wider font-bold rounded-sm">
              Veg
            </span>
          )}
          {food.isSpicy && (
            <span className="bg-red-500/90 text-white text-[10px] px-2 py-1 uppercase tracking-wider font-bold rounded-sm">
              Spicy
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
            {food.name}
          </h3>
          <span className="font-display text-lg font-bold text-primary-600">
            ${food.price}
          </span>
        </div>

        <p className="text-secondary-500 text-sm line-clamp-2 mb-4 h-10">
          {food.description}
        </p>

        <div className="flex items-center justify-between border-t border-secondary-100 pt-4">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold text-secondary-900">
              {food.rating || "4.8"}
            </span>
            <span className="text-xs text-secondary-400">
              ({food.reviews || 42})
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-900 hover:text-primary-600 transition-colors"
          >
            Add to Cart <Plus size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
