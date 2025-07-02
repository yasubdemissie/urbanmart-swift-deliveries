import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, CartItem } from "@/lib/api";

// Query keys
export const cartKeys = {
  all: ["cart"] as const,
  items: () => [...cartKeys.all, "items"] as const,
  count: () => [...cartKeys.all, "count"] as const,
};

// Get cart items
export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.items(),
    queryFn: () => apiClient.getCart(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get cart count
export const useCartCount = () => {
  const { data: cartItems = [] } = useCart();
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    data: count,
    isLoading: false,
  };
};

// Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => apiClient.addToCart(productId, quantity),
    onSuccess: () => {
      // Invalidate cart data
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};

// Update cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      apiClient.updateCartItem(id, quantity),
    onSuccess: () => {
      // Invalidate cart data
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};

// Remove item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.removeFromCart(id),
    onSuccess: () => {
      // Invalidate cart data
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.clearCart(),
    onSuccess: () => {
      // Invalidate cart data
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};
