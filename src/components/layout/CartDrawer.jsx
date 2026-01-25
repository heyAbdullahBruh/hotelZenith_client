"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartDrawer() {
  const {
    isOpen,
    setOpen,
    items,
    summary,
    removeItem,
    updateQuantity, // Make sure this exists in your store (calling PUT endpoint)
    isLoading,
  } = useCartStore();

  const [modifyingId, setModifyingId] = useState(null);

  // Helper to handle quantity changes with loading state
  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) {
      handleRemove(cartItemId);
      return;
    }
    setModifyingId(cartItemId);
    await updateQuantity(cartItemId, newQty);
    setModifyingId(null);
  };

  const handleRemove = async (cartItemId) => {
    setModifyingId(cartItemId);
    await removeItem(cartItemId);
    setModifyingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm z-60"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-70 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-secondary-100 flex items-center justify-between bg-secondary-50">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-secondary-900">
                  <ShoppingBag size={20} /> Your Order
                </h2>
                <p className="text-xs text-secondary-500 mt-1">
                  {summary.itemCount} items in cart
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-secondary-400 hover:text-secondary-900"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-secondary-400 text-center space-y-4">
                  <div className="bg-secondary-50 p-6 rounded-full">
                    <ShoppingBag
                      size={48}
                      className="opacity-20 text-secondary-900"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-secondary-900">
                    Your cart is empty
                  </h3>
                  <p className="text-sm max-w-200px">
                    Looks like you haven't added any delicious items yet.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 text-primary-600 font-bold uppercase text-xs tracking-widest hover:underline"
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  // Safety check in case food was deleted but cart item remains
                  if (!item.food) return null;

                  const isUpdating = modifyingId === item._id;
                  const itemTotal = item.food.price * item.quantity;
                  const imageUrl =
                    item.food.images?.[0] || "/images/placeholder-food.jpg";

                  return (
                    <div
                      key={item._id}
                      className={`group relative flex gap-4 transition-opacity ${isUpdating ? "opacity-50" : "opacity-100"}`}
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-secondary-100 rounded-lg overflow-hidden shrink-0 relative border border-secondary-200">
                        <Image
                          src={imageUrl}
                          alt={item.food.name}
                          fill
                          className="object-cover"
                        />
                        {!item.food.isAvailable && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold uppercase">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-display font-bold text-secondary-900 line-clamp-1 text-base">
                              {item.food.name}
                            </h3>
                            <p className="font-bold text-sm text-primary-600">
                              {formatCurrency(itemTotal)}
                            </p>
                          </div>

                          {/* Unit Price & Instructions */}
                          <div className="text-xs text-secondary-500 mt-1">
                            <span>{formatCurrency(item.food.price)} each</span>
                            {item.specialInstructions && (
                              <p className="mt-1 text-secondary-400 italic line-clamp-1 border-l-2 border-primary-200 pl-2">
                                "{item.specialInstructions}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-secondary-200 rounded-md bg-white shadow-sm h-8">
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity - 1,
                                )
                              }
                              className="px-2 h-full hover:bg-secondary-50 text-secondary-600 disabled:cursor-not-allowed"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-secondary-900">
                              {isUpdating ? (
                                <Loader2
                                  size={12}
                                  className="animate-spin mx-auto"
                                />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              disabled={isUpdating || !item.food.isAvailable}
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity + 1,
                                )
                              }
                              className="px-2 h-full hover:bg-secondary-50 text-secondary-600 disabled:cursor-not-allowed"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item._id)}
                            className="text-xs text-secondary-400 hover:text-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Unavailable Warning */}
                      {!item.food.isAvailable && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="text-center">
                            <AlertCircle
                              className="mx-auto text-red-500 mb-1"
                              size={24}
                            />
                            <p className="text-xs font-bold text-red-600">
                              Item Unavailable
                            </p>
                            <button
                              onClick={() => handleRemove(item._id)}
                              className="text-xs underline text-secondary-600 mt-1"
                            >
                              Remove Item
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-secondary-100 bg-secondary-50 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-secondary-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(summary.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-secondary-500">
                    <span>Tax (Est.)</span>
                    <span>{formatCurrency(summary.tax || 0)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-display font-bold text-secondary-900 pt-4 border-t border-secondary-200">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {formatCurrency(summary.total || 0)}
                  </span>
                </div>

                <Link
                  href="/cart/checkout"
                  onClick={() => setOpen(false)}
                  className="group relative block w-full bg-secondary-900 text-white text-center py-4 font-bold uppercase tracking-widest rounded-sm overflow-hidden"
                >
                  <span className="relative z-10 group-hover:text-primary-400 transition-colors">
                    Proceed to Checkout
                  </span>
                  <div className="absolute inset-0 bg-secondary-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
