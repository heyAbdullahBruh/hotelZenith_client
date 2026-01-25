'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CartDrawer() {
  const { isOpen, setOpen, items, summary, removeItem, addItem } = useCartStore();

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

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-70 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-secondary-100 flex items-center justify-between bg-secondary-50">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={20} /> Your Order ({summary.itemCount})
              </h2>
              <button onClick={() => setOpen(false)} className="text-secondary-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-secondary-400 text-center space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Your cart is empty.</p>
                  <button onClick={() => setOpen(false)} className="text-primary-500 font-bold uppercase text-sm tracking-widest hover:underline">
                    Browse Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id || item.foodId} className="flex gap-4">
                    {/* Tiny Image */}
                    <div className="w-20 h-20 bg-secondary-100 rounded-sm overflow-hidden shrink-0 relative">
                       {/* You would use Next/Image here if backend sends image URL */}
                       <div className="w-full h-full bg-secondary-200" /> 
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-display font-bold text-secondary-900 line-clamp-1">{item.name || "Food Item"}</h3>
                        <p className="font-bold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                      <p className="text-xs text-secondary-500 mb-3 line-clamp-1">{item.specialInstructions}</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-secondary-200 rounded-sm">
                          <button 
                             onClick={() => item.quantity > 1 ? addItem(item.foodId, -1) : removeItem(item._id)}
                             className="p-1 hover:bg-secondary-50 text-secondary-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                             onClick={() => addItem(item.foodId, 1)}
                             className="p-1 hover:bg-secondary-50 text-secondary-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item._id)}
                          className="text-xs text-red-400 hover:text-red-600 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-secondary-100 bg-secondary-50 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-500">Subtotal</span>
                  <span className="font-bold">{formatCurrency(summary.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-xl font-display font-bold text-secondary-900">
                  <span>Total</span>
                  <span>{formatCurrency(summary.total || 0)}</span>
                </div>
                <Link 
                  href="/cart/checkout" 
                  onClick={() => setOpen(false)}
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-4 font-bold uppercase tracking-widest rounded-sm transition-all"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}