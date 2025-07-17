import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/api";
import { useCart } from "@/context/cartContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { state: cartState, dispatch } = useCart();
  const cartItem = cartState.items.find(
    (item) => item.product.id === product.id
  );
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      // Use global cart state directly
      // dispatch({ type: "ADD_ITEM", product, quantity: 1 });
      if (onAddToCart) {
        await onAddToCart();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const discount = product.originalPrice
    ? Math.round(
        (1 - Number(product.price) / Number(product.originalPrice)) * 100
      )
    : 0;

  const imageUrl =
    product.images[0] || "https://via.placeholder.com/400x300?text=No+Image";
  const categoryName = product.category?.name || "Uncategorized";
  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg border-0 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden bg-gray-100 rounded-t-lg">
        {(discount > 0 || product.isOnSale) && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
            -{discount}%
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
            Featured
          </div>
        )}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Show badge if in cart */}
        {cartQuantity > 0 && (
          <div className="absolute bottom-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
            In Cart: {cartQuantity}
          </div>
        )}
        <div
          className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading
              ? "Adding..."
              : cartQuantity > 0
              ? "Add More"
              : "Add to Cart"}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 font-medium">
            {categoryName}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {averageRating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice &&
              Number(product.originalPrice) > Number(product.price) && (
                <span className="text-sm text-gray-500 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartQuantity > 0 ? "Add More" : "Add to Cart"}
          </Button>
        </div>

        <div className="mt-3 text-xs text-green-600 font-medium">
          ✓ Free delivery available
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
