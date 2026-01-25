import { create } from 'zustand';
import { cartService } from '@/lib/services/cartService';
import { toast } from 'sonner';

export const useCartStore = create((set, get) => ({
  items: [],
  summary: { itemCount: 0, subtotal: 0, tax: 0, total: 0 },
  isLoading: false,
  isOpen: false,

  setOpen: (isOpen) => set({ isOpen }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartService.get();
      // Backend returns: { success: true, data: { items: [], summary: {} } }
      if (response.success && response.data) {
        set({ 
          items: response.data.items || [], 
          summary: response.data.summary || { itemCount: 0, total: 0 } 
        });
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (foodId, quantity = 1, instructions = '') => {
    // Optimistic UI update (optional, but makes it feel fast)
    const prevSummary = get().summary;
    set(state => ({ 
      summary: { ...state.summary, itemCount: state.summary.itemCount + quantity }
    }));

    try {
      await cartService.add(foodId, quantity, instructions);
      toast.success("Item added to cart");
      await get().fetchCart(); // Re-sync with server to get exact calculations
    } catch (error) {
      // Revert optimistic update on error
      set({ summary: prevSummary });
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  },

  removeItem: async (cartItemId) => {
    try {
      await cartService.remove(cartItemId);
      toast.success("Item removed");
      get().fetchCart();
    } catch (error) {
      toast.error("Could not remove item");
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
     try {
       await cartService.update(cartItemId, quantity);
       get().fetchCart();
     } catch (error) {
       toast.error("Failed to update quantity");
     }
  },
  
  clearCart: async () => {
    try {
      await cartService.clear();
      set({ items: [], summary: { itemCount: 0, subtotal: 0, tax: 0, total: 0 } });
    } catch (error) {
       console.error(error);
    }
  }
}));