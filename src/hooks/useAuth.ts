import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, LoginRequest, RegisterRequest, User } from '@/lib/api';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
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
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data) => {
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
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
    onSuccess: (data) => {
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
    mutationFn: (profileData: Partial<User>) => apiClient.updateProfile(profileData),
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(authKeys.user(), updatedUser);
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwords: { currentPassword: string; newPassword: string }) =>
      apiClient.changePassword(passwords),
  });
};

// Logout function
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return () => {
    apiClient.logout();
    // Clear all queries from cache
    queryClient.clear();
  };
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
  };
}; 