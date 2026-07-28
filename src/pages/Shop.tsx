"use client";

import { useState, useEffect } from "react";
import { PackageX, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Custom/Header";
import Footer from "@/components/Custom/Footer";
import ProductCard from "@/components/Custom/ProductCard";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";
import { useAddToCart } from "@/hooks/useCart";
import ElegantFilterCard from "@/components/Custom/ElegantFilterSortCard";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const [searchParams] = useSearchParams();

  // Initialize search query from URL parameters
  const initialSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const initialCategory = searchParams.get("category") || "all";
  const initialSort = searchParams.get("sort") || "featured";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);

  // Update search query when URL changes
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search") || "";
    setSearchQuery(urlSearchQuery);
  }, [searchParams]);

  // Fetch products and categories
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts({
    page: currentPage,
    limit: 12,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchQuery || undefined,
    featured: sortBy === "featured",
    sortBy:
      sortBy === "" || sortBy === "featured"
        ? "createdAt"
        : sortBy === "price-low"
        ? "price"
        : sortBy === "price-high"
        ? "price"
        : "rating",
    sortOrder: sortBy === "price-high" ? "desc" : "asc",
  });

  const { pagination, products } = productsData || {};

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { dispatch } = useCart();
  const addToCartMutation = useAddToCart();

  useEffect(() => {
    document.title = `Shop - ${searchQuery || "All Products"} | UrbanMart`;
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory && selectedCategory !== "all")
      params.set("category", selectedCategory);
    if (sortBy && sortBy !== "featured") params.set("sort", sortBy);
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [searchQuery, selectedCategory, sortBy]);

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Handle add to cart
  const handleAddToCart = async (product: any) => {
    dispatch({ type: "ADD_ITEM", product, quantity: 1 });

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      dispatch({ type: "REMOVE_ITEM", productId: product.id });
      toast.error("Failed to add product to cart");
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Filter Controls */}
        <ElegantFilterCard
          categories={categories || []}
          categoriesLoading={categoriesLoading}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalProducts={pagination?.total || products?.length || 0}
        />

        {/* Search Query Result Tag */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 rounded-2xl">
            <span className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-200">
              Search results for <strong className="underline">"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Loading State */}
        {productsLoading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse h-80 flex flex-col justify-between"
              >
                <div className="bg-slate-200 dark:bg-slate-800 h-48 rounded-xl w-full"></div>
                <div className="space-y-2 mt-4">
                  <div className="bg-slate-200 dark:bg-slate-800 h-4 rounded w-1/3"></div>
                  <div className="bg-slate-200 dark:bg-slate-800 h-5 rounded w-3/4"></div>
                  <div className="bg-slate-200 dark:bg-slate-800 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : productsError ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-3xl p-12 text-center my-8">
            <h3 className="text-lg font-extrabold text-rose-900 dark:text-rose-200 mb-2">
              Unable to load catalog products
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 mb-4">
              Please check your connection or refresh the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Refresh Page
            </Button>
          </div>
        ) : products && products.length > 0 ? (
          <>
            {/* Products Grid or List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  isLoading={addToCartMutation.isPending}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-xl px-4 h-10 border-slate-200 dark:border-slate-800 font-bold text-xs"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Previous
                </Button>
                
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 h-10 flex items-center rounded-xl">
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="rounded-xl px-4 h-10 border-slate-200 dark:border-slate-800 font-bold text-xs"
                >
                  Next <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty Products State */
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm my-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
              <PackageX className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              We couldn't find any products matching your current category or search criteria. Try clearing filters or searching for something else.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("all");
                setSortBy("featured");
                setSearchQuery("");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-10 text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
