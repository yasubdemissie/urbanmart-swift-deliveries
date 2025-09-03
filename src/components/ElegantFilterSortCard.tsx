"use client";

import { useState } from "react";
import { Filter, X, Sparkles } from "lucide-react";

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
}

const ElegantFilterCard = ({
  categories = [],
  categoriesLoading = false,
  onCategoryChange = () => {},
  onSortChange = () => {},
  selectedCategory = "all",
  sortBy = "featured",
}: ElegantFilterCardProps) => {
  const [localSelectedCategory, setLocalSelectedCategory] =
    useState(selectedCategory);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCategoryChange = (value: string) => {
    setLocalSelectedCategory(value);
    onCategoryChange(value);
  };

  const handleSortChange = (value: string) => {
    setLocalSortBy(value);
    onSortChange(value);
  };

  const toggleFilters = () => {
    console.log("[v0] Filter button clicked, current state:", isFiltersOpen);
    setIsFiltersOpen(!isFiltersOpen);
    console.log("[v0] Filter state will be:", !isFiltersOpen);
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={toggleFilters}
          className="group flex items-center gap-3 px-6 py-3 bg-white text-black border border-gray-200 rounded-2xl hover:shadow-sm transition-all duration-300 font-semibold hover:bg-gray-50/50 hover:border-gray-300"
        >
          <Filter className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Filters & Sort</span>
          <Sparkles className="h-4 w-4 opacity-70" />
        </button>
      </div>

      {isFiltersOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => {
            console.log("[v0] Backdrop clicked, closing filters");
            setIsFiltersOpen(false);
          }}
        />
      )}

      <div
        className={`fixed z-50 transition-all duration-500 ease-out
        
        /* Mobile: Center modal */
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[90vw] max-w-sm
        bg-white rounded-3xl shadow-2xl
        ${
          isFiltersOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }
        
        /* Desktop: Right slide-in panel */
        md:top-0 md:left-auto md:right-0 md:translate-x-0 md:translate-y-0
        md:h-full md:w-full md:max-w-md md:rounded-none md:rounded-l-3xl
        ${
          isFiltersOpen
            ? "md:translate-x-0 md:opacity-100 md:scale-100 md:pointer-events-auto"
            : "md:translate-x-full md:opacity-0 md:scale-100 md:pointer-events-none"
        }
        `}
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-t-3xl md:rounded-none md:rounded-tl-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Filter & Sort</h3>
            </div>
            <button
              title="Close filters"
              type="button"
              onClick={() => {
                console.log("[v0] Close button clicked");
                setIsFiltersOpen(false);
              }}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
            >
              <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] md:max-h-none md:h-full overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Category
              </label>
            </div>
            <div className="relative group">
              <select
                title="Category"
                value={localSelectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all hover:border-indigo-300 cursor-pointer group-hover:shadow-md"
                disabled={categoriesLoading}
              >
                <option value="all">🌟 All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <div className="w-6 h-6 bg-gradient-to-r from-black to-black/70 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Sort by
              </label>
            </div>
            <div className="relative group">
              <select
                title="Sort by"
                value={localSortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full appearance-none bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all hover:border-purple-300 cursor-pointer group-hover:shadow-md"
              >
                <option value="featured">✨ Featured</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="rating">⭐ Highest Rated</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="pt-6 border-t border-gray-100">
            <button
              onClick={() => {
                console.log("[v0] Apply filters clicked");
                setIsFiltersOpen(false);
              }}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-2xl font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Apply Filters
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ElegantFilterCard;
