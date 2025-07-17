// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiClient, Product } from "@/lib/api";

// export function useWishlist() {
//   return useQuery<Product[]>({
//     queryKey: ["wishlist"],
//     queryFn: apiClient.getWishlist,
//   });
// }

// export function useAddToWishlist() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (productId: string) => apiClient.addToWishlist(productId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["wishlist"] });
//     },
//   });
// }

// export function useRemoveFromWishlist() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (productId: string) => apiClient.removeFromWishlist(productId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["wishlist"] });
//     },
//   });
// }
