import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Heart, Check, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";
import { useCart } from "@/context/cartContext";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
}

const ProductCard = ({
  product,
  onAddToCart,
  isLoading: externalLoading = false,
  viewMode = "grid",
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const { state: cartState } = useCart();
  const cartItem = cartState.items.find(
    (item) => item.product.id === product.id
  );
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const isLoading = internalLoading || externalLoading;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalLoading(true);
    try {
      if (onAddToCart) {
        await onAddToCart();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const discount = product.originalPrice
    ? Math.abs(
        Math.round(
          (1 - Number(product.price) / Number(product.originalPrice)) * 100
        )
      )
    : 0;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80";
  const categoryName = product.category?.name || "General";
  const averageRating = product.averageRating || 4.5;
  const reviewCount = product.reviewCount || 12;

  if (viewMode === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col sm:flex-row bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative sm:w-56 h-48 sm:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {discount > 0 && product.isOnSale && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Details Container */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {categoryName}
              </span>
              <button
                onClick={handleToggleWishlist}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {product.name}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-slate-400">({reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                <span className="text-xs text-slate-400 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20 px-4 h-9 text-xs flex items-center gap-2"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {isLoading ? "Adding..." : cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Top Image Box */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {discount > 0 && product.isOnSale && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md tracking-tight">
              -{discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="h-3 w-3 fill-amber-950" /> Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110"
          title="Add to wishlist"
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Product Image */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Quick Action Overlay */}
        <div
          className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-xs px-4"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            {isLoading ? "Adding..." : cartQuantity > 0 ? `Add More (${cartQuantity})` : "Quick Add"}
          </Button>
        </div>

        {/* In-Cart Pill */}
        {cartQuantity > 0 && (
          <div className="absolute bottom-3 left-3 z-10 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Check className="h-3 w-3" /> {cartQuantity} in Cart
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {categoryName}
            </span>

            {/* Rating pill */}
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{averageRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Price & Button Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Free Delivery
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading}
            className="h-8 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold transition-all duration-200 border border-blue-200/60 dark:border-blue-800"
          >
            {isLoading ? "..." : cartQuantity > 0 ? `+${cartQuantity}` : "+ Add"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
