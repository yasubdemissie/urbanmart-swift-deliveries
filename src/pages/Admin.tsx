import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import Footer from "@/components/Custom/Footer";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/hooks/useAuth";
import {
  useAdminDashboard,
  useAdminUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/hooks/useAdmin";
import {
  DashboardTab,
  ProductsTab,
  OrdersTab,
  CustomersTab,
  ReportsTab,
  TransactionsTab,
  MerchantStoresTab,
} from "@/components/admin";

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useIsAuthenticated();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");

  // Fetch admin dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } =
    useAdminDashboard();

  // Fetch users data
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({
    page: userPage,
    limit: 10,
    search: userSearch || undefined,
  });

  // User management mutations
  const updateUserRoleMutation = useUpdateUserRole();
  const updateUserStatusMutation = useUpdateUserStatus();

  const handleUpdateUserRole = async (
    userId: string,
    role: "SUPER_ADMIN" | "ADMIN" | "MERCHANT" | "CUSTOMER"
  ) => {
    try {
      await updateUserRoleMutation.mutateAsync({ userId, role });
      toast.success("User role updated successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user role";
      toast.error(errorMessage);
    }
  };

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateUserStatusMutation.mutateAsync({ userId, isActive });
      toast.success(
        `User ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user status";
      toast.error(errorMessage);
    }
  };

  const handleExportUsers = async () => {
    // TODO: Implement user export functionality
    toast.info("User export functionality coming soon");
  };

  // Check if user is admin or super admin
  if (
    !isAuthenticated ||
    (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN")
  ) {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab stats={dashboardData} statsLoading={dashboardLoading} />
        );
      case "users":
        return (
          <CustomersTab
            customersData={usersData}
            customersLoading={usersLoading}
            handleExport={handleExportUsers}
            exportCustomersMutation={{ isPending: false }}
            onUpdateUserRole={handleUpdateUserRole}
            onUpdateUserStatus={handleUpdateUserStatus}
            searchQuery={userSearch}
            setSearchQuery={setUserSearch}
            currentPage={userPage}
            setCurrentPage={setUserPage}
          />
        );
      case "reports":
        return <ReportsTab />;
      case "transactions":
        return <TransactionsTab />;
      case "merchant-stores":
        return <MerchantStoresTab />;
      default:
        return (
          <DashboardTab stats={dashboardData} statsLoading={dashboardLoading} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-4 py-8">
        {/* Admin Page Header */}
        {/* <div className="mb-8 text-center">
          <p className="text-gray-600 text-lg">
            Manage users, reports, transactions, and merchant stores
          </p>
        </div> */}

        {/* Tab Content */}
        <div className="space-y-6">{renderTabContent()}</div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Admin;
