import { useState, useEffect } from "react";
import {
  Star,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  ShoppingCart,
  Expand,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAddToCart } from "@/hooks/useCart";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useCart } from "@/context/cartContext";
import { apiClient, Review } from "@/lib/api";
import QuantitySelector from "./QuantitySelector";
import { Product } from "@/lib/api";

interface ProductInfoProps {
  product: Product;
  images: string[];
  mainImage?: string;
}

const ProductInfo = ({ product, images, mainImage }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { toast } = useToast();
  const addToCartMutation = useAddToCart();
  const { isAuthenticated } = useIsAuthenticated();
  const { dispatch } = useCart();

  // Get all available images
  const allImages =
    images && images.length > 0 ? images : [mainImage].filter(Boolean);
  const currentImage =
    allImages[selectedImageIndex] || mainImage || "/placeholder.svg";

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      // Only fetch reviews if product.id exists
      if (!product.id) {
        return;
      }

      setIsLoadingReviews(true);
      try {
        const reviews = await apiClient.getProductReviews(product.id);
        console.log("Reviews:", reviews);
        setReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product.id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Optimistically update the local cart context
      dispatch({
        type: "ADD_ITEM",
        product: product,
        quantity: quantity,
      });

      // Then call the API
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: quantity,
      });

      toast({
        title: "Added to Cart! 🎉",
        description: `${quantity} x ${product.name} added to your cart.`,
      });
    } catch (error: unknown) {
      // Rollback the local cart context if API call fails
      dispatch({
        type: "REMOVE_ITEM",
        productId: product.id,
      });

      const errorMessage =
        error instanceof Error ? error.message : "Failed to add to cart";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${
        isWishlisted ? "removed from" : "added to"
      } your wishlist.`,
    });
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsFullscreenOpen(false);
    } else if (e.key === "ArrowLeft") {
      handlePreviousImage();
    } else if (e.key === "ArrowRight") {
      handleNextImage();
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (!rating || !reviewText.trim()) {
      toast({
        title: "Incomplete Review",
        description: "Please select a rating and write a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      await apiClient.createProductReview({
        productId: product.id,
        rating: rating,
        comment: reviewText,
      });

      toast({
        title: "Review Submitted! 🎉",
        description: "Thank you for your review!",
      });

      // Refresh reviews after submission
      setIsLoadingReviews(true);
      const updatedReviews = await apiClient.getProductReviews(product.id);
      setReviews(updatedReviews);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit review";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
      setRating(0);
      setReviewText("");
    }
  };

  const discountAmount =
    product.originalPrice && product.price
      ? product.originalPrice - product.price
      : 0;

  const discountPercentage =
    product.originalPrice && discountAmount
      ? Math.round((discountAmount / product.originalPrice) * 100)
      : product.salePercentage || 0;

  // Calculate average rating and review count
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const reviewCount = reviews.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight text-foreground">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-lg text-muted-foreground">
                by {product.brand}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlist}
            className="shrink-0"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-current text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-current text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {isLoadingReviews
              ? "Loading reviews..."
              : `(${averageRating.toFixed(1)}) • ${reviewCount} review${
                  reviewCount !== 1 ? "s" : ""
                }`}
          </span>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:h-[350px] gap-6">
        {/* Left Content - Product Details */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Price Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
            </div>

            {product.isOnSale && discountPercentage > 0 && (
              <Badge
                variant="destructive"
                className="bg-sale-badge text-sale-badge-foreground"
              >
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Stock Status */}
          <div className="flex items-start justify-start">
            <div
              className={`h-2 w-2 rounded-full ${
                product.stockQuantity > 0 ? "bg-success" : "bg-destructive"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                product.stockQuantity > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stockQuantity > 0
                ? `In Stock (${product.stockQuantity} available)`
                : "Out of Stock"}
            </span>
          </div>

          {/* Product Details */}
          <div className="space-y-4 border-t pt-6">
            <div className="space-y-3 text-sm">
              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="font-medium">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="font-medium">{product.dimensions}</span>
                </div>
              )}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity */}
          {product.stockQuantity > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={product.stockQuantity}
              />
            </div>
          )}
        </div>

        {/* Product Images - Mobile: Below content, Desktop: Right side */}
        <div className="relative space-y-3 lg:top-[-80px]">
          <div className="relative">
            {/* Main Image */}
            <div
              className="relative cursor-pointer group"
              onClick={() => setIsFullscreenOpen(true)}
            >
              <div className="aspect-square w-full max-w-80 mx-auto overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 shadow-[var(--shadow-product)]">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <Expand className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="flex flex-wrap p-3 gap-2 justify-center">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`h-20 w-20 rounded-md border-2 overflow-hidden transition-all duration-300 ${
                      index === selectedImageIndex
                        ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                        : "border-gray-200 hover:border-gray-300 hover:scale-105"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart */}
      {product.stockQuantity > 0 && (
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            className="w-full text-base font-semibold bg-gradient-to-r from-orange-500 to-orange-400 text-orange-100 disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />
            {addToCartMutation.isPending
              ? "Adding..."
              : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
          </Button>
        </div>
      )}

      {/* Features */}
      <div className="space-y-3 border-t pt-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>2-year warranty included</span>
        </div>
      </div>

      {/* Full Description */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold">Description</h3>
        <div className="prose prose-sm text-muted-foreground">
          <p className="leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Reviews and Rating Section */}
      <div className="space-y-6 border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(averageRating)
                      ? "fill-current text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>
        </div>

        {/* Review Form */}
        {isAuthenticated && (
          <div className="bg-muted/30 rounded-lg p-6 space-y-4">
            <h4 className="font-medium">Write a Review</h4>
            <div className="space-y-4">
              {/* Rating Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className="text-2xl hover:scale-110 transition-transform"
                      title={`Rate ${i + 1} star${i !== 0 ? "s" : ""}`}
                      aria-label={`Rate ${i + 1} star${i !== 0 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          i < rating
                            ? "fill-current text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating > 0
                      ? `${rating} star${rating !== 1 ? "s" : ""}`
                      : "Select rating"}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {reviewText.length}/500 characters
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={!rating || !reviewText.trim() || isSubmittingReview}
                className="w-full"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {isLoadingReviews ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {review.user?.firstName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-current text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreenOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous Button */}
          {allImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousImage}
              className="absolute left-4 z-10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Next Button */}
          {allImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextImage}
              className="absolute right-4 z-10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Main Image */}
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`h-16 w-16 rounded-md border-2 overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    index === selectedImageIndex
                      ? "border-white ring-2 ring-white"
                      : "border-white/50 hover:border-white"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
