import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, User, LogIn } from "lucide-react";
import Header from "@/components/Custom/Header";
import Footer from "@/components/Custom/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/useOrders";
import { apiClient, Order, OrderStatusHistory } from "@/lib/api";
import { useIsAuthenticated } from "@/hooks/useAuth";

const TrackOrder = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useIsAuthenticated();
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch status history when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      setIsLoadingHistory(true);
      apiClient
        .getOrderStatusHistory(selectedOrder.id)
        .then((response) => {
          if (response.success) {
            setStatusHistory(response.data.statusHistory);
          }
        })
        .catch((error) => {
          console.error("Error fetching status history:", error);
          setStatusHistory([]);
        })
        .finally(() => {
          setIsLoadingHistory(false);
        });
    }
  }, [selectedOrder]);

  const getStatusIcon = (
    status: string,
    isCompleted: boolean,
    isCurrent: boolean
  ) => {
    if (isCurrent) return <Truck className="h-5 w-5 text-blue-600" />;
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (isCompleted: boolean, isCurrent: boolean) => {
    if (isCurrent) return "border-blue-600 bg-blue-50";
    if (isCompleted) return "border-green-600 bg-green-50";
    return "border-gray-300 bg-gray-50";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Loading
                </h2>
                <p className="text-gray-600">Please wait...</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <LogIn className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign In Required
                </h2>
                <p className="text-gray-600 mb-6">
                  Please sign in to view your order tracking information.
                </p>
                <Button onClick={() => (window.location.href = "/auth/login")}>
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Show loading state
  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Loading Orders
                </h2>
                <p className="text-gray-600">
                  Please wait while we fetch your orders...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Show no orders message
  if (!ordersData?.orders || ordersData.orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Orders Found
                </h2>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet. Start shopping to see your
                  order tracking here.
                </p>
                <Button onClick={() => (window.location.href = "/products")}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
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
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Orders
          </h1>
          <p className="text-gray-600">
            Select an order to view its tracking information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Orders
            </h2>
            {ordersData.orders.map((order) => (
              <Card
                key={order.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedOrder?.id === order.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Total: ${Number(order.total).toFixed(2)}</p>
                    <p>Items: {order.orderItems.length}</p>
                    <p>Date: {formatDate(order.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Status History */}
          <div className="space-y-4">
            {selectedOrder ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order #{selectedOrder.id.slice(-8)} Status
                </h2>

                {/* Order Summary */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Order #{selectedOrder.id.slice(-8)}
                        </h3>
                        <p className="text-gray-600">
                          Current Status:
                          <Badge
                            className={`ml-2 ${getStatusBadgeColor(
                              selectedOrder.status
                            )}`}
                          >
                            {selectedOrder.status}
                          </Badge>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-semibold text-gray-900">
                          ${Number(selectedOrder.total).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-blue-800 font-medium">
                          {selectedOrder.orderItems.length} item(s) ordered
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status History Timeline */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Status History
                    </h3>

                    {isLoadingHistory ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">
                          Loading history...
                        </span>
                      </div>
                    ) : statusHistory.length > 0 ? (
                      <div className="space-y-4">
                        {statusHistory.map((history, index) => {
                          const isCompleted =
                            index === 0 ||
                            statusHistory[index - 1]?.status !== history.status;
                          const isCurrent = index === 0;

                          return (
                            <div key={history.id} className="flex items-start">
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(
                                  isCompleted,
                                  isCurrent
                                )}`}
                              >
                                {getStatusIcon(
                                  history.status,
                                  isCompleted,
                                  isCurrent
                                )}
                              </div>

                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <h4
                                    className={`font-medium ${
                                      isCurrent
                                        ? "text-blue-600"
                                        : isCompleted
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {history.status.replace("_", " ")}
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(history.timestamp)}
                                  </span>
                                </div>
                                {history.notes && (
                                  <p className="text-gray-600 text-sm mt-1">
                                    {history.notes}
                                  </p>
                                )}
                                {history.updater && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Updated by: {history.updater.firstName}{" "}
                                    {history.updater.lastName}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>No status history available for this order.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select an Order
                  </h3>
                  <p className="text-gray-600">
                    Choose an order from the list to view its tracking
                    information.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {selectedOrder && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-4">
              Need help? Contact our customer service team
            </p>
            <div className="space-x-4">
              <Button variant="outline" size="sm">
                📞 Call Support
              </Button>
              <Button variant="outline" size="sm">
                💬 Live Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
