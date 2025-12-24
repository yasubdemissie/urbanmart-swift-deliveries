"use client";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Store,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  Search,
  Plus,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useAuth";
import { useCart } from "@/context/cartContext";
import apiClient from "@/lib/api";

const MerchantHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useIsAuthenticated();
  const logout = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [merchantLogo, setMerchantLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchMerchantLogo = async () => {
      const logo = await apiClient.getMerchantLogo();
      if (logo.success) {
        setMerchantLogo(logo.data.logo);
      }
    };
    fetchMerchantLogo();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const merchantTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      path: "/merchant-dashboard",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      path: "/merchant-dashboard/products",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/merchant-dashboard/orders",
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      path: "/merchant-dashboard/customers",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/merchant-dashboard/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/merchant-dashboard/settings",
    },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/merchant-dashboard/products?search=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  if (!isAuthenticated || user?.role !== "MERCHANT") {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/merchant-dashboard">
                 {merchantLogo ? <img src={merchantLogo} height={50} width={50} alt="" className="rounded-md" /> : <Store className="h-6 w-6" />}
              </Link>
              <div>
                <h1 className="text-lg font-semibold">Merchant Dashboard</h1>
                <p className="text-sm text-blue-100">
                  {user?.firstName} {user?.lastName}'s Store
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="ml-1 h-5 w-5 text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-blue-100">Merchant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {merchantTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex items-center space-x-2 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigate("/merchant/products/new")}
              size="sm"
              variant="outline"
              className="hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>

            <Button
              onClick={() => navigate("/shop")}
              size="sm"
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-3">
            <nav className="flex flex-col space-y-2">
              {merchantTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;

                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleTabClick(tab.path)}
                    className={`justify-start ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span>{tab.label}</span>
                  </Button>
                );
              })}

              {/* Mobile Action Buttons */}
              <div className="pt-2 border-t">
                <Button
                  onClick={() => navigate("/merchant/products/new")}
                  size="sm"
                  variant="outline"
                  className="w-full mb-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>

                <Button
                  onClick={() => navigate("/shop")}
                  size="sm"
                  variant="outline"
                  className="w-full mb-2"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Store
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default MerchantHeader;
