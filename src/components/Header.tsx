"use client";

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Package,
  User,
  ChevronDown,
  LogOut,
  Heart,
  Settings,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchComponent } from "./search-component";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useCart } from "@/context/cartContext";
import { useLogout } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profileImageNumber, setProfileImageNumber] = useState(
    Math.floor(Math.random() * 6)
  );
  const location = useLocation();

  const profileImage = [
    "https://static.vecteezy.com/system/resources/previews/001/503/756/non_2x/boy-face-avatar-cartoon-free-vector.jpg",
    "https://clipart-library.com/2024/face-cartoon/face-cartoon-9.webp",
    "https://img.freepik.com/premium-photo/3d-animation-character_113255-5631.jpg?w=360",
    "https://img.freepik.com/premium-psd/anjan-realistic-isolated-transparent-background_1279562-12566.jpg?semt=ais_incoming&w=740&q=80",
    "https://img.favpng.com/19/11/21/timothee-chalamet-smiling-animated-boy-character-in-glasses-23rqUB1e_t.jpg",
    "https://banner2.cleanpng.com/lnd/20240503/jko/ava0kkhv2.webp",
  ];

  const randomProfileImage = profileImage[profileImageNumber];

  // Get real authentication data
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useIsAuthenticated();

  // Get real cart data
  const { state: cartState } = useCart();
  const cartItemCount = cartState?.items?.length || 0;

  // Get user orders data for badge
  const { data: ordersData } = useOrders();
  const orderCount = ordersData?.orders?.length || 0;

  // Get logout function
  const logout = useLogout();

  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/contact", label: "Contact" },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between py-3">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 group transition-transform duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  UrbanMart
                </h1>
                <p className="text-gray-500 text-xs">Swift Deliveries</p>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-6">
            <SearchComponent />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Track Order with Badge */}
            {isAuthenticated && (
              <Link to="/track">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative transition-all duration-300 rounded-xl group p-2.5 ${
                    isActivePath("/track")
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Package className="group-hover:scale-105 transition-transform duration-300 h-5 w-5" />
                  <span className="hidden md:inline ml-1">Track Order</span>
                  {orderCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {orderCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Shopping Cart with Badge */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className={`relative transition-all duration-300 rounded-xl group p-2.5 ${
                  isActivePath("/cart")
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "hover:bg-green-50 hover:text-green-600"
                }`}
              >
                <ShoppingCart className="group-hover:scale-105 transition-transform duration-300 h-5 w-5" />
                <span className="hidden md:inline ml-1">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Authentication Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1.5 hover:bg-gray-100 transition-all duration-300 rounded-xl p-1.5"
                >
                  <Avatar className="h-9 w-9 border-2 border-gray-200">
                    <AvatarImage src={randomProfileImage} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm">
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      {user?.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className={`transition-transform duration-300 h-4 w-4 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                          <AvatarImage
                            src={user?.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                            {user?.firstName?.[0] || user?.email?.[0] || "U"}
                            {user?.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user?.firstName && user?.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user?.email || "User"}
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
                        className={`flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                          isActivePath("/profile")
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/track"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                          isActivePath("/track")
                            ? "bg-green-50 text-green-600 font-medium"
                            : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                        }`}
                      >
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                        {orderCount > 0 && (
                          <Badge className="ml-auto bg-blue-500 text-white text-xs">
                            {orderCount}
                          </Badge>
                        )}
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                          isActivePath("/cart")
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>My Cart</span>
                        {cartItemCount > 0 && (
                          <Badge className="ml-auto bg-red-500 text-white text-xs">
                            {cartItemCount}
                          </Badge>
                        )}
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                          isActivePath("/wishlist")
                            ? "bg-red-50 text-red-600 font-medium"
                            : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Wishlist</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                          isActivePath("/settings")
                            ? "bg-gray-50 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
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
                            className={`flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                              isActivePath("/admin")
                                ? "bg-purple-50 text-purple-600 font-medium"
                                : "text-purple-600 hover:bg-purple-50"
                            }`}
                          >
                            <Shield className="h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-300 w-full text-left"
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
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg px-4 py-1.5">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-gray-50 transition-all duration-300 rounded-xl p-2.5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 py-1.5 px-1 transition-colors duration-300 relative ${
                    isActivePath(item.path)
                      ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full"
                      : "text-gray-700 hover:text-blue-600 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-blue-600 hover:after:rounded-full"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3 text-sm text-gray-600">
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
        <div className="lg:hidden border-t border-gray-100 py-2.5">
          <SearchComponent />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between py-2.5 px-4 rounded-xl transition-all duration-300 ${
                    isActivePath(item.path)
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile Track Order */}
              {isAuthenticated && (
                <Link
                  to="/track"
                  className={`flex items-center justify-between py-2.5 px-4 rounded-xl transition-all duration-300 ${
                    isActivePath("/track")
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Track Order</span>
                  </span>
                  {orderCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      {orderCount}
                    </Badge>
                  )}
                </Link>
              )}

              {/* Mobile Cart */}
              <Link
                to="/cart"
                className={`flex items-center justify-between py-2.5 px-4 rounded-xl transition-all duration-300 ${
                  isActivePath("/cart")
                    ? "bg-green-50 text-green-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                </span>
                {cartItemCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>

              {/* Mobile User Section */}
              <div className="pt-3 mt-3 border-t border-gray-200">
                {isAuthenticated && user ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <Avatar className="h-9 w-9 border-2 border-white shadow-md">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {user?.firstName?.[0] || user?.email?.[0] || "U"}
                          {user?.lastName?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email || "User"}
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

                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                          isActivePath("/profile")
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                          isActivePath("/wishlist")
                            ? "bg-red-50 text-red-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Wishlist</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                          isActivePath("/settings")
                            ? "bg-gray-50 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>

                      {user?.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                            isActivePath("/admin")
                              ? "bg-purple-50 text-purple-600 font-medium"
                              : "text-purple-600 hover:bg-gray-50"
                          }`}
                        >
                          <Shield className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-300 w-full text-left rounded-xl"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
