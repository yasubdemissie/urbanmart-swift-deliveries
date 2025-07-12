"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Shield,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cartContext";
import { apiClient } from "@/lib/api";

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: "card" | "cash";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const cartItems = state.items;
  const [isLoading, setIsLoading] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "Hawassa",
    state: "",
    zipCode: "",
    country: "Ethiopia",
  });
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    street: "",
    city: "Hawassa",
    state: "",
    zipCode: "",
    country: "Ethiopia",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "cash",
  });

  // Helper functions
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBillingAddressChange = (
    field: keyof BillingAddress,
    value: string
  ) => {
    setBillingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentChange = (field: keyof PaymentMethod, value: string) => {
    setPaymentMethod((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredAddressFields = ["street", "city", "state", "zipCode"];
    const requiredPaymentFields =
      paymentMethod.type === "card"
        ? ["cardNumber", "cardHolder", "expiryDate", "cvv"]
        : [];

    // Check address fields
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        toast.error(`Please fill in your ${field}`);
        return false;
      }
    }

    // Check payment fields if card payment
    for (const field of requiredPaymentFields) {
      if (!paymentMethod[field as keyof PaymentMethod]) {
        toast.error(`Please fill in your ${field}`);
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Get current user data for address fields
      const currentUser = await apiClient.getCurrentUser();
      const userData = currentUser.data.user;

      // First, save the shipping address
      const shippingAddressData = await apiClient.addAddress({
        type: "SHIPPING",
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: "",
        address1: shippingAddress.street,
        address2: "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: userData.phone || "",
        isDefault: false,
      });

      // Use the same address for billing or create a separate one
      const billingAddressData = useSameAddress
        ? shippingAddressData
        : await apiClient.addAddress({
            type: "BILLING",
            firstName: userData.firstName,
            lastName: userData.lastName,
            company: "",
            address1: billingAddress.street,
            address2: "",
            city: billingAddress.city,
            state: billingAddress.state,
            postalCode: billingAddress.zipCode,
            country: billingAddress.country,
            phone: userData.phone || "",
            isDefault: false,
          });

      // Create order with address IDs and payment method
      const orderData = {
        items:
          cartItems?.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })) || [],
        shippingAddressId: shippingAddressData.id,
        billingAddressId: billingAddressData.id,
        paymentMethod:
          paymentMethod.type === "card" ? "CREDIT_CARD" : "CASH_ON_DELIVERY",
        notes: "",
      };

      const order = await apiClient.createOrder(orderData);

      // Clear cart after successful order
      clearCart();

      toast.success("Order placed successfully!");

      // Navigate to order confirmation or tracking page
      navigate(`/track?orderId=${order.id}`);
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Complete your purchase by providing shipping and payment information
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sefer/ Village name
                    </label>
                    <Input
                      value={shippingAddress.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      placeholder="Enter your street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kifle Ketema
                    </label>
                    <Input
                      value={shippingAddress.state}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                      placeholder="Enter your state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kebele
                    </label>
                    <Input
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        handleAddressChange("zipCode", e.target.value)
                      }
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <Input
                      value={shippingAddress.country}
                      onChange={(e) =>
                        handleAddressChange("country", e.target.value)
                      }
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    disabled
                    variant={
                      paymentMethod.type === "card" ? "default" : "outline"
                    }
                    onClick={() => setPaymentMethod({ type: "card" })}
                    className="flex-1"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Credit/Debit Card
                  </Button>
                  <Button
                    variant={
                      paymentMethod.type === "cash" ? "default" : "outline"
                    }
                    onClick={() => setPaymentMethod({ type: "cash" })}
                    className="flex-1"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Cash on Delivery
                  </Button>
                </div>

                {paymentMethod.type === "card" && (
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <Input
                        value={paymentMethod.cardNumber || ""}
                        onChange={(e) =>
                          handlePaymentChange("cardNumber", e.target.value)
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <Input
                          value={paymentMethod.cardHolder || ""}
                          onChange={(e) =>
                            handlePaymentChange("cardHolder", e.target.value)
                          }
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <Input
                            value={paymentMethod.expiryDate || ""}
                            onChange={(e) =>
                              handlePaymentChange("expiryDate", e.target.value)
                            }
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <Input
                            value={paymentMethod.cvv || ""}
                            onChange={(e) =>
                              handlePaymentChange("cvv", e.target.value)
                            }
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod.type === "cash" && (
                  <div className="pt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                      <p className="text-blue-800">
                        Pay with cash when your order is delivered
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems?.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.product.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity} ×{" "}
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatPrice(getTotalPrice() * 0.15)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(getTotalPrice() * 1.15)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      Place Order
                      <Truck className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="text-center text-xs text-gray-500">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
