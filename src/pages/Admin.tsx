import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
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
  // useCreateProduct,
  // useUpdateProduct,
  // useDeleteProduct,
  // useExportProducts,
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
  // const createProductMutation = useCreateProduct();
  // const updateProductMutation = useUpdateProduct();
  // const deleteProductMutation = useDeleteProduct();
  // const exportProductsMutation = useExportProducts();

  const updateOrderStatusMutation = useUpdateOrderStatus();
  const exportOrdersMutation = useExportOrders();
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
    } catch (error: any) {
      toast.error(error.message || `Failed to export ${type}`);
    }
  };

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
            <DashboardTab stats={stats} statsLoading={statsLoading} />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <ProductsTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              productsData={productsData}
              productsLoading={productsLoading}
              handleDeleteProduct={() => {}} // TODO: Implement delete product
              handleExport={handleExport}
              exportProductsMutation={{ isPending: false }} // TODO: Implement export products
              deleteProductMutation={{ isPending: false }} // TODO: Implement delete product
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <OrdersTab
              ordersData={ordersData}
              ordersLoading={ordersLoading}
              handleUpdateOrderStatus={handleUpdateOrderStatus}
              handleExport={handleExport}
              exportOrdersMutation={exportOrdersMutation}
            />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <CustomersTab
              customersData={customersData}
              customersLoading={customersLoading}
              handleExport={handleExport}
              exportCustomersMutation={exportCustomersMutation}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
