import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient, {
  Order,
  User,
  Report,
  Transaction,
  MerchantStore,
  Pagination,
} from "@/lib/api";

// Admin query keys
export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  reports: () => [...adminKeys.all, "reports"] as const,
  transactions: () => [...adminKeys.all, "transactions"] as const,
  merchantStores: () => [...adminKeys.all, "merchantStores"] as const,
};

// Get admin dashboard stats
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => apiClient.getAdminDashboard(),
    staleTime: 5 * 60 * 1000,
  });
};

// Get all users for admin
export const useAdminUsers = (filters?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...adminKeys.users(), filters],
    queryFn: async () => {
      const response = await apiClient.getUsers(filters);
      if (response.success) {
        return response.data;
      }
      return {
        users: [] as User[],
        pagination: { total: 0, page: 1, limit: 10 } as Pagination,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Get all reports for admin
export const useAdminReports = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: [...adminKeys.reports(), filters],
    queryFn: () => apiClient.getReports(filters),
    staleTime: 2 * 60 * 1000,
  });
};

// Get all transactions for admin
export const useAdminTransactions = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: [...adminKeys.transactions(), filters],
    queryFn: () => apiClient.getTransactions(filters),
    staleTime: 2 * 60 * 1000,
  });
};

// Get all merchant stores for admin
export const useAdminMerchantStores = (filters?: {
  page?: number;
  limit?: number;
  isVerified?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...adminKeys.merchantStores(), filters],
    queryFn: () => apiClient.getMerchantStores(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// Update user role mutation
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: User["role"] }) =>
      apiClient.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

// Update user status mutation
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      apiClient.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

// Assign report mutation
export const useAssignReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      assignedAdminId,
    }: {
      reportId: string;
      assignedAdminId: string;
    }) => apiClient.assignReport(reportId, assignedAdminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
    },
  });
};

// Update report status mutation
export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      status,
    }: {
      reportId: string;
      status: Report["status"];
    }) => apiClient.updateReportStatus(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
    },
  });
};

// Verify merchant store mutation
export const useVerifyMerchantStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      storeId,
      isVerified,
    }: {
      storeId: string;
      isVerified: boolean;
    }) => apiClient.verifyMerchantStore(storeId, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.merchantStores() });
    },
  });
};
