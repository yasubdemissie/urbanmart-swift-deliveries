import { Pagination } from "@/components/ui/pagination";

// API Client for UrbanMart Swift Deliveries
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MERCHANT" | "CUSTOMER";
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  merchantStore?: MerchantStore;
}

export interface MerchantStore {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  merchant?: User;
  products?: Product[];
  orders?: Order[];
}

export interface Report {
  id: string;
  reporterId: string;
  assignedAdminId?: string;
  type:
    | "TECHNICAL_ISSUE"
    | "PAYMENT_PROBLEM"
    | "PRODUCT_COMPLAINT"
    | "MERCHANT_COMPLAINT"
    | "GENERAL_INQUIRY"
    | "ACCOUNT_ISSUE";
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  createdAt: string;
  updatedAt: string;
  reporter?: User;
  assignedAdmin?: User;
}

export interface Transaction {
  id: string;
  orderId: string;
  merchantId?: string;
  amount: number;
  type: "PAYMENT" | "REFUND" | "COMMISSION" | "WITHDRAWAL";
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  paymentMethod:
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "PAYPAL"
    | "BANK_TRANSFER"
    | "CASH_ON_DELIVERY";
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
  merchant?: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePercentage?: number;
  categoryId: string;
  merchantStoreId?: string;
  category?: Category;
  merchantStore?: MerchantStore;
  brand?: string;
  tags: string[];
  images: string[];
  mainImage?: string;
  createdAt: string;
  updatedAt: string;
  // Review-related properties from backend
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  merchantId?: string;
  storeId?: string;
  user?: User;
  merchant?: User;
  store?: MerchantStore;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  currency: string;
  paymentMethod:
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "PAYPAL"
    | "BANK_TRANSFER"
    | "CASH_ON_DELIVERY";
  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: OrderStatusHistory[];
  transactions?: Transaction[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: Order["status"];
  notes?: string;
  updatedBy?: string;
  updater?: User;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  type: "SHIPPING" | "BILLING" | "BOTH";
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  user?: User;
  product?: Product;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}

// Dashboard Types
export interface AdminDashboard {
  stats: {
    users: Record<string, number>;
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
  };
  recentReports: Report[];
  recentTransactions: Transaction[];
}

export interface MerchantDashboard {
  store: MerchantStore;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    lowStockCount: number;
  };
  recentOrders: Order[];
  lowStockProducts: Product[];
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Client
export const apiClient = {
  // Auth
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Registration failed");
    }

    const result = await response.json();
    localStorage.setItem("token", result.token);
    return result;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("token");
  },

  // Get current user
  async getCurrentUser(): Promise<{ success: boolean; data: { user: User } }> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      throw new Error("Invalid token");
    }

    const data = await response.json();
    // The backend returns { success: true, message: "Success", data: { user: ... } }
    // We need to return it as { success: true, data: { user: ... } }
    return {
      success: data.success,
      data: data.data, // data.data contains { user: ... }
    };
  },

  // Update profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update profile");
    }

    return response.json();
  },

  // Products
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ products: Product[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch products");
    }

    return response.json();
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch product");
    }

    return response.json();
  },

  async getProductReviews(productId: string): Promise<Review[]> {
    const response = await fetch(
      `${API_BASE_URL}/reviews/product/${productId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch reviews");
    }

    return response.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch categories");
    }

    return response.json();
  },

  // Cart
  async getCart(): Promise<CartItem[]> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch cart");
    }

    return response.json();
  },

  async addToCart(productId: string, quantity: number): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add to cart");
    }

    return response.json();
  },

  async updateCartItem(productId: string, quantity: number): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update cart item");
    }

    return response.json();
  },

  async removeFromCart(productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to remove from cart");
    }
  },

  async clearCart(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to clear cart");
    }
  },

  // Orders
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ orders: Order[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);

    const response = await fetch(`${API_BASE_URL}/orders?${searchParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch orders");
    }

    return response.json();
  },

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch order");
    }

    return response.json();
  },

  async createOrder(orderData: any): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create order");
    }

    return response.json();
  },

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update order status");
    }

    return response.json();
  },

  async getOrderStatusHistory(
    orderId: string
  ): Promise<ApiResponse<OrderStatusHistory[]>> {
    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/status-history`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch order status history"
      );
    }

    return response.json();
  },

  // Admin
  async getAdminDashboard(): Promise<AdminDashboard> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch admin dashboard");
    }

    return response.json();
  },

  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<ApiResponse<{ users: User[]; pagination: Pagination }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.role) searchParams.append("role", params.role);
    if (params?.search) searchParams.append("search", params.search);

    const response = await fetch(
      `${API_BASE_URL}/admin/users?${searchParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch users");
    }

    return response.json();
  },

  async updateUserRole(userId: string, role: User["role"]): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update user role");
    }

    return response.json();
  },

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${userId}/status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update user status");
    }

    return response.json();
  },

  async getReports(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    type?: string;
  }): Promise<{ reports: Report[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.priority) searchParams.append("priority", params.priority);
    if (params?.type) searchParams.append("type", params.type);

    const response = await fetch(
      `${API_BASE_URL}/admin/reports?${searchParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch reports");
    }

    return response.json();
  },

  async assignReport(
    reportId: string,
    assignedAdminId: string
  ): Promise<Report> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reports/${reportId}/assign`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ assignedAdminId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to assign report");
    }

    return response.json();
  },

  async updateReportStatus(
    reportId: string,
    status: Report["status"]
  ): Promise<Report> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reports/${reportId}/status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update report status");
    }

    return response.json();
  },

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<{ transactions: Transaction[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.type) searchParams.append("type", params.type);

    const response = await fetch(
      `${API_BASE_URL}/admin/transactions?${searchParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch transactions");
    }

    return response.json();
  },

  async getMerchantStores(params?: {
    page?: number;
    limit?: number;
    isVerified?: boolean;
    search?: string;
  }): Promise<{ stores: MerchantStore[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.isVerified !== undefined)
      searchParams.append("isVerified", params.isVerified.toString());
    if (params?.search) searchParams.append("search", params.search);

    const response = await fetch(
      `${API_BASE_URL}/admin/merchant-stores?${searchParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch merchant stores");
    }

    return response.json();
  },

  async verifyMerchantStore(
    storeId: string,
    isVerified: boolean
  ): Promise<MerchantStore> {
    const response = await fetch(
      `${API_BASE_URL}/admin/merchant-stores/${storeId}/verify`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isVerified }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to verify merchant store");
    }

    return response.json();
  },

  // Merchant
  async getMerchantDashboard(): Promise<ApiResponse<MerchantDashboard>> {
    const response = await fetch(`${API_BASE_URL}/merchant/dashboard`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch merchant dashboard");
    }

    return response.json();
  },

  async getMerchantProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<{ products: Product[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);

    const response = await fetch(
      `${API_BASE_URL}/merchant/products?${searchParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch merchant products");
    }

    return response.json();
  },

  async createMerchantProduct(productData: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/merchant/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create product");
    }

    return response.json();
  },

  async updateMerchantProduct(
    productId: string,
    productData: Partial<Product>
  ): Promise<Product> {
    const response = await fetch(
      `${API_BASE_URL}/merchant/products/${productId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update product");
    }

    return response.json();
  },

  async getMerchantOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ orders: Order[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);

    const response = await fetch(
      `${API_BASE_URL}/merchant/orders?${searchParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch merchant orders");
    }

    return response.json();
  },

  async updateMerchantOrderStatus(
    orderId: string,
    status: Order["status"],
    notes?: string
  ): Promise<Order> {
    const response = await fetch(
      `${API_BASE_URL}/merchant/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update order status");
    }

    return response.json();
  },

  async getMerchantCustomers(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ customers: User[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/merchant/customers?${searchParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch merchant customers");
    }

    return response.json();
  },

  async updateMerchantStore(
    storeData: Partial<MerchantStore>
  ): Promise<MerchantStore> {
    const response = await fetch(`${API_BASE_URL}/merchant/store`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(storeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update store");
    }

    return response.json();
  },

  // Reports
  async submitReport(reportData: {
    type: Report["type"];
    title: string;
    description: string;
    priority?: Report["priority"];
  }): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit report");
    }

    return response.json();
  },

  async getMyReports(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ reports: Report[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);

    const response = await fetch(
      `${API_BASE_URL}/reports/my-reports?${searchParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch reports");
    }

    return response.json();
  },
};

export default apiClient;
