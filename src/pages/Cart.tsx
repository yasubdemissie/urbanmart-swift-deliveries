import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "@/hooks/useCart";
import { useIsAuthenticated } from "@/hooks/useAuth";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useIsAuthenticated();
  const { data: cartData, isLoading, error } = useCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const cartItems = cartData || [];

  // Calculate summary from cart items
  const summary = {
    subtotal: cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    ),
    shipping:
      cartItems.length > 0
        ? cartItems.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0
          ) >= 50
          ? 0
          : 5.99
        : 0,
    tax:
      cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      ) * 0.08,
    total: 0,
  };
  summary.total = summary.subtotal + summary.shipping + summary.tax;

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItemMutation.mutateAsync({ id, quantity: newQuantity });
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const removeItem = async (id: string) => {
    try {
      await removeFromCartMutation.mutateAsync(id);
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await clearCartMutation.mutateAsync();
      toast.success("Cart cleared");
    } catch (error: any) {
      toast.error(error.message || "Failed to clear cart");
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please sign in
            </h1>
            <p className="text-gray-600 mb-8">
              You need to be signed in to view your cart.
            </p>
            <Button
              onClick={() => navigate("/signin")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error loading cart
            </h1>
            <p className="text-gray-600 mb-8">
              There was an error loading your cart. Please try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Shopping
              </Button>
            </Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={
                            item.product.images[0] ||
                            "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.product.category?.name || "Uncategorized"}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg font-bold text-gray-900">
                            ${Number(item.product.price).toFixed(2)}
                          </span>
                          {item.product.originalPrice &&
                            Number(item.product.originalPrice) >
                              Number(item.product.price) && (
                              <span className="text-sm text-gray-500 line-through">
                                ${Number(item.product.originalPrice).toFixed(2)}
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updateCartItemMutation.isPending}
                            className="p-2 h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updateCartItemMutation.isPending}
                            className="p-2 h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={removeFromCartMutation.isPending}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          $
                          {(Number(item.product.price) * item.quantity).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    disabled={clearCartMutation.isPending}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {clearCartMutation.isPending ? "Clearing..." : "Clear Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Link to="/shop">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${summary?.subtotal.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {summary?.shipping === 0
                        ? "Free"
                        : `$${summary?.shipping.toFixed(2) || "0.00"}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${summary?.tax.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${summary?.total.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
