import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, WishlistItem } from "@/lib/api";
import { useIsAuthenticated } from "@/hooks/useAuth";

export const wishlistKeys = {
  all: ["wishlist"] as const,
  list: () => [...wishlistKeys.all, "list"] as const,
};

export function useWishlist() {
  const { isAuthenticated } = useIsAuthenticated();

  return useQuery<WishlistItem[]>({
    queryKey: wishlistKeys.list(),
    queryFn: () => apiClient.getWishlist(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => apiClient.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => apiClient.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}
