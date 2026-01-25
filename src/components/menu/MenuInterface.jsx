"use client";
import { useState, useEffect, useCallback } from "react";
import { menuService } from "@/lib/services/menuService";
import FoodCard from "@/components/shared/FoodCard";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { useDebounce } from "@/lib/hooks/useDebounce"; // You might need to create this simple hook or import a library

// --- Simple Debounce Hook Implementation (Put this in lib/hooks if you prefer) ---
function useDebounceValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function MenuInterface() {
  // --- State ---
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // --- Filters ---
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    isVegetarian: false,
    isSpicy: false,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 9,
  });

  const debouncedSearch = useDebounceValue(filters.search, 500);
  const debouncedMinPrice = useDebounceValue(filters.minPrice, 500);
  const debouncedMaxPrice = useDebounceValue(filters.maxPrice, 500);

  // --- Initial Data Load (Categories) ---
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await menuService.getCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // --- Fetch Foods when filters change ---
  const fetchFoods = useCallback(async () => {
    setIsLoading(true);
    try {
      // Construct API payload
      const queryParams = {
        ...filters,
        search: debouncedSearch,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        // Convert booleans to strings if backend expects them (or clean them if false)
        isVegetarian: filters.isVegetarian ? "true" : undefined,
        isSpicy: filters.isSpicy ? "true" : undefined,
      };

      const res = await menuService.getAll(queryParams);

      if (res.success) {
        setFoods(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch menu", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.category,
    filters.page,
    filters.isVegetarian,
    filters.isSpicy,
    filters.sortBy,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // --- Handlers ---
  const handleCategoryChange = (catId) => {
    setFilters((prev) => ({
      ...prev,
      category: catId === prev.category ? "" : catId,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      isVegetarian: false,
      isSpicy: false,
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 9,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* --- SIDEBAR FILTERS --- */}
      <aside className="w-full lg:w-72 shrink-0 bg-white p-6 rounded-lg shadow-sm border border-secondary-100 sticky top-24">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <SlidersHorizontal size={18} /> Filters
          </h3>
          <button
            onClick={clearFilters}
            className="text-xs text-primary-600 hover:underline"
          >
            Reset All
          </button>
        </div>

        <div className="space-y-8">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search dishes..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
              className="w-full pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
            <Search
              className="absolute left-3 top-2.5 text-secondary-400"
              size={16}
            />
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
              Categories
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              <button
                onClick={() => handleCategoryChange("")}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                  filters.category === ""
                    ? "bg-primary-50 text-primary-700 font-bold"
                    : "text-secondary-600 hover:bg-secondary-50",
                )}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                    filters.category === cat._id
                      ? "bg-primary-50 text-primary-700 font-bold"
                      : "text-secondary-600 hover:bg-secondary-50",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
              Price Range ($)
            </h4>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full px-3 py-2 border border-secondary-200 rounded-md text-sm"
              />
              <span className="text-secondary-400 self-center">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full px-3 py-2 border border-secondary-200 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Dietary Checkboxes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
              Dietary
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isVegetarian}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      isVegetarian: e.target.checked,
                      page: 1,
                    }))
                  }
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700">
                  Vegetarian Only
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isSpicy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      isSpicy: e.target.checked,
                      page: 1,
                    }))
                  }
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700">Spicy Only</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      {/* --- GRID CONTENT --- */}
      <div className="flex-1 w-full">
        {/* Sort Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-secondary-500">
            Showing{" "}
            <span className="font-bold text-secondary-900">{foods.length}</span>{" "}
            of{" "}
            <span className="font-bold text-secondary-900">
              {pagination.total}
            </span>{" "}
            items
          </p>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
            }
            className="border-none text-sm font-bold text-secondary-900 focus:ring-0 cursor-pointer bg-transparent"
          >
            <option value="createdAt">Newest First</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 bg-secondary-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-lg border border-secondary-100">
            <h3 className="font-display text-xl font-bold text-secondary-900 mb-2">
              No items found
            </h3>
            <p className="text-secondary-500 mb-6">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="text-primary-600 font-bold uppercase text-xs tracking-widest hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="p-2 border border-secondary-200 rounded-md hover:bg-secondary-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.min(pagination.pages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="p-2 border border-secondary-200 rounded-md hover:bg-secondary-50 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
