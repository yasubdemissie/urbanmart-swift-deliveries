"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";
import { useAddToCart } from "@/hooks/useCart";
import ElegantFilterCard from "@/components/ElegantFilterSortCard";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

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
    sortBy:
      sortBy === "featured"
        ? "createdAt"
        : sortBy === "price-low"
        ? "price"
        : sortBy === "price-high"
        ? "price"
        : "rating",
    sortOrder: sortBy === "price-high" ? "desc" : "asc",
  });

  const { pagination, products } = productsData || {};

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { dispatch } = useCart();
  const addToCartMutation = useAddToCart();

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Handle add to cart
  const handleAddToCart = async (product) => {
    // Optimistically update UI
    dispatch({ type: "ADD_ITEM", product, quantity: 1 });

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
      });
      toast.success("Product added to cart!");
    } catch (error) {
      // Rollback UI
      dispatch({ type: "REMOVE_ITEM", productId: product.id });
      toast.error("Failed to add to cart");
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  if (productsError) {
    console.error("productsError", productsError);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error loading products
            </h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <ElegantFilterCard
          categories={categories || []}
          categoriesLoading={false}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
        />

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {searchQuery && (
              <>
                <p className="text-sm text-gray-500">
                  Results for "{searchQuery}"
                </p>
                <p className="text-gray-600 font-medium">
                  {productsLoading
                    ? "Loading products..."
                    : `Showing ${products?.length || 0} of ${
                        pagination?.total || 0
                      } products`}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {productsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!productsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!productsLoading && products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
