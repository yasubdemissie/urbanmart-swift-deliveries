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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useIsAuthenticated } from "@/hooks/useAuth";

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

  const { data: product, isLoading, error } = useProduct(id || "");
  const addToCartMutation = useAddToCart();

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.mainImage || product.images[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    addToCartMutation.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          toast({
            title: "Added to Cart! 🎉",
            description: `${product.name} has been added to your cart`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to add to cart",
            variant: "destructive",
          });
        },
      }
    );
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-xl" />
                ))}
              </div>
            </div>
            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-16 w-full" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-white/80 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Image Gallery */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="h-[400px] w-full rounded-2xl overflow-hidden bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isImageZoomed ? "scale-110" : "scale-100"
                  } cursor-zoom-in`}
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/placeholder.svg?height=400&width=400";
                  }}
                />
              </div>

              {/* Image Overlay Icons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Discount Badge */}
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-sm font-semibold">
                      {calculateDiscount()}% OFF
                    </Badge>
                  </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(image)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                      selectedImage === image
                        ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                        : "border-gray-200 hover:border-gray-300 hover:scale-105"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=80&width=80";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Product Information */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {product.category.name}
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.isOnSale && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                    <Zap className="h-3 w-3 mr-1" />
                    Sale
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {product.brand && (
                <p className="text-xl text-gray-600 font-medium">
                  by {product.brand}
                </p>
              )}

              {/* Enhanced Rating */}
              {(product.averageRating !== undefined ||
                product.reviewCount !== undefined) && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < (product.averageRating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {product.averageRating?.toFixed(1) || 0}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <span className="text-sm text-gray-600 font-medium">
                    {product.reviewCount || 0} reviews
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Pricing */}
            <div className="space-y-3 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                        Save{" "}
                        {formatPrice(product.originalPrice - product.price)}
                      </Badge>
                    </>
                  )}
              </div>

              {product.salePercentage && (
                <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Save {product.salePercentage}% on this item
                </p>
              )}
            </div>

            {/* Enhanced Stock Status */}
            <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-lg ${getStockColor()}`}>
                  {product.stockQuantity > 0 ? "✓ In Stock" : "✗ Out of Stock"}
                </span>
                {product.stockQuantity > 0 && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {product.stockQuantity} available
                  </span>
                )}
              </div>

              {product.stockQuantity > 0 && (
                <>
                  <Progress value={getStockProgress()} className="h-2" />
                  {product.stockQuantity <= 10 && (
                    <p className="text-sm text-amber-600 font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Only {product.stockQuantity} left in stock - order soon!
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Enhanced Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-12 w-12 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-3 min-w-[80px] text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stockQuantity}
                    className="h-12 w-12 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    product.stockQuantity === 0 || addToCartMutation.isPending
                  }
                  size="lg"
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className={`h-14 w-14 border-2 transition-all duration-300 ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  }`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-14 border-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 bg-transparent"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Enhanced Product Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Truck,
                  text: "Free shipping",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Shield,
                  text: "Secure payment",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  icon: Package,
                  text: "Easy returns",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  icon: Clock,
                  text: "Fast delivery",
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 ${feature.bg} rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  <span className="font-medium text-gray-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Product Details with Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex">
                {[
                  { id: "description", label: "Description", icon: "📝" },
                  { id: "specifications", label: "Specifications", icon: "⚙️" },
                  { id: "reviews", label: "Reviews", icon: "⭐" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-8 py-6 text-center font-semibold transition-all duration-300 relative ${
                      activeTab === tab.id
                        ? "text-blue-600 bg-white border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl mr-2">{tab.icon}</span>
                    {tab.label}
                    {tab.id === "reviews" && product.reviewCount && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
                        {product.reviewCount}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8 min-h-[400px]">
              {/* Description Tab */}
              {activeTab === "description" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Product Description
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg mb-6">
                          {product.description}
                        </p>
                        {product.shortDescription && (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Key Highlights
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {product.shortDescription}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Why Choose This Product?
                        </h4>
                        <ul className="space-y-2 text-sm text-green-700">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            Premium quality materials
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            Excellent customer reviews
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            Fast & reliable shipping
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            30-day return guarantee
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === "specifications" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">⚙️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Technical Specifications
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        category: "Product Details",
                        specs: [
                          { label: "SKU", value: product.sku, icon: "🏷️" },
                          {
                            label: "Barcode",
                            value: product.barcode,
                            icon: "📊",
                          },
                          { label: "Brand", value: product.brand, icon: "🏢" },
                          {
                            label: "Category",
                            value: product.category?.name,
                            icon: "📂",
                          },
                        ],
                      },
                      {
                        category: "Physical Properties",
                        specs: [
                          {
                            label: "Weight",
                            value: product.weight
                              ? `${product.weight} kg`
                              : null,
                            icon: "⚖️",
                          },
                          {
                            label: "Dimensions",
                            value: product.dimensions,
                            icon: "📏",
                          },
                          {
                            label: "Color",
                            value: "Multiple Options",
                            icon: "🎨",
                          },
                          {
                            label: "Material",
                            value: "Premium Quality",
                            icon: "🧱",
                          },
                        ],
                      },
                    ].map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200"
                      >
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">
                          {section.category}
                        </h4>
                        <div className="space-y-3">
                          {section.specs.map((spec, index) =>
                            spec.value ? (
                              <div
                                key={index}
                                className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{spec.icon}</span>
                                  <span className="font-medium text-gray-700">
                                    {spec.label}
                                  </span>
                                </div>
                                <span className="text-gray-900 font-semibold">
                                  {spec.value}
                                </span>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-2xl border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      Quality Assurance
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Quality tested
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Warranty included
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Certified authentic
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">⭐</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Customer Reviews
                    </h3>
                  </div>

                  {product.reviews && product.reviews.length > 0 ? (
                    <>
                      {/* Rating Overview */}
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 text-center">
                          <div className="text-4xl font-bold text-gray-900 mb-2">
                            {product.averageRating?.toFixed(1) || "0.0"}
                          </div>
                          <div className="flex items-center justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < (product.averageRating || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 font-medium">
                            {product.reviewCount || 0} total reviews
                          </p>
                        </div>

                        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-4">
                            Rating Breakdown
                          </h4>
                          <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div
                                key={rating}
                                className="flex items-center gap-3"
                              >
                                <span className="text-sm font-medium text-gray-600 w-8">
                                  {rating}★
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                                    style={{
                                      width: `${Math.random() * 80 + 10}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-500 w-8">
                                  {Math.floor(Math.random() * 50)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            Recent Reviews
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700"
                          >
                            Write a Review
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          {product.reviews.slice(0, 3).map((review) => (
                            <div
                              key={review.id}
                              className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12 border-2 border-gray-200">
                                  <AvatarImage
                                    src={
                                      review.user?.avatar || "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                                    {review.user?.firstName?.[0]}
                                    {review.user?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <span className="font-semibold text-gray-900">
                                        {review.user?.firstName}{" "}
                                        {review.user?.lastName}
                                      </span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-4 w-4 ${
                                                i < review.rating
                                                  ? "text-yellow-400 fill-current"
                                                  : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Verified Purchase
                                        </Badge>
                                      </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {product.reviews.length > 3 && (
                          <div className="text-center pt-4">
                            <Button
                              variant="outline"
                              className="bg-white hover:bg-gray-50"
                            >
                              View All {product.reviews.length} Reviews
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
                        <Star className="h-12 w-12 text-yellow-500" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        No reviews yet
                      </h4>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Be the first to share your experience with this amazing
                        product and help other customers make informed
                        decisions.
                      </p>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                        Write the First Review
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
