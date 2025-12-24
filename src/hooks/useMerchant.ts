import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, Pagination, Product, User } from "@/lib/api";
import { DeliveryPayment, DeliveryPaymentsResponse } from "./useDelivery";

// export interface DeliveryOrder {
//   id: string;
//   orderId: string;
//   deliveryUserId: string;
//   merchantId: string;
//   assignedAt: string;
//   pickedUpAt?: string;
//   deliveryAddress: string;
//   deliveryFee: number;
//   paymentType: "SALARY" | "PER_DELIVERY";
//   instructions?: string;
//   estimatedTime?: number;
//   status:
//     | "AVAILABLE"
//     | "BUSY"
//     | "OFFLINE"
//     | "ASSIGNED"
//     | "IN_TRANSIT"
//     | "COMPLETED"
//     | "CANCELLED";
//   completedAt?: string;
//   order: {
//     orderNumber: string;
//     user: {
//       id: string;
//       firstName?: string;
//       lastName?: string;
//       phone?: string;
//     };
//     orderItems: Array<{
//       product: {
//         name: string;
//         weight?: number;
//       };
//       quantity: number;
//       price: number;
//     }>;
//     shippingAddress: {
//       address1: string;
//       city: string;
//       state: string;
//       postalCode: string;
//       phone: string;
//     };
//   };
//   merchant: {
//     id: string;
//     firstName?: string;
//     lastName?: string;
//     phone?: string;
//   };
// }

// export interface DeliveryPayment {
//   id: string;
//   deliveryAssignmentId: string;
//   amount: number;
//   paymentType: "SALARY" | "PER_DELIVERY";
//   status: "PENDING" | "PAID" | "FAILED";
//   baseAmount?: number;
//   distanceBonus?: number;
//   weightBonus?: number;
//   timeBonus?: number;
//   processedAt?: string;
//   notes?: string;
//   createdAt: string;
//   assignment?: {
//     order: {
//       orderNumber: string;
//     };
//   };
//   merchant: {
//     firstName?: string;
//     lastName?: string;
//   };
// }

// export interface DeliveryOrdersResponse {
//   orders: DeliveryOrder[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

// export interface DeliveryPaymentsResponse {
//   payments: DeliveryPayment[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

// Hook for fetching merchant products
export const useMerchantProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: ["merchant-products", params],
    queryFn: async () => {
      const response = await apiClient.getMerchantProducts(params);
      if (response.success) {
        const products = response.data.products || ([] as Product[]);
        const pagination =
          response.data.pagination ||
          ({
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          } as Pagination);
        return { products, pagination };
      }
      return {
        products: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    },
  });
};

// Hook for creating a merchant product
export const useCreateMerchantProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Partial<Product>) =>
      apiClient.createMerchantProduct(productData),
    onSuccess: () => {
      // Invalidate and refetch merchant products
      queryClient.invalidateQueries({ queryKey: ["merchant-products"] });
    },
  });
};

// Hook for updating a merchant product
export const useUpdateMerchantProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      productData,
    }: {
      productId: string;
      productData: Partial<Product>;
    }) => apiClient.updateMerchantProduct(productId, productData),
    onSuccess: () => {
      // Invalidate and refetch merchant products
      queryClient.invalidateQueries({ queryKey: ["merchant-products"] });
    },
  });
};

// Hook for fetching merchant customers
export function useMerchantCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["merchant-customers", params],
    queryFn: async () => {
      const response = await apiClient.getMerchantCustomers(params);
      if (response.success) {
        const customers = response.data.customers || ([] as User[]);
        const pagination =
          response.data.pagination ||
          ({
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          } as Pagination);
        return { customers, pagination };
      }
      return {
        customers: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching single customer details
export function useMerchantCustomer(customerId: string) {
  return useQuery({
    queryKey: ["merchant-customer", customerId],
    queryFn: async () => {
      const response = await apiClient.getMerchantCustomer(customerId);
      if (response.success) {
        return response.data;
      }
      return null;
    },
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for updating merchant order status
export function useUpdateMerchantOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
      notes,
    }: {
      orderId: string;
      status: string;
      notes?: string;
    }) => apiClient.updateMerchantOrderStatus(orderId, status, notes),
    onSuccess: (data, variables) => {
      // Invalidate and refetch merchant orders
      queryClient.invalidateQueries({ queryKey: ["merchant-orders"] });
      // Invalidate specific order
      queryClient.invalidateQueries({
        queryKey: ["merchant-order", variables.orderId],
      });
    },
  });
}
// Hook for fetching delivery orders
export function useDeliveryOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["delivery-orders", params],
    queryFn: async () => {
      const response = await apiClient.getDeliveryOrders(params);
      return response.data;
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
      return response.data as unknown as DeliveryPaymentsResponse;
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
      return response.data as unknown as User[];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
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

// Hook for fetching delivery organizations (for merchants)
export function useDeliveryOrganizations() {
  return useQuery({
    queryKey: ["delivery-organizations"],
    queryFn: async () => {
      const response = await apiClient.getDeliveryOrganizations();
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook for requesting delivery from an organization (for merchants)
export function useRequestDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: {
        organizationId: string;
        deliveryFee: number;
        instructions?: string;
      };
    }) => apiClient.requestDelivery(orderId, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch merchant orders
      queryClient.invalidateQueries({ queryKey: ["merchant-orders"] });
      // Invalidate specific order
      queryClient.invalidateQueries({
        queryKey: ["merchant-order", variables.orderId],
      });
      // Invalidate order if used in useOrder hook
      queryClient.invalidateQueries({
        queryKey: ["order", variables.orderId],
      });
    },
  });
}
