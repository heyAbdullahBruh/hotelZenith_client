"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Star, Flame, Leaf, Clock, Eye } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore"; // Check your store path
import { cn } from "@/lib/utils";

export default function FoodCard({ food }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to the modal
    e.stopPropagation();
    await addItem(food._id, 1);
  };

  const displayImage = food.images?.[0] || "/images/placeholder-food.jpg";

  return (
    <Link href={`/menu/${food._id}`} scroll={false} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="group bg-white rounded-lg shadow-sm hover:shadow-zenith transition-all duration-300 overflow-hidden border border-secondary-100 flex flex-col h-full relative"
      >
        {/* Quick View Overlay (Appears on Hover) */}
        <div className="absolute inset-0 bg-secondary-900/0 group-hover:bg-secondary-900/10 z-10 transition-colors duration-300 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 scale-90 group-hover:scale-100">
          <span className="bg-white/90 backdrop-blur text-secondary-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
            <Eye size={14} /> Quick View
          </span>
        </div>

        {/* Image Container */}
        <div className="relative h-60 w-full overflow-hidden bg-secondary-100">
          <Image
            src={displayImage}
            alt={food.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Availability Badge */}
          {!food.isAvailable && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm">
                Sold Out
              </span>
            </div>
          )}

          {/* Tags Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
            {food.isVegetarian && (
              <span
                className="bg-green-500 text-white p-1.5 rounded-md shadow-sm"
                title="Vegetarian"
              >
                <Leaf size={12} />
              </span>
            )}
            {food.isSpicy && (
              <span
                className="bg-red-500 text-white p-1.5 rounded-md shadow-sm"
                title="Spicy"
              >
                <Flame size={12} />
              </span>
            )}
            {food.preparationTime && (
              <span className="bg-white/90 text-secondary-900 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
                <Clock size={10} /> {food.preparationTime}m
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 bg-white relative z-20">
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
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary-900 hover:text-white bg-secondary-100 hover:bg-secondary-900 px-3 py-2 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              {food.isAvailable ? "Add" : "Out"}
              <Plus
                size={14}
                className="group-hover/btn:rotate-90 transition-transform"
              />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
