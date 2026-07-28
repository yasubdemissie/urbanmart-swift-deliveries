import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [isFocused, setIsFocused] = useState(false);

  // Update search query when URL changes
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search") || "";
    setSearchQuery(urlSearchQuery);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    navigate("/shop");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center w-full min-w-[240px] md:min-w-[360px] lg:min-w-[460px] max-w-3xl group"
    >
      <div className="relative flex-1 flex items-center w-full">
        <div className="absolute left-3.5 flex items-center justify-center pointer-events-none z-10">
          <Search
            className={`h-4 sm:h-5 w-4 sm:w-5 transition-colors duration-200 ${
              isFocused ? "text-blue-600 dark:text-blue-400 scale-110" : "text-slate-400"
            }`}
            strokeWidth={2.2}
          />
        </div>

        <Input
          type="text"
          placeholder="Search products, categories, brands, stores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-11 pr-24 h-11 sm:h-12 text-sm bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/90 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 shadow-inner transition-all duration-300 font-medium placeholder:text-slate-400"
        />

        <div className="absolute right-1.5 flex items-center gap-1.5 z-10">
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <button
            type="submit"
            className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <span>Search</span>
            <Sparkles className="h-3 w-3 opacity-80" />
          </button>
        </div>
      </div>
    </form>
  );
}
