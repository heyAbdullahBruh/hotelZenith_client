"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Star, Leaf, Flame, Clock, Minus, Plus, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/useCartStore";
import { cn } from "@/lib/utils";

export default function FoodModal({ food, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(food.images?.[0]);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  // Discount Logic
  const hasDiscount = food.discount && food.discount > 0;
  const originalPrice = food.price;
  const discountedPrice = hasDiscount
    ? originalPrice - originalPrice * (food.discount / 100)
    : originalPrice;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addItem(food._id, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full text-secondary-900 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>

        {/* LEFT: Image Gallery */}
        <div className="w-full md:w-1/2 bg-secondary-50 p-6 flex flex-col">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-sm mb-4">
            <Image
              src={activeImage || "/images/placeholder-food.jpg"}
              alt={food.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasDiscount && (
                <span className="bg-primary-500 text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                  <Tag size={12} /> {food.discount}% OFF
                </span>
              )}
              <div className="flex gap-2">
                {food.isVegetarian && (
                  <span className="bg-green-500 text-white p-2 rounded-md shadow-sm">
                    <Leaf size={16} />
                  </span>
                )}
                {food.isSpicy && (
                  <span className="bg-red-500 text-white p-2 rounded-md shadow-sm">
                    <Flame size={16} />
                  </span>
                )}
              </div>
            </div>
          </div>

          {food.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {food.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "relative w-16 h-16 shrink-0 rounded-md overflow-hidden border-2 transition-all",
                    activeImage === img
                      ? "border-primary-500 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-1 block">
                {food.category?.name || "Signature Dish"}
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-secondary-900 text-sm">
                  {food.rating || "New"}
                </span>
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold text-secondary-900 mb-2">
              {food.name}
            </h2>

            <div className="flex items-center gap-3">
              {hasDiscount && (
                <span className="text-lg text-secondary-400 line-through decoration-red-400">
                  ${originalPrice}
                </span>
              )}
              <h3
                className={cn(
                  "text-2xl font-bold",
                  hasDiscount ? "text-red-500" : "text-primary-600",
                )}
              >
                ${Number(discountedPrice).toFixed(2)}
              </h3>
            </div>
          </div>

          <p className="text-secondary-600 leading-relaxed mb-6 text-sm">
            {food.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-secondary-50 p-3 rounded-md">
              <span className="text-[10px] uppercase font-bold text-secondary-400 flex items-center gap-1 mb-1">
                <Clock size={12} /> Prep Time
              </span>
              <p className="font-bold text-secondary-900 text-sm">
                {food.preparationTime || 15} mins
              </p>
            </div>
            {food.nutritionalInfo?.calories && (
              <div className="bg-secondary-50 p-3 rounded-md">
                <span className="text-[10px] uppercase font-bold text-secondary-400 flex items-center gap-1 mb-1">
                  <Flame size={12} /> Calories
                </span>
                <p className="font-bold text-secondary-900 text-sm">
                  {food.nutritionalInfo.calories} kcal
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-secondary-100 flex items-center gap-4">
            <div className="flex items-center border border-secondary-200 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:text-primary-600 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:text-primary-600"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!food.isAvailable || isAdding}
              className="flex-1 bg-secondary-900 text-white py-3 rounded-md font-bold uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isAdding ? (
                "Adding..."
              ) : (
                <>
                  Add <span className="w-px h-4 bg-white/20 mx-2" /> $
                  {(discountedPrice * quantity).toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
