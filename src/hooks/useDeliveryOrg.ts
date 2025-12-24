import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api/delivery-org";

// Types
export interface DeliveryOrg {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  ownerId: string;
  members: any[];
  assignments: any[];
  hiringRequests: any[];
  isOwner: boolean;
}

export interface HiringRequest {
  id: string;
  organizationId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  type: "INVITATION" | "APPLICATION";
  message: string | null;
  organization: {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    owner: {
      firstName: string;
      lastName: string;
    };
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  deliveryFee: number;
  status: string;
  merchant: {
    firstName: string;
    lastName: string;
  };
  order: {
    orderNumber: string;
    shippingAddress: {
      address1: string;
      city: string;
      state: string;
      postalCode: string;
    };
    orderItems: any[];
  };
}

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const useDeliveryOrg = () => {
  return useQuery({
    queryKey: ["delivery-org"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: getAuthHeader(),
      });
      if (data.success) {
        return data.data;
      }
      return null;
    },
    retry: 1,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orgData: { name: string; description?: string }) => {
      const { data } = await axios.post(`${API_URL}/`, orgData, {
        headers: getAuthHeader(),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-org"] });
      toast.success("Organization created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Failed to create organization"
      );
    },
  });
};

export const useSendHiringRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; message: string }) => {
      const response = await axios.post(`${API_URL}/members/invite`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-org"] });
      toast.success("Invitation sent successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to send invitation");
    },
  });
};

export const useDeliveryRequests = () => {
  return useQuery({
    queryKey: ["delivery-org-requests"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/requests/delivery`, {
        headers: getAuthHeader(),
      });
      if (data.success) {
        return data.data;
      }
      return null;
    },
  });
};

export const useReviewDeliveryRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "ASSIGNED" | "CANCELLED";
    }) => {
      const { data } = await axios.patch(
        `${API_URL}/requests/delivery/${id}`,
        { status },
        { headers: getAuthHeader() }
      );
      if (data.success) {
        return data.data;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-org-requests"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-org"] }); // Assignments update
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      toast.success("Request updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update request");
    },
  });
};

export const useAssignMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      assignmentId,
      memberId,
    }: {
      assignmentId: string;
      memberId: string;
    }) => {
      const { data } = await axios.post(
        `${API_URL}/assignments/${assignmentId}/assign`,
        { memberId },
        { headers: getAuthHeader() }
      );
      if (data.success) {
        return data.data;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-org"] });
      toast.success("Assigned member successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to assign member");
    },
  });
};

export const useAllOrganizations = () => {
  return useQuery({
    queryKey: ["all-delivery-orgs"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/`, {
        headers: getAuthHeader(),
      });
      if (data.success) {
        return data.data;
      }
      return [];
    },
  });
};

export const useApplyToOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { organizationId: string; message: string }) => {
      const response = await axios.post(`${API_URL}/requests/apply`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiring-requests"] });
      toast.success("Application sent successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to send application");
    },
  });
};

export const useHiringRequests = () => {
  return useQuery({
    queryKey: ["hiring-requests"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/requests/hiring`, {
        headers: getAuthHeader(),
      });
      if (data.success) {
        return data.data as HiringRequest[];
      }
      return [];
    },
  });
};

export const useRespondToHiringRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "ACCEPTED" | "REJECTED";
    }) => {
      const { data } = await axios.patch(
        `${API_URL}/requests/hiring/${id}`,
        { status },
        { headers: getAuthHeader() }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiring-requests"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-org"] });
      toast.success("Response submitted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to submit response");
    },
  });
};
