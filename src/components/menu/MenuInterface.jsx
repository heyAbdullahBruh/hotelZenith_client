"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { menuService } from "@/lib/services/menuService";
import FoodCard from "@/components/shared/FoodCard";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// --- Hooks ---
function useDebounceValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- Sub-Component: The Filter Form (Reusable) ---
const FilterContent = ({
  filters,
  setFilters,
  categories,
  closeMobileMenu,
}) => {
  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search menu..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
          }
          className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
        />
        <Search
          className="absolute left-3 top-3.5 text-secondary-400"
          size={16}
        />
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: "", page: 1 }));
              if (closeMobileMenu) closeMobileMenu();
            }}
            className={cn(
              "w-full text-left px-3 py-2 text-sm rounded-md transition-all flex justify-between items-center",
              filters.category === ""
                ? "bg-primary-50 text-primary-700 font-bold"
                : "text-secondary-600 hover:bg-secondary-50",
            )}
          >
            All Items
            {filters.category === "" && <Check size={14} />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: cat._id, page: 1 }));
                if (closeMobileMenu) closeMobileMenu();
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-all flex justify-between items-center",
                filters.category === cat._id
                  ? "bg-primary-50 text-primary-700 font-bold"
                  : "text-secondary-600 hover:bg-secondary-50",
              )}
            >
              {cat.name}
              {filters.category === cat._id && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
          Price Range ($)
        </h4>
        <div className="flex gap-3 items-center">
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
            className="w-full px-3 py-2 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
          />
          <span className="text-secondary-400 font-bold">-</span>
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
            className="w-full px-3 py-2 border border-secondary-200 rounded-md text-sm focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Dietary Toggles */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
          Preferences
        </h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={cn(
                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                filters.isVegetarian
                  ? "bg-primary-500 border-primary-500 text-white"
                  : "border-secondary-300 bg-white",
              )}
            >
              {filters.isVegetarian && <Check size={12} />}
            </div>
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
              className="hidden"
            />
            <span className="text-sm text-secondary-700 group-hover:text-primary-600 transition-colors">
              Vegetarian Only
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={cn(
                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                filters.isSpicy
                  ? "bg-red-500 border-red-500 text-white"
                  : "border-secondary-300 bg-white",
              )}
            >
              {filters.isSpicy && <Check size={12} />}
            </div>
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
              className="hidden"
            />
            <span className="text-sm text-secondary-700 group-hover:text-red-600 transition-colors">
              Spicy Only
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

// Add this before your return statement in the MenuInterface component
const SortOptions = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const dropdownRef = useRef(null);

  const sortOptions = [
    {
      value: "createdAt",
      label: "Newest First",
      icon: "✨",
      description: "Latest additions first",
    },
    {
      value: "price",
      label: "Price: Low to High",
      icon: "💰",
      description: "Most affordable first",
    },
    {
      value: "-price",
      label: "Price: High to Low",
      icon: "💎",
      description: "Premium items first",
    },
    {
      value: "rating",
      label: "Highest Rated",
      icon: "⭐",
      description: "Top rated dishes",
    },
  ];

  const currentOption =
    sortOptions.find((opt) => opt.value === value) || sortOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Sort Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-5 py-2.5 bg-linear-to-r from-secondary-50 to-white border border-secondary-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-400">
            Sort By:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-base">{currentOption.icon}</span>
            <span className="text-sm font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
              {currentOption.label}
            </span>
          </div>
        </div>

        {/* Animated Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className="text-secondary-400"
        >
          <ChevronRight size={16} className="rotate-90" />
        </motion.div>

        {/* Animated Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all duration-500 pointer-events-none" />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute top-full -left-10 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-secondary-100 overflow-hidden z-50"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-linear-to-r from-secondary-50 to-white border-b border-secondary-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                  Sort Options
                </h4>
                <p className="text-xs text-secondary-400 mt-1">
                  Choose how to order your menu
                </p>
              </div>

              {/* Options List */}
              <div className="p-2">
                {sortOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHoveredOption(option.value)}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`
                      relative w-full text-left px-4 py-3 rounded-xl transition-all duration-300
                      ${
                        value === option.value
                          ? "bg-primary-50 text-primary-700"
                          : "text-secondary-600 hover:bg-secondary-50"
                      }
                    `}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Hover Glow */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-primary-500/5 to-transparent rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: hoveredOption === option.value ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    />

                    <div className="relative z-10 flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className={`
                        w-10 h-10 rounded-xl flex items-center justify-center text-xl
                        ${
                          value === option.value
                            ? "bg-primary-100 text-primary-600"
                            : "bg-secondary-100 text-secondary-500"
                        } transition-all duration-300
                      `}
                      >
                        {option.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {option.label}
                          </span>
                          {value === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                              className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center"
                            >
                              <Check size={10} className="text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-secondary-400 mt-0.5">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer with animation */}
              <motion.div
                className="px-5 py-3 bg-secondary-50 border-t border-secondary-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-[10px] text-secondary-400 text-center">
                  Sorting affects the order of displayed items
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Component ---
export default function MenuInterface() {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State
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
  const scrollRef = useRef(null);

  // Load Categories
  useEffect(() => {
    menuService.getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  // Fetch Foods
  const fetchFoods = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = {
        ...filters,
        search: debouncedSearch,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        isVegetarian: filters.isVegetarian ? "true" : undefined,
        isSpicy: filters.isSpicy ? "true" : undefined,
      };

      const res = await menuService.getAll(queryParams);
      if (res.success) {
        setFoods(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      // Scroll to top of grid on page change
      if (filters.page > 1) {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }
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
    setShowMobileFilters(false);
  };

  // Helper to get active filter count for badge
  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.isVegetarian,
    filters.isSpicy,
  ].filter(Boolean).length;

  console.log(categories.map((cat) => cat.name));
  return (
    <div
      ref={scrollRef}
      className="flex flex-col lg:flex-row gap-8 items-start relative"
    >
      {/* --- MOBILE FILTER TOGGLE --- */}
      <div className="lg:hidden w-full flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-secondary-100 mb-4 sticky top-20 z-30">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 text-secondary-900 font-bold text-sm"
        >
          <div className="relative">
            <SlidersHorizontal size={20} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          Filter & Sort
        </button>

        <div className="flex items-center gap-2">
          <SortOptions
            value={filters.sortBy}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, sortBy: value }))
            }
          />
        </div>
        {/* <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
          }
          className="border-none text-sm font-bold text-secondary-900 bg-transparent focus:ring-0 text-right pr-8"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select> */}
      </div>

      {/* --- MOBILE DRAWER (Modal) --- */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-280px bg-white z-50 lg:hidden shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display text-xl font-bold">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-secondary-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterContent
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                closeMobileMenu={() => setShowMobileFilters(false)}
              />
              <div className="mt-8 pt-6 border-t border-secondary-100">
                <button
                  onClick={clearFilters}
                  className="w-full py-3 border border-secondary-200 text-secondary-600 font-bold uppercase text-xs tracking-widest rounded-sm hover:bg-secondary-50"
                >
                  Reset All
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white p-6 rounded-lg shadow-sm border border-secondary-100 sticky top-24 h-fit">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Filter size={18} /> Filters
          </h3>
          <button
            onClick={clearFilters}
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-medium"
          >
            Reset
          </button>
        </div>
        <FilterContent
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />
      </aside>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="flex-1 w-full">
        {/* Active Filters Bar (Desktop) */}
        <div className="hidden lg:flex justify-between items-center mb-6 bg-white p-3 rounded-lg border border-secondary-100">
          <div className="flex items-center gap-2 text-sm text-secondary-500">
            <span>
              Showing <b>{foods.length}</b> results
            </span>
            {(filters.search || filters.category) && (
              <div className="flex gap-2 ml-4">
                {filters.category && (
                  <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    {categories.find((c) => c._id === filters.category)?.name}
                    <button
                      onClick={() =>
                        setFilters((p) => ({ ...p, category: "" }))
                      }
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.isVegetarian && (
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    Vegetarian{" "}
                    <button
                      onClick={() =>
                        setFilters((p) => ({ ...p, isVegetarian: false }))
                      }
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Replace the entire sort section in the desktop active filters bar */}
          <div className="flex items-center gap-2">
            <SortOptions
              value={filters.sortBy}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, sortBy: value }))
              }
            />
          </div>
        </div>

        {/* --- GRID --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-secondary-100 p-4 space-y-4 h-400px animate-pulse"
              >
                <div className="w-full h-48 bg-secondary-100 rounded-md" />
                <div className="h-6 bg-secondary-100 w-3/4 rounded" />
                <div className="h-4 bg-secondary-100 w-full rounded" />
                <div className="pt-4 flex justify-between">
                  <div className="h-8 w-20 bg-secondary-100 rounded" />
                  <div className="h-8 w-8 bg-secondary-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-lg border border-secondary-100 shadow-sm"
          >
            <div className="bg-secondary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-secondary-400" size={32} />
            </div>
            <h3 className="font-display text-xl font-bold text-secondary-900 mb-2">
              No items found
            </h3>
            <p className="text-secondary-500 mb-6 max-w-xs mx-auto">
              We couldn't find any dishes matching your filters. Try adjusting
              your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="text-primary-600 font-bold uppercase text-xs tracking-widest hover:text-primary-700 border-b-2 border-primary-200 pb-1"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
            >
              <AnimatePresence mode="popLayout">
                {foods.map((food, index) => (
                  <motion.div
                    key={food._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <FoodCard food={food} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* --- PAGINATION --- */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 py-8 border-t border-secondary-100">
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-md hover:bg-white hover:border-primary-500 hover:text-primary-600 disabled:opacity-50 disabled:hover:border-secondary-200 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft size={16} />{" "}
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <span className="text-sm font-bold text-secondary-900">
                  Page {pagination.page}{" "}
                  <span className="text-secondary-400 font-normal">of</span>{" "}
                  {pagination.pages}
                </span>

                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.min(pagination.pages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-md hover:bg-white hover:border-primary-500 hover:text-primary-600 disabled:opacity-50 disabled:hover:border-secondary-200 disabled:hover:bg-transparent transition-all"
                >
                  <span className="hidden sm:inline">Next</span>{" "}
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
