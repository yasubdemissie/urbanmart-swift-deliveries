"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Home,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Heart,
  Package,
  Settings,
  Shield,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCartCount } from "@/hooks/useCart";
import { useIsAuthenticated, useLogout } from "@/hooks/useAuth";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Remove scroll state: always expanded
  // const [isScrolled, setIsScrolled] = useState(false);
  // const [isCompact, setIsCompact] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: cartCount = 0 } = useCartCount();
  const { isAuthenticated, user } = useIsAuthenticated();
  const logout = useLogout();

  // Pages that should trigger header compression
  const compressionPages = [
    "/admin",
    "/shop",
    "/cart",
    "/categories",
    "/deals",
    "/track",
    "/contact",
    "/profile",
    "/orders",
    "/wishlist",
  ];

  // Always expanded
  const isCompact = false;
  const isScrolled = false;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to get active classes
  const getActiveClasses = (path: string) => {
    return isActive(path)
      ? "text-blue-600 font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full"
      : "text-gray-700 hover:text-blue-600 transition-colors duration-300 relative hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-blue-600 hover:after:rounded-full";
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/shop", label: "Shop" },
    // { path: "/categories", label: "Categories" },
    // { path: "/deals", label: "Deals", badge: "Hot" },
    { path: "/track", label: "Track Order" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? "shadow-lg border-b border-gray-100" : "shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div
          className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
            isCompact ? "py-1.5" : "py-3"
          }`}
        >
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 group transition-transform duration-500 ease-in-out hover:scale-105"
            >
              <div className="relative">
                <img
                  src="/image.png"
                  alt="Grace Logo"
                  className={`rounded-xl shadow-md group-hover:shadow-lg transition-transform duration-500 ease-in-out ${
                    isCompact ? "w-7 h-7" : "w-9 h-9"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
              </div>
              <div
                className={`transition-transform duration-500 ease-in-out ${
                  isCompact ? "scale-90" : "scale-100"
                }`}
              >
                <h1
                  className={`font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent transition-all duration-500 ease-in-out ${
                    isCompact ? "text-lg" : "text-xl"
                  }`}
                >
                  Grace
                </h1>
                <p
                  className={`text-gray-500 transition-all duration-500 ease-in-out ${
                    isCompact ? "text-xs opacity-0 h-0" : "text-xs opacity-100"
                  }`}
                >
                  Premium Store
                </p>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div
            className={`hidden lg:flex flex-1 max-w-xl mx-6 transition-all duration-500 ease-in-out ${
              isCompact
                ? "max-w-md mx-4 scale-y-90"
                : "max-w-xl mx-6 scale-y-100"
            }`}
          >
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-500 ease-in-out ${
                    isCompact ? "h-4 w-4" : "h-5 w-5"
                  }`}
                />
                <Input
                  placeholder={
                    isCompact ? "Search..." : "Search for products, brands..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-500 ease-in-out bg-gray-50 focus:bg-white ${
                    isCompact ? "pl-9 pr-4 py-1.5 text-sm" : "pl-10 pr-4 py-2.5"
                  }`}
                />
                <Button
                  type="submit"
                  size="sm"
                  className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-500 ease-in-out ${
                    isCompact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5"
                  }`}
                >
                  {isCompact ? "Go" : "Search"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div
            className={`flex items-center transition-all duration-500 ease-in-out ${
              isCompact ? "space-x-1" : "space-x-2"
            }`}
          >
            {/* Wishlist - Desktop Only */}
            <div className="hidden md:block">
              <Link to="/wishlist">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative hover:bg-red-50 hover:text-red-600 transition-all duration-500 ease-in-out rounded-xl group ${
                    isCompact ? "p-1.5" : "p-2.5"
                  }`}
                >
                  <Heart
                    className={`group-hover:scale-105 transition-transform duration-500 ease-in-out ${
                      isCompact ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  />
                  <Badge
                    className={`absolute bg-red-500 text-white text-xs rounded-full p-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                      isCompact
                        ? "-top-0.5 -right-0.5 h-4 w-4"
                        : "-top-1 -right-1 h-5 w-5"
                    }`}
                  >
                    3
                  </Badge>
                </Button>
              </Link>
            </div>

            {/* Notifications - Authenticated Users Only */}
            {isAuthenticated && (
              <div className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative hover:bg-blue-50 hover:text-blue-600 transition-all duration-500 ease-in-out rounded-xl group ${
                    isCompact ? "p-1.5" : "p-2.5"
                  }`}
                >
                  <Bell
                    className={`group-hover:scale-105 transition-transform duration-500 ease-in-out ${
                      isCompact ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  />
                  <Badge
                    className={`absolute bg-blue-500 text-white text-xs rounded-full p-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                      isCompact
                        ? "-top-0.5 -right-0.5 h-4 w-4"
                        : "-top-1 -right-1 h-5 w-5"
                    }`}
                  >
                    2
                  </Badge>
                </Button>
              </div>
            )}

            {/* Shopping Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className={`relative hover:bg-green-50 hover:text-green-600 transition-all duration-500 ease-in-out rounded-xl group ${
                  isCompact ? "p-1.5" : "p-2.5"
                }`}
              >
                <ShoppingCart
                  className={`group-hover:scale-105 transition-transform duration-500 ease-in-out ${
                    isCompact ? "h-4 w-4" : "h-5 w-5"
                  }`}
                />
                {cartCount > 0 && (
                  <Badge
                    className={`absolute bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full p-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                      isCompact
                        ? "-top-0.5 -right-0.5 h-4 w-4"
                        : "-top-1 -right-1 h-5 w-5"
                    }`}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-1.5 hover:bg-gray-50 transition-all duration-500 ease-in-out rounded-xl ${
                    isCompact ? "p-1" : "p-1.5"
                  }`}
                >
                  <Avatar
                    className={`border-2 border-gray-200 transition-all duration-500 ease-in-out ${
                      isCompact ? "h-6 w-6" : "h-7 w-7"
                    }`}
                  >
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback
                      className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition-all duration-500 ease-in-out ${
                        isCompact ? "text-xs" : "text-sm"
                      }`}
                    >
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className={`transition-transform duration-500 ease-in-out ${
                      isUserMenuOpen ? "rotate-180" : ""
                    } ${isCompact ? "h-3 w-3" : "h-4 w-4"}`}
                  />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                          <AvatarImage
                            src={user?.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                            {user?.firstName?.[0]}
                            {user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                          {user?.role === "ADMIN" && (
                            <Badge className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 ease-in-out"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-300 ease-in-out"
                      >
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Wishlist</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 ease-in-out"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>

                      {user?.role === "ADMIN" && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-purple-600 hover:bg-purple-50 transition-all duration-300 ease-in-out font-medium"
                          >
                            <Shield className="h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-300 ease-in-out w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin">
                <Button
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-500 ease-in-out hover:scale-105 shadow-md hover:shadow-lg ${
                    isCompact ? "px-3 py-1 text-sm" : "px-4 py-1.5"
                  }`}
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden hover:bg-gray-50 transition-all duration-500 ease-in-out rounded-xl ${
                isCompact ? "p-1.5" : "p-2.5"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
              ) : (
                <Menu className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav
          className={`hidden lg:block border-t border-gray-100 transition-all duration-500 ease-in-out overflow-hidden ${
            isCompact
              ? "h-0 scale-y-0 origin-top"
              : "h-12 scale-y-100 origin-top"
          }`}
        >
          <div
            className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
              isCompact ? "py-0" : "py-3"
            }`}
          >
            <div className="flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 py-1.5 px-1 ${getActiveClasses(
                    item.path
                  )}`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 py-1.5 px-1 ${getActiveClasses(
                    "/admin"
                  )}`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>

            {/* Quick Actions */}
            <div
              className={`flex items-center space-x-3 text-sm text-gray-600 transition-all duration-500 ease-in-out ${
                isCompact ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            >
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free Shipping on $50+</span>
              </span>
              <span>|</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </nav>

        {/* Mobile Search */}
        <div
          className={`lg:hidden border-t border-gray-100 transition-all duration-500 ease-in-out ${
            isCompact ? "py-1.5 scale-y-90" : "py-2.5 scale-y-100"
          }`}
        >
          <form onSubmit={handleSearch} className="relative">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-500 ease-in-out ${
                isCompact ? "left-3 h-4 w-4" : "left-3 h-5 w-5"
              }`}
            />
            <Input
              placeholder={isCompact ? "Search..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-500 ease-in-out ${
                isCompact ? "pl-9 pr-4 py-1.5 text-sm" : "pl-10 pr-4 py-2.5"
              }`}
            />
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 animate-in slide-in-from-top duration-300 ease-in-out">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between py-2.5 px-4 rounded-xl transition-all duration-300 ease-in-out ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}

              {/* Mobile User Section */}
              <div className="pt-3 mt-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <Avatar className="h-9 w-9 border-2 border-white shadow-md">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 ease-in-out"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 ease-in-out"
                    >
                      <Package className="h-5 w-5" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 ease-in-out"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                    </Link>

                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 px-4 py-2.5 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 ease-in-out font-medium"
                      >
                        <Shield className="h-5 w-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 ease-in-out w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/signin">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-xl font-medium transition-all duration-300 ease-in-out">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
