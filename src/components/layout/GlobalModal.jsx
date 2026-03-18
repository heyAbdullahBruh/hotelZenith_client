"use client";
import { useUIStore } from "@/lib/store/uiStore";
import FoodModal from "@/components/shared/FoodModal";
import { AnimatePresence } from "framer-motion";

export default function GlobalModal() {
  const { selectedFood, closeFoodModal } = useUIStore();

  return (
    <AnimatePresence>
      {selectedFood && (
        <FoodModal food={selectedFood} onClose={closeFoodModal} />
      )}
    </AnimatePresence>
  );
}
