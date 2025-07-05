import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, Order, Product, User } from "@/lib/api";

// Admin query keys
export const adminKeys = {
  all: ["admin"] as const,
  products: () => [...adminKeys.all, "products"] as const,
  orders: () => [...adminKeys.all, "orders"] as const,
  customers: () => [...adminKeys.all, "customers"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
};

// Get admin dashboard stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () =>
      apiClient.getAdminStats().then((data) => {
        if (data.success) {
          return data.data;
        }
        return [];
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get all products for admin (with pagination and filters)
export const useAdminProducts = (filters?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...adminKeys.products(), filters],
    queryFn: () =>
      apiClient.getAdminProducts(filters).then((data) => {
        if (data.success) {
          return data.data;
        }
        return {} as {
          products: Product[];
          total: number;
          page: number;
          totalPages: number;
        };
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all orders for admin
export const useAdminOrders = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: [...adminKeys.orders(), filters],
    queryFn: () =>
      apiClient.getAdminOrders(filters).then((data) => {
        if (data.success) {
          return data.data;
        }
        return {} as {
          orders: Order[];
          total: number;
          page: number;
          totalPages: number;
        };
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all customers for admin
export const useAdminCustomers = (filters?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...adminKeys.customers(), filters],
    queryFn: () =>
      apiClient.getAdminCustomers(filters).then((data) => {
        if (data.success) {
          return data.data;
        }
        return {} as {
          customers: User[];
          total: number;
          page: number;
          totalPages: number;
        };
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: any) => apiClient.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.setQueryData(
        ["products", "detail", updatedProduct.id],
        updatedProduct
      );
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.removeQueries({
        queryKey: ["products", "detail", deletedId],
      });
    },
  });
};

// Update order status mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Export data mutations
export const useExportOrders = () => {
  return useMutation({
    mutationFn: (filters?: any) => apiClient.exportOrders(filters),
  });
};

export const useExportProducts = () => {
  return useMutation({
    mutationFn: (filters?: any) => apiClient.exportProducts(filters),
  });
};

export const useExportCustomers = () => {
  return useMutation({
    mutationFn: (filters?: any) => apiClient.exportCustomers(filters),
  });
};
