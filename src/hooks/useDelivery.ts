import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, User } from "@/lib/api";

export interface DeliveryOrder {
  id: string;
  orderId: string;
  deliveryUserId: string;
  merchantId: string;
  assignedAt: string;
  pickedUpAt?: string;
  deliveryAddress: string;
  deliveryFee: number;
  paymentType: "SALARY" | "PER_DELIVERY";
  instructions?: string;
  estimatedTime?: number;
  status:
    | "AVAILABLE"
    | "BUSY"
    | "OFFLINE"
    | "ASSIGNED"
    | "IN_TRANSIT"
    | "COMPLETED"
    | "CANCELLED";
  completedAt?: string;
  order: {
    orderNumber: string;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
    orderItems: Array<{
      product: {
        name: string;
        weight?: number;
      };
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      address1: string;
      city: string;
      state: string;
      postalCode: string;
      phone: string;
    };
  };
  merchant: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

export interface DeliveryPayment {
  id: string;
  deliveryAssignmentId: string;
  amount: number;
  paymentType: "SALARY" | "PER_DELIVERY";
  status: "PENDING" | "PAID" | "FAILED";
  baseAmount?: number;
  distanceBonus?: number;
  weightBonus?: number;
  timeBonus?: number;
  processedAt?: string;
  notes?: string;
  createdAt: string;
  assignment?: {
    order: {
      orderNumber: string;
    };
  };
  merchant: {
    firstName?: string;
    lastName?: string;
  };
}

export interface DeliveryOrdersResponse {
  orders: DeliveryOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DeliveryPaymentsResponse {
  payments: DeliveryPayment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Hook for fetching delivery orders
export function useDeliveryOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery<DeliveryOrdersResponse, Error>({
    queryKey: ["delivery-orders", params],
    queryFn: async (): Promise<DeliveryOrdersResponse> => {
      const response = await apiClient.getDeliveryOrders(params);
      if (response.success) {
        return response.data as unknown as DeliveryOrdersResponse;
      }
      throw new Error(response.error || "Failed to fetch delivery orders");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for updating delivery assignment status
export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      status,
      instructions,
    }: {
      assignmentId: string;
      status: string;
      instructions?: string;
    }) => apiClient.updateDeliveryStatus(assignmentId, status, instructions),
    onSuccess: (data, variables) => {
      // Invalidate and refetch delivery orders
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      // Also invalidate merchant orders since order status changes
      queryClient.invalidateQueries({ queryKey: ["merchant-orders"] });
    },
  });
}

// Hook for fetching delivery payments
export function useDeliveryPayments(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery<DeliveryPaymentsResponse, Error>({
    queryKey: ["delivery-payments", params],
    queryFn: async (): Promise<DeliveryPaymentsResponse> => {
      const response = await apiClient.getDeliveryPayments(params);
      if (response.success) {
        return response.data as unknown as DeliveryPaymentsResponse;
      }
      throw new Error(response.error || "Failed to fetch delivery payments");
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching available delivery persons (for merchants)
export function useAvailableDeliveryPersons() {
  return useQuery<User[], Error>({
    queryKey: ["available-delivery-persons"],
    queryFn: async (): Promise<User[]> => {
      const response = await apiClient.getAvailableDeliveryPersons();
      if (response.success) {
        return response.data as unknown as User[];
      }
      throw new Error(
        response.error || "Failed to fetch available delivery persons"
      );
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook for fetching delivery statistics
export function useDeliveryStats() {
  return useQuery({
    queryKey: ["delivery-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/delivery/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for assigning delivery to an order (for merchants)
export function useAssignDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      orderId: string;
      deliveryUserId: string;
      deliveryFee: number;
      paymentType: "SALARY" | "PER_DELIVERY";
      estimatedTime?: number;
      instructions?: string;
    }) => apiClient.assignDelivery(data),
    onSuccess: () => {
      // Invalidate and refetch merchant orders
      queryClient.invalidateQueries({ queryKey: ["merchant-orders"] });
      // Invalidate available delivery persons
      queryClient.invalidateQueries({
        queryKey: ["available-delivery-persons"],
      });
    },
  });
}
