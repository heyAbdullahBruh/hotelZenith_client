"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Star, Flame, Leaf, Eye, Tag } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { cn } from "@/lib/utils";

export default function FoodCard({ food }) {
  const addItem = useCartStore((state) => state.addItem);
  const openFoodModal = useUIStore((state) => state.openFoodModal); // 2. Get open function

  // --- Discount Logic ---
  const hasDiscount = food.discount && food.discount > 0;
  const originalPrice = food.price;
  const discountedPrice = hasDiscount 
    ? (originalPrice - (originalPrice * (food.discount / 100)))
    : originalPrice;

  // --- Handlers ---
  const handleCardClick = () => {
    openFoodModal(food); // 3. Open Global Modal
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent opening modal when clicking 'Add'
    await addItem(food._id, 1);
  };

  const displayImage = food.images?.[0] || "/images/placeholder-food.jpg";

  return (
    <motion.div
      onClick={handleCardClick}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-zenith transition-all duration-300 overflow-hidden border border-secondary-100 flex flex-col h-full relative cursor-pointer"
    >
      {/* Quick View Overlay */}
      <div className="absolute inset-0 bg-secondary-900/0 group-hover:bg-secondary-900/10 z-10 transition-colors duration-300" />
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

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
           {/* Sold Out */}
           {!food.isAvailable && (
             <span className="bg-red-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
              Sold Out
             </span>
           )}
           
           {/* Discount Badge */}
           {hasDiscount && (
             <span className="bg-primary-500 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
               <Tag size={10} /> -{food.discount}%
             </span>
           )}

           {/* Dietary Icons */}
           <div className="flex gap-2">
             {food.isVegetarian && <span className="bg-green-500 text-white p-1.5 rounded-md shadow-sm"><Leaf size={12}/></span>}
             {food.isSpicy && <span className="bg-red-500 text-white p-1.5 rounded-md shadow-sm"><Flame size={12}/></span>}
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 bg-white relative z-20">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {food.name}
          </h3>
          
          {/* Price Display */}
          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-xs text-secondary-400 line-through decoration-red-400">
                ${originalPrice}
              </span>
            )}
            <span className={cn(
              "font-display text-lg font-bold ml-2",
              hasDiscount ? "text-red-500" : "text-primary-600"
            )}>
              ${Number(discountedPrice).toFixed(2)}
            </span>
          </div>
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
            <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}