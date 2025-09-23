import { Clock, Percent } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Custom/Header";
import Footer from "@/components/Custom/Footer";
import ProductCard from "@/components/Custom/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSaleProducts } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "sonner";

const Deals = () => {
  // Fetch real sale products from API
  const { data: saleProducts = [], isLoading, error } = useSaleProducts();
  const addToCartMutation = useAddToCart();

  // Handle add to cart
  const handleAddToCart = async (productId: string) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      toast.success("Product added to cart!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add to cart";
      toast.error(errorMessage);
    }
  };

  const flashDeals = [
    {
      name: "Flash Sale: Electronics",
      discount: "Up to 70% OFF",
      timeLeft: "2h 45m",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
    },
    {
      name: "Weekend Special: Fashion",
      discount: "50% OFF",
      timeLeft: "1d 12h",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔥 Amazing Deals
          </h1>
          <p className="text-gray-600">
            Don't miss out on these incredible offers and limited-time discounts
          </p>
        </div>

        {/* Flash Deals Banner */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-red-500" />
            Flash Deals - Limited Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flashDeals.map((deal, index) => (
              <Card
                key={index}
                className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                    <h3 className="text-xl font-bold mb-2">{deal.name}</h3>
                    <p className="text-lg font-semibold text-yellow-300 mb-2">
                      {deal.discount}
                    </p>
                    <p className="text-sm">Ends in: {deal.timeLeft}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Deal of the Day */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Deal of the Day</h2>
            <p className="text-xl mb-4">Save up to 60% on selected items</p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-white/20 rounded-lg p-3">
                <span className="text-2xl font-bold">12</span>
                <p className="text-xs">Hours</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <span className="text-2xl font-bold">34</span>
                <p className="text-xs">Minutes</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <span className="text-2xl font-bold">56</span>
                <p className="text-xs">Seconds</p>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Shop Now
            </Button>
          </div>
        </div>

        {/* Percentage Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Percent className="h-6 w-6 mr-2 text-green-500" />
            Percentage Deals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { percent: "20%", category: "Electronics", color: "bg-blue-500" },
              { percent: "35%", category: "Fashion", color: "bg-pink-500" },
              {
                percent: "15%",
                category: "Home & Garden",
                color: "bg-green-500",
              },
              { percent: "50%", category: "Sports", color: "bg-orange-500" },
            ].map((deal, index) => (
              <Card
                key={index}
                className={`${deal.color} text-white cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{deal.percent}</div>
                  <div className="text-sm opacity-90">OFF</div>
                  <div className="text-sm mt-2">{deal.category}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Deal Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured Deal Products
          </h2>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
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

          {error && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error loading deals
              </h3>
              <p className="text-gray-600">
                There was an error loading the deals. Please try again later.
              </p>
            </div>
          )}

          {!isLoading && !error && saleProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No deals available
              </h3>
              <p className="text-gray-600">
                Check back later for amazing deals and discounts!
              </p>
            </div>
          )}

          {!isLoading && !error && saleProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Never Miss a Deal!
          </h3>
          <p className="text-gray-600 mb-4">
            Subscribe to get notified about exclusive offers and flash sales
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="rounded-l-none">Subscribe</Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Deals;
