import { create } from 'zustand';

export const useUIStore = create((set) => ({
  selectedFood: null,
  
  // Actions
  openFoodModal: (food) => set({ selectedFood: food }),
  closeFoodModal: () => set({ selectedFood: null }),
}));