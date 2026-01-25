"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Star, Clock, Flame, Leaf } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";

export default function FoodCard({ food }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Pass food._id because MongoDB uses underscore
    await addItem(food._id);
  };

  // Safe image handling (Backend sends array of strings)
  const displayImage =
    food.images && food.images.length > 0
      ? food.images[0]
      : "/images/placeholder-food.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-zenith transition-all duration-300 overflow-hidden border border-secondary-100 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-secondary-100">
        <Image
          src={displayImage}
          alt={food.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Availability Badge */}
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">
              Sold Out
            </span>
          </div>
        )}

        {/* Tags Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
          {food.isVegetarian && (
            <span
              className="bg-green-500/90 text-white p-1.5 rounded-md"
              title="Vegetarian"
            >
              <Leaf size={12} />
            </span>
          )}
          {food.isSpicy && (
            <span
              className="bg-red-500/90 text-white p-1.5 rounded-md"
              title="Spicy"
            >
              <Flame size={12} />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {food.name}
          </h3>
          <span className="font-display text-lg font-bold text-primary-600 whitespace-nowrap ml-2">
            ${food.price}
          </span>
        </div>

        <p className="text-secondary-500 text-xs line-clamp-2 mb-4 flex-1">
          {food.description}
        </p>

        <div className="flex items-center justify-between border-t border-secondary-100 pt-4 mt-auto">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-secondary-900">
              {food.rating?.toFixed(1) || "New"}
            </span>
            <span className="text-[10px] text-secondary-400">
              ({food.totalRatings})
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!food.isAvailable}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary-900 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {food.isAvailable ? "Add" : "Unavailable"} <Plus size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
