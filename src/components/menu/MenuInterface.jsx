"use client";
import { useState } from "react";
import FoodCard from "@/components/shared/FoodCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Phase 2 (Before API Integration)
const MOCK_FOODS = [
  {
    id: 1,
    name: "Truffle Risotto",
    price: 34,
    description: "Arborio rice, black truffle, parmesan crisp.",
    category: "main",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
    isVegetarian: true,
  },
  {
    id: 2,
    name: "Wagyu Steak",
    price: 85,
    description: "A5 Japanese Wagyu, garlic mash, asparagus.",
    category: "main",
    image: "https://images.unsplash.com/photo-1546241072-48010ad2862c?w=800",
  },
  {
    id: 3,
    name: "Lobster Bisque",
    price: 28,
    description: "Creamy soup, chunks of maine lobster, cognac.",
    category: "starter",
    image: "https://images.unsplash.com/photo-1547592166-23acbe3b624b?w=800",
  },
  {
    id: 4,
    name: "Volcano Sushi",
    price: 22,
    description: "Spicy tuna, cucumber, topped with sriracha.",
    category: "starter",
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
  },
  {
    id: 5,
    name: "Molten Cake",
    price: 18,
    description: "Dark chocolate, vanilla bean ice cream.",
    category: "dessert",
    isVegetarian: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=800",
  },
];

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "starter", name: "Starters" },
  { id: "main", name: "Mains" },
  { id: "dessert", name: "Desserts" },
  { id: "drinks", name: "Beverages" },
];

export default function MenuInterface() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side filtering logic (Will be API calls in Phase 3)
  const filteredFoods = MOCK_FOODS.filter((food) => {
    const matchesCategory =
      activeCategory === "all" || food.category === activeCategory;
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0 space-y-8">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-sm focus:ring-primary-500 focus:border-primary-500"
          />
          <Search
            className="absolute left-3 top-3.5 text-secondary-400"
            size={18}
          />
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <SlidersHorizontal size={18} /> Filters
          </h3>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 text-left rounded-sm transition-all whitespace-nowrap",
                  activeCategory === cat.id
                    ? "bg-secondary-900 text-white shadow-lg"
                    : "bg-white text-secondary-600 hover:bg-secondary-100",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-20 text-secondary-400">
            <p className="text-xl">No items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
