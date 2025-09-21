import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useProducts";
import {
  useAdminStats,
  useAdminProducts,
  useAdminOrders,
  useAdminCustomers,
  useDeleteProduct,
  useUpdateOrderStatus,
  useExportOrders,
  useExportCustomers,
} from "@/hooks/useAdmin";
import {
  DashboardTab,
  ProductsTab,
  OrdersTab,
  CustomersTab,
} from "@/components/admin";
import { Order } from "@/lib/api";

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

  // Mutations
  const deleteProductMutation = useDeleteProduct();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const exportOrdersMutation = useExportOrders();
  const exportCustomersMutation = useExportCustomers();

  // Check if user is admin
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />
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

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, status });
      toast.success("Order status updated successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update order status";
      toast.error(errorMessage);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      toast.success("Product deleted successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      toast.error(errorMessage);
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
          // TODO: Implement products export
          toast.error("Products export not implemented yet");
          return;
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : `Failed to export ${type}`;
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-4 py-8">
        {/* Admin Page Header */}
        <div className="mb-8 text-center">
          {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1> */}
          <p className="text-gray-600 text-lg">
            Manage your store, products, orders, and customers
          </p>
        </div>

        {/* Tab Content - No longer using Tabs component, direct rendering based on activeTab */}
        <div className="space-y-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <DashboardTab stats={stats} statsLoading={statsLoading} />
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <ProductsTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              productsData={productsData}
              productsLoading={productsLoading}
              handleDeleteProduct={handleDeleteProduct}
              handleExport={handleExport}
              exportProductsMutation={{ isPending: false }} // TODO: Implement export products
              deleteProductMutation={deleteProductMutation}
            />
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <OrdersTab
              ordersData={ordersData}
              ordersLoading={ordersLoading}
              handleUpdateOrderStatus={handleUpdateOrderStatus}
              handleExport={handleExport}
              exportOrdersMutation={exportOrdersMutation}
            />
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <CustomersTab
              customersData={customersData}
              customersLoading={customersLoading}
              handleExport={handleExport}
              exportCustomersMutation={exportCustomersMutation}
            />
          )}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Admin;
