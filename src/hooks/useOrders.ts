import { useQuery } from "@tanstack/react-query";
import { apiClient, Order, Pagination } from "@/lib/api";
import { useIsAuthenticated } from "@/hooks/useAuth";

export function useOrders() {
  const { isAuthenticated } = useIsAuthenticated();

  return useQuery<{ orders: Order[]; pagination: Pagination }, Error>({
    queryKey: ["orders", "user"],
    queryFn: async () => {
      const data = await apiClient.getOrders();
      if (data.success)
        return data.data as unknown as {
          orders: Order[];
          pagination: Pagination;
        };
      else return {} as { orders: Order[]; pagination: Pagination };
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook for getting a single order
export function useOrder(orderId: string) {
  return useQuery<Order, Error>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const order = await apiClient.getOrder(orderId);
      console.log("order from the hook ", order);
      if (order.success) return order.data as unknown as Order;
      else return {} as Order;
    },
    enabled: !!orderId, // Only run query if orderId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
