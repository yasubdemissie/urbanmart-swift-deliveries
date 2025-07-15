import { useQuery } from "@tanstack/react-query";
import { apiClient, Order, OrdersWithPagination } from "@/lib/api";

export function useOrders() {
  return useQuery<OrdersWithPagination, Error>({
    queryKey: ["orders", "user"],
    queryFn: async () => {
      const data = await apiClient.getOrders().then((data) => {
        console.log(data.data);
        if (data.success) return data.data;
        else return {} as OrdersWithPagination;
      });
      return data;
    },
    staleTime: 0 * 60 * 1000, // 2 minutes
  });
}
