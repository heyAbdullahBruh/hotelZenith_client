import { create } from "zustand";
import { persist } from "zustand/middleware";

// We use 'persist' so cart count survives a page refresh until we fetch fresh data
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      total: 0,
      isOpen: false, // For the Cart Drawer UI

      // Actions
      setOpen: (state) => set({ isOpen: state }),

      // We will implement full API integration in Phase 3
      updateCartCount: (count) => set({ count }),

      // Optimistic update example
      addItemOptimistic: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: "hotel-zenith-cart",
      partialize: (state) => ({ count: state.count }), // Only persist count for UI speed
    },
  ),
);
