import { create } from 'zustand';
import { cartService } from '@/lib/services/cartService';
import { toast } from 'sonner';

export const useCartStore = create((set, get) => ({
  items: [],
  summary: { itemCount: 0, subtotal: 0, tax: 0, total: 0 },
  isLoading: false,
  isOpen: false,

  setOpen: (isOpen) => set({ isOpen }),

  // Fetch latest cart from backend
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const data = await cartService.get();
      set({ 
        items: data.items || [], 
        summary: data.summary || { itemCount: 0, total: 0 } 
      });
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (foodId, quantity = 1, instructions = '') => {
    const previousCount = get().summary.itemCount;
    // Optimistic UI update for badge
    set(state => ({ 
      summary: { ...state.summary, itemCount: state.summary.itemCount + quantity }
    }));

    try {
      await cartService.add(foodId, quantity, instructions);
      toast.success("Item added to cart");
      get().fetchCart(); // Re-sync with server for accurate totals
    } catch (error) {
      // Revert on failure
      set(state => ({ 
        summary: { ...state.summary, itemCount: previousCount }
      }));
      toast.error("Failed to add item");
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartService.remove(itemId);
      get().fetchCart();
      toast.success("Item removed");
    } catch (error) {
      toast.error("Could not remove item");
    }
  }
}));