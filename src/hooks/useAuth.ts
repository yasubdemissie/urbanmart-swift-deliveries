import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, LoginCredentials, RegisterData, User } from "@/lib/api";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => apiClient.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.login(credentials),
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => apiClient.register(userData),
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      // Set user data in cache
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
  // const { data: user, isLoading, error } = useCurrentUser();
  // Don't forget to delete this data
  const { data, isLoading, error } = useCurrentUser();
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "admin",
  };
  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
  };
};
