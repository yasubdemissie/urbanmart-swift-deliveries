"use client";

import { useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/hooks/useAuth";
import MerchantHeader from "@/components/Merchant/MerchantHeader";
import Footer from "@/components/Custom/Footer";
import { OverviewTab } from "@/components/Merchant/OverviewTab";
import { ProductsTab } from "@/components/Merchant/ProductTab";
import { OrdersTab } from "@/components/Merchant/OrderTab";
import { CustomersTab } from "@/components/Merchant/CustomerTab";
import { AnalyticsTab } from "@/components/Merchant/AnalyticsTab";
import { SettingsTab } from "@/components/Merchant/SettingsTab";

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useIsAuthenticated();

  useEffect(() => {
    // Wait for authentication to finish loading
    if (isLoading) {
      return;
    }

    // Check authentication and role
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    if (user?.role !== "MERCHANT") {
      navigate("/signin");
      return;
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || user?.role !== "MERCHANT") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Merchant Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your products, orders, and customers
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => navigate("/merchant/store")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Store Settings
            </Button>
            <Button onClick={() => navigate("/merchant/products/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Route-based Content */}
        <Routes>
          <Route path="/" element={<OverviewTab />} />
          <Route path="/products" element={<ProductsTab />} />
          <Route path="/orders" element={<OrdersTab />} />
          <Route path="/customers" element={<CustomersTab />} />
          <Route path="/analytics" element={<AnalyticsTab />} />
          <Route path="/settings" element={<SettingsTab />} />
        </Routes>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default MerchantDashboard;
