"use client";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store/useCartStore";

export default function AppInitializer() {
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    // Initial fetch to ensure guestId cookie is set by backend and cart is synced
    fetchCart();
  }, [fetchCart]);

  return null; // Render nothing
}
