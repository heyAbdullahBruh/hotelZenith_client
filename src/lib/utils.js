import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges tailwind classes intelligently (e.g., 'p-4 p-2' becomes 'p-2')
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Currency formatter
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
