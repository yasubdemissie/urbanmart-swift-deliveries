import { useState } from "react";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useProducts";
import {
  useAdminStats,
  useAdminProducts,
  useAdminOrders,
  useAdminCustomers,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateOrderStatus,
  useExportOrders,
  useExportProducts,
  useExportCustomers,
} from "@/hooks/useAdmin";

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useIsAuthenticated();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: categories = [] } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useAdminProducts({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({
    page: currentPage,
    limit: 10,
  });
  const { data: customersData, isLoading: customersLoading } =
    useAdminCustomers({
      page: currentPage,
      limit: 10,
      search: searchQuery || undefined,
    });

  console.log("Admin customer data on Page ", customersData);
  // Mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const exportOrdersMutation = useExportOrders();
  const exportProductsMutation = useExportProducts();
  const exportCustomersMutation = useExportCustomers();

  // Check if user is admin
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-8">
              You need admin privileges to access this page.
            </p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        toast.success("Product deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, status });
      toast.success("Order status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  const handleExport = async (type: "orders" | "products" | "customers") => {
    try {
      let blob: Blob;
      let filename: string;

      switch (type) {
        case "orders":
          blob = await exportOrdersMutation.mutateAsync({});
          filename = "orders.csv";
          break;
        case "products":
          blob = await exportProductsMutation.mutateAsync({});
          filename = "products.csv";
          break;
        case "customers":
          blob = await exportCustomersMutation.mutateAsync({});
          filename = "customers.csv";
          break;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`${type} exported successfully`);
    } catch (error: any) {
      toast.error(error.message || `Failed to export ${type}`);
    }
  };

  const dashboardStats = [
    {
      title: "Total Sales",
      value: stats ? `$${stats.totalSales.toLocaleString("en-US")}` : "$0",
      change: "+12%",
      icon: DollarSign,
    },
    {
      title: "Products",
      value: stats ? stats.totalProducts.toLocaleString("en-US") : "0",
      change: "+5%",
      icon: Package,
    },
    {
      title: "Customers",
      value: stats ? stats.totalCustomers.toLocaleString("en-US") : "0",
      change: "+8%",
      icon: Users,
    },
    {
      title: "Orders",
      value: stats ? stats.totalOrders.toLocaleString("en-US") : "0",
      change: "+15%",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your store, products, and customers
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p className="text-sm text-green-600">
                          {stat.change} from last month
                        </p>
                      </div>
                      <stat.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                  </div>
                ) : stats?.recentOrders?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentOrders.slice(0, 5).map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">#{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {order.customerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total}</p>
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "PROCESSING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">
                    No recent orders
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleExport("products")}
                      disabled={exportProductsMutation.isPending}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    title="Select Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Products Table */}
                {productsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading products...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Product</th>
                          <th className="text-left py-3 px-4">Category</th>
                          <th className="text-left py-3 px-4">Price</th>
                          <th className="text-left py-3 px-4">Stock</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsData?.products?.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={
                                    product.images[0] ||
                                    "https://via.placeholder.com/40x40"
                                  }
                                  alt={product.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-gray-600">
                                    SKU: {product.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {product.category?.name || "Uncategorized"}
                            </td>
                            <td className="py-3 px-4">${product.price}</td>
                            <td className="py-3 px-4">{product.stock}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  product.stock > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {product.stock > 0
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  disabled={deleteProductMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Management</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleExport("orders")}
                      disabled={exportOrdersMutation.isPending}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Order ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Total</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersData?.orders?.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium">
                              #{order.id}
                            </td>
                            <td className="py-3 px-4">
                              {order.user?.firstName} {order.user?.lastName}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">${order.total}</td>
                            <td className="py-3 px-4">
                              <select
                                title="Update Order Status"
                                value={order.status}
                                onChange={(e) =>
                                  handleUpdateOrderStatus(
                                    order.id,
                                    e.target.value
                                  )
                                }
                                className={`px-2 py-1 rounded-full text-sm border ${
                                  order.status === "DELIVERED"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "SHIPPED"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "CONFIRMED"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Customer Management</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleExport("customers")}
                      disabled={exportCustomersMutation.isPending}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {customersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading customers...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Role</th>
                          <th className="text-left py-3 px-4">Joined</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customersData?.customers?.map((customer) => (
                          <tr
                            key={customer.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {customer.firstName} {customer.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {customer.role}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{customer.email}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  customer.role === "ADMIN"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {customer.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(
                                customer.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
