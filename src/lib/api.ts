// API Client for UrbanMart Swift Deliveries
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
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
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categoryId: string;
  category?: Category;
  stock: number;
  featured: boolean;
  onSale: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
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
  userId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: Address;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

type AuthResponse = ApiResponse<{
  user: User;
  token: string;
}>;

type AdminStatResponse = ApiResponse<{
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: Product[];
}>;

type AdminProductResponse = ApiResponse<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}>;

type CategoryResponse = ApiResponse<{ categories: Category[] }>;

type UserResponse = ApiResponse<{ user: User }>;

type CartItemResponse = ApiResponse<{ cartItem: CartItem[] }>;

type ProductResponse = ApiResponse<{
  products: Product[];
  pagination: Pagination;
}>;

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// API Client
export const apiClient = {
  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserResponse>(response);
  },

  // Product endpoints
  async getProducts(filters?: {
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
  }): Promise<ProductResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/products?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Product>(response);
  },

  async getFeaturedProducts(): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products/featured`, {
      headers: getAuthHeaders(),
    });
    console.log(
      "Featured products from apiClient.getFeaturedProducts:",
      response
    );
    return handleResponse<ProductResponse>(response);
  },

  async getSaleProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/sale`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Product[]>(response);
  },

  async createProduct(productData: any): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse<Product>(response);
  },

  async updateProduct(id: string, productData: any): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse<Product>(response);
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  },

  // Category endpoints
  async getCategories(): Promise<CategoryResponse> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<CategoryResponse>(response);
  },

  async getCategory(id: string): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Category>(response);
  },

  // Cart endpoints
  async getCart(): Promise<CartItemResponse> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<CartItemResponse>(response);
  },

  async addToCart(
    productId: string,
    quantity: number
  ): Promise<CartItemResponse> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse<CartItemResponse>(response);
  },

  async updateCartItem(
    itemId: string,
    quantity: number
  ): Promise<CartItemResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse<CartItemResponse>(response);
  },

  async removeFromCart(itemId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  },

  async clearCart(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  },

  // Order endpoints
  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Order[]>(response);
  },

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Order>(response);
  },

  async createOrder(orderData: {
    items: { productId: string; quantity: number }[];
    shippingAddress: Omit<Address, "id" | "userId" | "isDefault">;
  }): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse<Order>(response);
  },

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<Order>(response);
  },

  // Review endpoints
  async getProductReviews(productId: string): Promise<Review[]> {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/reviews`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<Review[]>(response);
  },

  async createReview(
    productId: string,
    reviewData: {
      rating: number;
      comment: string;
    }
  ): Promise<Review> {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/reviews`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData),
      }
    );
    return handleResponse<Review>(response);
  },

  // User endpoints
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse<User>(response);
  },

  async getAddresses(): Promise<Address[]> {
    const response = await fetch(`${API_BASE_URL}/users/addresses`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Address[]>(response);
  },

  async addAddress(
    addressData: Omit<Address, "id" | "userId">
  ): Promise<Address> {
    const response = await fetch(`${API_BASE_URL}/users/addresses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });
    return handleResponse<Address>(response);
  },

  async updateAddress(
    id: string,
    addressData: Partial<Address>
  ): Promise<Address> {
    const response = await fetch(`${API_BASE_URL}/users/addresses/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });
    return handleResponse<Address>(response);
  },

  async deleteAddress(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/addresses/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  },

  // Admin endpoints
  async getAdminStats(): Promise<AdminStatResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getAdminProducts(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<AdminProductResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/admin/products?${params}`, {
      headers: getAuthHeaders(),
    });
    console.log("AdminProducts from the api ", response);
    return handleResponse<AdminProductResponse>(response);
  },

  async getAdminOrders(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<
    ApiResponse<{
      orders: Order[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      headers: getAuthHeaders(),
    });
    console.log("Get Admin order api ", response);
    return handleResponse(response);
  },

  async getAdminCustomers(filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<
    ApiResponse<{
      customers: User[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/admin/customers?${params}`, {
      headers: getAuthHeaders(),
    });
    console.log("Admin customers api ", response);
    return handleResponse(response);
  },

  async exportOrders(filters?: any): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/orders/export?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.blob();
  },

  async exportProducts(filters?: any): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/products/export?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.blob();
  },

  async exportCustomers(filters?: any): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/customers/export?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.blob();
  },
};

export default apiClient;
