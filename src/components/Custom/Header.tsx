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
  Truck,
  Home,
  Store,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchComponent } from "./search-component";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useCart } from "@/context/cartContext";
import { useLogout } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";

export const profileImages = [
  "https://static.vecteezy.com/system/resources/previews/001/503/756/non_2x/boy-face-avatar-cartoon-free-vector.jpg",
  "https://clipart-library.com/2024/face-cartoon/face-cartoon-9.webp",
  "https://img.freepik.com/premium-photo/3d-animation-character_113255-5631.jpg?w=360",
  "https://img.freepik.com/premium-psd/anjan-realistic-isolated-transparent-background_1279562-12566.jpg?semt=ais_incoming&w=740&q=80",
  "https://img.favpng.com/19/11/21/timothee-chalamet-smiling-animated-boy-character-in-glasses-23rqUB1e_t.jpg",
  "https://banner2.cleanpng.com/lnd/20240503/jko/ava0kkhv2.webp",
];

const IconColor = [
  "text-sky-600",
  "text-orange-400",
  "text-purple-600",
  "text-pink-600",
  "text-indigo-600",
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profileImageNumber] = useState(Math.floor(Math.random() * 6));
  const location = useLocation();
  const randomProfileImage = profileImages[profileImageNumber];

  const { user, isAuthenticated } = useIsAuthenticated();
  const { state: cartState } = useCart();
  const cartItemCount = cartState?.items?.length || 0;
  const { data: ordersData } = useOrders();
  const orderCount = ordersData?.orders?.length || 0;
  const logout = useLogout();

  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/shop", label: "Shop", icon: Store },
    { path: "/merchants", label: "Merchants", icon: User },
    { path: "/delivery", label: "Delivery", icon: Truck },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky -top-16 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">UrbanMart</h1>
              <p className="text-xs text-gray-500">Swift Deliveries</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <SearchComponent />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Track Order */}
            {isAuthenticated && (
              <Link to="/track">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative ${
                    isActivePath("/track")
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span className="hidden md:inline ml-2">Track</span>
                  {orderCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 text-white text-xs">
                      {orderCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className={`relative ${
                  isActivePath("/cart")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden md:inline ml-2">Cart</span>
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 text-white text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
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

        {/* Navigation - Desktop - Now Sticky */}
        <nav className="hidden lg:flex justify-between items-center bg-white border-t border-gray-100 shadow-sm">
          <div className="flex items-center space-x-1 py-2">
            {navigationItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center font-medium space-x-2 px-4 py-2 rounded-md text-sm transition-colors ${
                    isActivePath(item.path)
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : `text-black/60 hover:bg-blue-100 hover:text-blue-600`
                  }`}
                >
                  <Icon
                    strokeWidth={2.5}
                    stroke="currentColor"
                    strokeOpacity={0.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    className={`h-4 w-4 ${
                      isActivePath(item.path) ? "text-blue-600" : ""
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          {isAuthenticated && user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={randomProfileImage || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {user.firstName || "Y"}
                    {user.lastName || "D"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown
                  className={`h-4 w-4 text-gray-600 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={randomProfileImage || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user?.firstName || "Y"}
                          {user?.lastName || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                        {user?.role && user.role !== "CUSTOMER" && (
                          <Badge className="mt-1 text-xs" variant="secondary">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                        isActivePath("/profile")
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/track"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-2 text-sm ${
                        isActivePath("/track")
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </div>
                      {orderCount > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          {orderCount}
                        </Badge>
                      )}
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                        isActivePath("/wishlist")
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                        isActivePath("/settings")
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>

                    {/* Role-based Links */}
                    {user?.role === "ADMIN" && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                            isActivePath("/admin")
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Shield className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </>
                    )}

                    {user?.role === "MERCHANT" && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          to="/merchant-dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                            isActivePath("/merchant-dashboard")
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Shield className="h-4 w-4" />
                          <span>Merchant Dashboard</span>
                        </Link>
                      </>
                    )}

                    {user?.role === "DELIVERY" && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          to="/delivery"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                            isActivePath("/delivery")
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Truck className="h-4 w-4" />
                          <span>Delivery Dashboard</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Search */}
        <div className="lg:hidden border-t border-gray-100 py-3">
          <SearchComponent />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3">
            <div className="space-y-1">
              {isAuthenticated && user && (
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={randomProfileImage || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      {user?.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              )}

              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                      isActivePath(item.path)
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <>
                  <Link
                    to="/track"
                    className={`flex items-center justify-between px-4 py-3 rounded-md text-sm ${
                      isActivePath("/track")
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5" />
                      <span>Track Order</span>
                    </div>
                    {orderCount > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs">
                        {orderCount}
                      </Badge>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    className={`flex items-center justify-between px-4 py-3 rounded-md text-sm ${
                      isActivePath("/cart")
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Cart</span>
                    </div>
                    {cartItemCount > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </>
              )}

              {/* Mobile User Section */}
              {isAuthenticated && user && (
                <div className="pt-3 mt-3 border-t border-gray-100 space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                      isActivePath("/profile")
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                      isActivePath("/wishlist")
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                      isActivePath("/settings")
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Details</span>
                  </Link>

                  {user?.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                        isActivePath("/admin")
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  {user?.role === "MERCHANT" && (
                    <Link
                      to="/merchant-dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                        isActivePath("/merchant-dashboard")
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-620 hover:bg-gray-50"
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Merchant Dashboard</span>
                    </Link>
                  )}

                  {user?.role === "DELIVERY" && (
                    <Link
                      to="/delivery"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                        isActivePath("/delivery")
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Truck className="h-5 w-5" />
                      <span>Delivery Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-red-620 hover:bg-red-50 w-full text-left rounded-md"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
