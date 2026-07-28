"use client";

import { useEffect, useState } from "react";
import { Grid, List, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ElegantFilterCardProps {
  categories: Category[];
  categoriesLoading?: boolean;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
  selectedCategory?: string;
  sortBy?: string;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  totalProducts?: number;
}

const ElegantFilterCard = ({
  categories = [],
  categoriesLoading = false,
  onCategoryChange = () => {},
  onSortChange = () => {},
  selectedCategory = "all",
  sortBy = "featured",
  viewMode = "grid",
  onViewModeChange,
  totalProducts = 0,
}: ElegantFilterCardProps) => {
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localSort, setLocalSort] = useState(sortBy);

  useEffect(() => {
    setLocalCategory(selectedCategory);
    setLocalSort(sortBy);
  }, [selectedCategory, sortBy]);

  const handleCategorySelect = (slug: string) => {
    setLocalCategory(slug);
    onCategoryChange(slug);
  };

  const handleSortSelect = (sortVal: string) => {
    setLocalSort(sortVal);
    onSortChange(sortVal);
  };

  const resetFilters = () => {
    handleCategorySelect("all");
    handleSortSelect("featured");
  };

  const isFiltered = localCategory !== "all" || localSort !== "featured";

  return (
    <div className="space-y-4 mb-6">
      {/* Top Header Controls Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
            {localCategory === "all" ? "Shop All Products" : localCategory.replace(/-/g, " ")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{totalProducts}</span> available items
          </p>
        </div>

        {/* Right Controls: Sort & View Toggle */}
        <div className="flex items-center gap-3">
          {/* Minimalist Sort Dropdown */}
          <div className="relative">
            <select
              value={localSort}
              onChange={(e) => handleSortSelect(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          {onViewModeChange && (
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clean Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleCategorySelect("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            localCategory === "all"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => {
          const active = localCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat.name}
            </button>
          );
        })}

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 ml-auto whitespace-nowrap"
          >
            <X className="h-3.5 w-3.5" /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ElegantFilterCard;
