import apiClient, { Order } from "@/lib/api";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

// Orders Tab Component
export const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiClient.getMerchantOrders({ limit: 20 });
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading orders...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Orders</h3>

      <div className="space-y-4">
        {orders?.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">#{order.orderNumber}</h4>
                  <p className="text-sm text-gray-600">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <Badge
                    variant={
                      order.status === "DELIVERED"
                        ? "default"
                        : order.status === "SHIPPED"
                        ? "secondary"
                        : order.status === "PENDING"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
