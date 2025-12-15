"use client";

import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useIsAuthenticated } from "@/hooks/useAuth";
import MerchantHeader from "@/components/Merchant/MerchantHeader";
import { OverviewTab } from "@/components/Merchant/OverviewTab";
import { ProductsTab } from "@/components/Merchant/ProductTab";
import { OrdersTab } from "@/components/Merchant/OrderTab";
import { CustomersTab } from "@/components/Merchant/CustomerTab";
import { AnalyticsTab } from "@/components/Merchant/AnalyticsTab";
import { SettingsTab } from "@/components/Merchant/SettingsTab";
import AddProductPage from "./AddProductPage";
import MerchantOrderDetailsPage from "./MerchantOrderDetailsPage";

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
        {/* Route-based Content */}
        <Routes>
          <Route path="/" element={<OverviewTab />} />
          <Route path="/products" element={<ProductsTab />} />
          <Route path="/products/new" element={<AddProductPage />} />
          <Route path="/orders" element={<OrdersTab />} />
          <Route
            path="/orders/:orderId"
            element={<MerchantOrderDetailsPage />}
          />
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
