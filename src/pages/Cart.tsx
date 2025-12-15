import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Custom/Header";
import Footer from "@/components/Custom/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart, MerchantCartGroup } from "@/context/cartContext";
import { useIsAuthenticated } from "@/hooks/useAuth";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useIsAuthenticated();
  const { state, dispatch, merchantGroups, totalItems } = useCart();

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch({ type: "REMOVE_ITEM", productId });
      toast.success("Item removed from cart");
      return;
    }

    dispatch({ type: "UPDATE_QUANTITY", productId, quantity: newQuantity });
    toast.success("Quantity updated");
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
    toast.success("Item removed from cart");
  };

  const clearMerchantCart = (merchantStoreId: string) => {
    dispatch({ type: "CLEAR_MERCHANT_CART", merchantStoreId });
    toast.success("Merchant cart cleared");
  };

  const clearAllCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("All carts cleared");
  };

  const handleMerchantCheckout = (merchantGroup: MerchantCartGroup) => {
    // Store the current merchant group in localStorage for checkout
    localStorage.setItem(
      "checkoutMerchantGroup",
      JSON.stringify(merchantGroup)
    );
    navigate("/checkout");
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

  if (state.items.length === 0) {
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

  console.log("items: ", state.items);
  console.log("merchantGroups: ", merchantGroups);
  console.log("totalItems: ", totalItems);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {totalItems} item{totalItems !== 1 ? "s" : ""} from{" "}
            {merchantGroups?.length} store
            {merchantGroups?.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-8">
          {merchantGroups?.map((group) => (
            <Card key={group.merchantStore.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 md:space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Store className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xs md:text-lg font-semibold text-gray-900">
                        {group.merchantStore.name}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-gray-600">
                        {group.items.length} item
                        {group.items.length !== 1 ? "s" : ""} •
                        {group.merchantStore.isVerified ? (
                          <Badge
                            variant="secondary"
                            className="md:ml-2 text-xs"
                          >
                            Verified Store
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="md:ml-2 text-xs">
                            Unverified Store
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearMerchantCart(group.merchantStore.id)}
                      className="text-xs md:text-sm text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear Store Cart
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Items */}
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center space-x-4 py-4 w-full border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={
                                item.product.images?.[0] ||
                                item.product.mainImage ||
                                "https://via.placeholder.com/80x80?text=No+Image"
                              }
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-[10px] text-normal md:text-lg font-semibold text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="text-[10px] text-sm my-2 md:text-sm text-gray-500">
                              {item.product.category?.name || "Uncategorized"}
                            </p>
                            <p className="text-[10px] text-sm md:text-sm font-medium text-gray-700">
                              {item.quantity} x {Number(item.product.price).toFixed(2)} 
                            </p>
                          </div>

                          <div className="text-right min-w-[100px] flex gap-2 flex-col md:flex-row">
                            <div className="flex flex-row items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                onClick={() => removeItem(item.product.id)}
                                className="p-2 w-fit text-xs md:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="text-xs md:text-sm h-2 md:h-4 w-2 md:w-4" />
                              </Button>
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-2 text-xs md:text-sm h-2 md:h-8 w-2 md:w-8"
                                >
                                  <Minus className="text-xs md:text-sm h-2 md:h-4 w-2 md:w-4" />
                                </Button>
                                <span className="px-3 py-1 text-xs md:text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-2 text-xs md:text-sm h-2 md:h-8 w-2 md:w-8"
                                >
                                  <Plus className="text-xs md:text-sm h-2 md:h-4 w-2 md:w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-xs md:text-lg font-semibold md:font-bold text-gray-900">
                              ETB{" "}
                              {(
                                Number(item.product.price) * item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary for this merchant */}
                  <div className="lg:col-span-1">
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <h3 className="text-xs md:text-lg font-semibold text-gray-900 mb-4">
                          Order Summary
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs md:text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                              ETB {group.subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs md:text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">
                              {group.shipping === 0
                                ? "Free"
                                : `ETB ${group.shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs md:text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">
                              ETB {group.tax.toFixed(2)}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-xs md:text-lg font-semibold">
                              Total
                            </span>
                            <span className="font-bold text-gray-900">
                              ETB {group.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <Button
                          className="w-full text-xs md:text-sm bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleMerchantCheckout(group)}
                        >
                          Checkout from {group.merchantStore.name}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link to="/shop">
            <Button variant="outline" className="text-xs md:text-sm">
              Continue Shopping
            </Button>
          </Link>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearAllCart}
              className="text-xs md:text-sm text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 text-xs md:text-sm mr-2" />
              Clear All Carts
            </Button>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Cart;
