"use client";

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  PackageCheck,
  User,
  ChevronDown,
  LogOut,
  Heart,
  Settings,
  ShieldCheck,
  Truck,
  Compass,
  Store,
  Headphones,
  Sparkles,
  Zap,
  Building2,
  Bell,
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [profileImageNumber] = useState(Math.floor(Math.random() * 6));
  const location = useLocation();
  const randomProfileImage = profileImages[profileImageNumber];

  const { user, isAuthenticated } = useIsAuthenticated();
  const { state: cartState } = useCart();
  const cartItems = cartState?.items || [];
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const { data: ordersData } = useOrders();
  const orderCount = ordersData?.orders?.length || 0;
  const logout = useLogout();

  const navigationItems = [
    { path: "/", label: "Home", icon: Compass },
    { path: "/shop", label: "Shop Catalog", icon: Store },
    { path: "/merchants", label: "Merchants", icon: Building2 },
    { path: "/delivery-dashboard", label: "Delivery Hub", icon: Truck },
    { path: "/contact", label: "Support", icon: Headphones },
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
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-all duration-300">
      {/* Top Banner Ticker */}
      {showPromo && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-[11px] font-semibold py-1.5 px-4 flex items-center justify-between">
          <div className="container mx-auto max-w-7xl flex items-center justify-center gap-2 text-center truncate">
            <Zap className="h-3.5 w-3.5 animate-pulse text-amber-300 shrink-0" />
            <span className="truncate">
              Express Delivery Available • Get <strong className="underline decoration-amber-300 font-bold">Free Delivery</strong> on orders over $50!
            </span>
          </div>
          <button
            onClick={() => setShowPromo(false)}
            className="text-white/80 hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-colors shrink-0"
            title="Close announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3 lg:gap-6 min-w-0">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <span className="font-extrabold text-xl tracking-tight">U</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Urban<span className="text-blue-600 dark:text-blue-400">Mart</span>
                </span>
                <span className="hidden sm:inline-block bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                  SWIFT
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase hidden sm:block">
                Express Delivery
              </span>
            </div>
          </Link>

          {/* Prominent Expanded Search Bar */}
          <div className="flex-1 max-w-2xl mx-2 hidden md:block min-w-0">
            <SearchComponent />
          </div>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Track Orders Button */}
            {isAuthenticated && (
              <Link to="/track" className="shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative rounded-xl h-10 px-3 transition-all ${
                    isActivePath("/track")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <PackageCheck className="h-4 w-4 text-slate-600 dark:text-slate-300" strokeWidth={1.8} />
                  <span className="hidden lg:inline ml-2 text-xs font-semibold">
                    Orders
                  </span>
                  {orderCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center bg-blue-600 text-white text-[10px] font-extrabold rounded-full border-2 border-white dark:border-slate-950">
                      {orderCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart Button */}
            <Link to="/cart" className="shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={`relative rounded-xl h-10 px-3.5 transition-all ${
                  isActivePath("/cart")
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 h-4 min-w-4 px-1 flex items-center justify-center bg-emerald-500 text-white text-[10px] font-extrabold rounded-full border-2 border-white dark:border-slate-950 animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block ml-2 text-xs font-bold">
                  Cart
                </span>
                {cartSubtotal > 0 && (
                  <span className="hidden lg:inline-block ml-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Account / Profile Dropdown Button */}
            {isAuthenticated && user ? (
              <div className="relative shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors max-w-[180px] sm:max-w-[200px]"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-blue-500/30 shrink-0">
                    <AvatarImage
                      src={user?.avatar || randomProfileImage || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs">
                      {user.firstName?.[0] || user.email?.[0] || "U"}
                      {user.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] sm:max-w-[110px] text-left">
                    {user.firstName ? `${user.firstName}` : user.email?.split("@")[0]}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* User Glassmorphism Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in-50 zoom-in-95">
                    {/* Profile Summary Header */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-1 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-500 shrink-0">
                          <AvatarImage
                            src={user?.avatar || randomProfileImage || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-blue-600 text-white font-bold">
                            {user?.firstName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {user?.firstName && user?.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user?.email}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user?.email}
                          </p>
                          {user?.role && (
                            <Badge
                              className="mt-1 text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                              variant="secondary"
                            >
                              {user.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-0.5 text-xs font-semibold">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                          isActivePath("/profile")
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <User className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/track"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                          isActivePath("/track")
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <PackageCheck className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
                          <span>Track Orders</span>
                        </div>
                        {orderCount > 0 && (
                          <Badge className="bg-blue-600 text-white text-[10px]">
                            {orderCount}
                          </Badge>
                        )}
                      </Link>

                      <Link
                        to="/profile?tab=wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
                        <span>Saved Items</span>
                      </Link>

                      {/* Role-based Dashboards */}
                      {user?.role === "ADMIN" && (
                        <>
                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4 text-purple-600" strokeWidth={1.8} />
                            <span>Admin Portal</span>
                          </Link>
                        </>
                      )}

                      {user?.role === "MERCHANT" && (
                        <>
                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                          <Link
                            to="/merchant-dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                          >
                            <Store className="h-4 w-4 text-amber-600" strokeWidth={1.8} />
                            <span>Merchant Dashboard</span>
                          </Link>
                        </>
                      )}

                      {user?.role === "DELIVERY" && (
                        <>
                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                          <Link
                            to="/delivery-dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                          >
                            <Truck className="h-4 w-4 text-emerald-600" strokeWidth={1.8} />
                            <span>Delivery Hub</span>
                          </Link>
                        </>
                      )}

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 w-full text-left transition-colors font-bold"
                      >
                        <LogOut className="h-4 w-4" strokeWidth={1.8} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="shrink-0">
                <Button className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 text-xs">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-10 w-10 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Row 2: Secondary Desktop Horizontal Nav Bar */}
        <div className="hidden lg:flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800/60">
          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
                    }`}
                    strokeWidth={1.8}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> 100% Verified Stores
            </span>
          </div>
        </div>

        {/* Mobile Search Bar (under header) */}
        <div className="md:hidden py-2.5 border-t border-slate-100 dark:border-slate-800">
          <SearchComponent />
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2 animate-in slide-in-from-top-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      active
                        ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-slate-400" strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
