import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, Product, Category } from "@/lib/api";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, "featured"] as const,
  sale: () => [...productKeys.all, "sale"] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

type ProductFilters = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  featured?: boolean;
  onSale?: boolean;
};

// Get all products with filters
export const useProducts = (filters?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  featured?: boolean;
  onSale?: boolean;
}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () =>
      apiClient.getProducts(filters).then((res) => {
        // console.log("Products from apiClient.getProducts:", res);
        if (res.success) {
          return res.data;
        }
        return {} as {
          products: Product[];
          pagination: {
            page: number;
            total: number;
            totalPages: number;
            limit: number;
          };
        };
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () =>
      apiClient
        .getCategories()
        .then((res) => {
          console.log("Categories from apiClient.getCategories:", res);
          if (res.success) {
            return res.data.categories;
          }
          return [];
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          return [];
        }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () =>
      apiClient.getFeaturedProducts().then((res) => {
        if (res.success) {
          console.log("Featured products from useQuery:", res.data.products);
          return res.data.products;
        }
        return [];
      }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get sale products
export const useSaleProducts = () => {
  return useQuery({
    queryKey: productKeys.sale(),
    queryFn: () => apiClient.getSaleProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create product (Admin only)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Product) => apiClient.createProduct(productData),
    onSuccess: () => {
      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update product (Admin only)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Product }) =>
      apiClient.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Update product in cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct
      );
      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Delete product (Admin only)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
