import apiClient, { Order, Pagination } from "@/lib/api";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon, List } from "lucide-react";
import OrderCard from "../Order/OrderCard";

// Loading skeleton component
const LoadingCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Orders Tab Component
export const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.getMerchantOrders({
          limit: 20,
          page: page,
        });
        if (response.success) {
          const orderData = response.data?.orders || [];
          setOrders(orderData as Order[]);
          setPagination(response.data?.pagination as unknown as Pagination);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const handleViewDetails = (orderId: string) => {
    // Navigate to order details page
    console.log("View details for order:", orderId);
    // You can implement navigation here
  };

  const handleEditOrder = (orderId: string) => {
    // Navigate to edit order page
    console.log("Edit order:", orderId);
    // You can implement navigation here
  };

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    // Update order status
    console.log("Update order status:", orderId, status);
    // You can implement status update here
  };

  console.log("orders: ", orders);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination?.hasPrev === false}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination?.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination?.hasNext === false}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <LoadingCardSkeleton key={i} />
            ))}
          </div>
        ) : orders?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order: Order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
                onEditOrder={handleEditOrder}
                onUpdateStatus={handleUpdateOrderStatus}
                isAdmin={false} // Merchant view, not admin
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};
