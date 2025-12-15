"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Package,
  Truck,
  Shield,
  Clock,
  Plus,
  Minus,
  Zap,
  Award,
  CheckCircle,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Custom/Header";
import Footer from "@/components/Custom/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useCart } from "@/context/cartContext";
import ProductInfo from "@/components/productDetail/ProductInfo";
import BackButton from "@/components/Custom/BackButon";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useIsAuthenticated();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const { data: productData, isLoading, error } = useProduct(id || "");
  const product = productData;
  const addToCartMutation = useAddToCart();

  const { state: cartState, dispatch } = useCart();
  // Fix: Add null check for product
  const cartItem = product
    ? cartState.items.find((item) => item.product?.id === product.id)
    : null;
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (productToAdd: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    // Optimistically update UI
    dispatch({ type: "ADD_ITEM", product: productToAdd, quantity: 1 });

    try {
      await addToCartMutation.mutateAsync({
        productId: productToAdd.id,
        quantity: 1,
      });
      toast({
        title: "Added to Cart! 🎉",
        description: `${productToAdd.name} has been added to your cart`,
      });
    } catch (error: any) {
      // Rollback UI
      dispatch({ type: "REMOVE_ITEM", productId: productToAdd.id });
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.mainImage || product.images[0]);
    }
  }, [product]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!product || !product.originalPrice) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  };

  const getStockColor = () => {
    if (!product?.stockQuantity) return "text-red-500";
    if (product.stockQuantity <= 10) return "text-amber-500";
    return "text-emerald-500";
  };

  const getStockProgress = () => {
    if (!product?.stockQuantity) return 0;
    const maxStock = 100; // Assume max stock for progress calculation
    return Math.min((product.stockQuantity / maxStock) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Enhanced Skeleton Loading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-6">
              <div className="relative">
                <Skeleton className="h-[500px] w-full rounded-2xl" />
                <div className="absolute top-4 left-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="absolute top-4 right-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-20 w-20 rounded-xl flex-shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>

                {/* Rating Skeleton */}
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Price Skeleton */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              {/* Stock Status Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>

              {/* Product Details Skeleton */}
              <div className="space-y-3 border-t pt-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>

              {/* Tags Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Quantity Skeleton */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="mt-8">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Features Skeleton */}
          <div className="mt-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>

          {/* Description Skeleton */}
          <div className="mt-8 space-y-4 border-t pt-6">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Package className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Not Found
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              The product you're looking for doesn't exist or has been removed
              from our catalog.
            </p>
            <Button
              onClick={() => navigate("/shop")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  console.log("Product data:", product);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <BackButton type="product" />
      <div className="mx-auto max-w-4xl px-4 py-4 md:px-6 lg:px-8">
        <ProductInfo
          product={product}
          images={product.images || []}
          mainImage={product.mainImage}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
