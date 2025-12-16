import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, LoginCredentials, RegisterData, User } from "@/lib/api";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// Get current user
export const useCurrentUser = () => {
  // Check token directly instead of using state to avoid race conditions
  const token = localStorage.getItem("token");
  const hasToken = !!token;

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        const data = await apiClient.getCurrentUser();

        if (data.success && data.data?.user) {
          return data.data.user;
        }

        return null;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes - increased stale time
    enabled: hasToken,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false, // Prevent refetch on network reconnect
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.login(credentials),
    onSuccess: (response) => {
      // Handle the wrapped API response
      const { data } = response as unknown as {
        data: { user: User; token: string };
      };

      // Store token first
      localStorage.setItem("token", data.token);

      // Set user data in cache immediately
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => apiClient.register(userData),
    onSuccess: (response) => {
      // Handle the wrapped API response
      const { data } = response as unknown as {
        data: { user: User; token: string };
      };

      // Store token first
      localStorage.setItem("token", data.token);

      // Set user data in cache immediately
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: Partial<User>) =>
      apiClient.updateProfile(profileData),
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(authKeys.user(), updatedUser);
    },
  });
};

// Request role change mutation
export const useRequestRoleChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      role: "MERCHANT" | "DELIVERY";
      merchantData?: { shopName: string; businessType: string; description?: string };
      deliveryData?: any;
    }) => apiClient.requestRoleChange(data),
    onSuccess: (response) => {
      // Update user data in cache with the new user object returned
      if (response.success && response.user) {
        queryClient.setQueryData(authKeys.user(), response.user);
      } else {
        // Fallback: invalidate cache to refetch fresh user data
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
      }
    },
  });
};

// Change password mutation
// export const useChangePassword = () => {
//   return useMutation({
//     mutationFn: (passwords: { currentPassword: string; newPassword: string }) =>
//       apiClient.changePassword(passwords),
//   });
// };

// Logout function
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Clear all queries from cache
    queryClient.clear();
  };
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const { data, isLoading, error } = useCurrentUser();
  const user = data;

  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
  };
};
