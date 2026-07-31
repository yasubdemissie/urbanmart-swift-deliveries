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
  ShieldCheck,
  Truck,
  Compass,
  Store,
  Headphones,
  Sparkles,
  Zap,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchComponent } from "./search-component";
import { useIsAuthenticated, useLogout } from "@/hooks/useAuth";
import { useCart } from "@/context/cartContext";
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
    0,
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

  const isActivePath = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Banner Ticker */}
      {showPromo && (
        <div className="relative flex items-center justify-center gap-3 overflow-hidden bg-[linear-gradient(90deg,theme(colors.slate.900),theme(colors.indigo.900),theme(colors.slate.900))] px-4 py-2 text-[13px] text-slate-100">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(600px_60px_at_50%_0%,theme(colors.indigo.400/.35),transparent)]" />
          <div className="relative flex items-center gap-2 truncate">
            <Zap className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <span className="truncate font-medium tracking-tight">
              Express Delivery Available • Get Free Delivery on orders over $50!
            </span>
          </div>
          <button
            onClick={() => setShowPromo(false)}
            className="absolute right-3 shrink-0 rounded-md p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Close announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/70 dark:bg-slate-950/70 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg font-black text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
              U
              <span className="absolute -inset-1 -z-10 rounded-2xl bg-indigo-500/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="hidden leading-none sm:block">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  UrbanMart
                </span>
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  SWIFT
                </span>
              </div>
              <span className="mt-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Express Delivery
              </span>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden flex-1 justify-center px-2 md:flex">
            <div className="w-full max-w-2xl">
              <SearchComponent />
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {isAuthenticated && (
              <Link
                to="/track"
                className="group relative hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:flex dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <PackageCheck className="h-[18px] w-[18px]" />
                <span>Orders</span>
                {orderCount > 0 && (
                  <Badge className="ml-0.5 h-5 min-w-5 justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">
                    {orderCount}
                  </Badge>
                )}
              </Link>
            )}

            <Link
              to="/cart"
              className="group flex h-10 items-center gap-2.5 rounded-xl px-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="relative">
                <ShoppingCart className="h-[19px] w-[19px] text-slate-700 transition-transform duration-200 group-hover:-translate-y-0.5 dark:text-slate-200" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden leading-tight sm:block">
                <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                  Cart
                </span>
                {cartSubtotal > 0 && (
                  <span className="block text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                )}
              </div>
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex h-10 max-w-[180px] items-center gap-2 rounded-xl px-1.5 pr-2 transition-colors hover:bg-slate-100 sm:max-w-[200px] dark:hover:bg-slate-800"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-indigo-500/20">
                    <AvatarImage src={randomProfileImage} alt="" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
                      {user.firstName?.[0] || user.email?.[0] || "U"}
                      {user.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden truncate text-sm font-medium text-slate-800 sm:block dark:text-slate-100">
                    {user.firstName
                      ? `${user.firstName}`
                      : user.email?.split("@")[0]}
                  </span>
                  <ChevronDown
                    className={`hidden h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 sm:block ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
                      {/* Profile summary */}
                      <div className="border-b border-slate-200/70 bg-gradient-to-br from-indigo-50 to-violet-50 p-4 dark:border-slate-800 dark:from-indigo-950/40 dark:to-violet-950/30">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 ring-2 ring-white dark:ring-slate-900">
                            <AvatarImage src={randomProfileImage} alt="" />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white">
                              {user?.firstName?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.email}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {user?.email}
                            </p>
                            {user?.role && (
                              <span className="mt-1.5 inline-block rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
                                {user.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="flex flex-col gap-0.5 p-2 text-sm font-medium">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                            isActivePath("/profile")
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                              : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>

                        <Link
                          to="/track"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                            isActivePath("/track")
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                              : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <PackageCheck className="h-4 w-4" />
                            Track Orders
                          </span>
                          {orderCount > 0 && (
                            <Badge className="h-5 min-w-5 justify-center rounded-full bg-slate-900 px-1.5 text-[11px] text-white dark:bg-white dark:text-slate-900">
                              {orderCount}
                            </Badge>
                          )}
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Heart className="h-4 w-4" />
                          Saved Items
                        </Link>

                        {user?.role === "ADMIN" && (
                          <>
                            <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
                            <Link
                              to="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl bg-violet-50 px-3 py-2 text-violet-700 transition-colors hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              Admin Portal
                            </Link>
                          </>
                        )}

                        {user?.role === "MERCHANT" && (
                          <>
                            <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
                            <Link
                              to="/merchant-dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl bg-amber-50 px-3 py-2 text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300"
                            >
                              <Store className="h-4 w-4" />
                              Merchant Dashboard
                            </Link>
                          </>
                        )}

                        {user?.role === "DELIVERY" && (
                          <>
                            <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
                            <Link
                              to="/delivery-dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                            >
                              <Truck className="h-4 w-4" />
                              Delivery Hub
                            </Link>
                          </>
                        )}

                        <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button
                asChild
                className="h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
              >
                <Link to="/signin">Sign In</Link>
              </Button>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: desktop nav */}
        <div className="hidden border-t border-slate-200/70 lg:block dark:border-slate-800/70">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      active
                        ? "text-indigo-600 dark:text-indigo-300"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-2 -bottom-[7px] h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              100% Verified Stores
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="border-t border-slate-200/70 px-4 py-2.5 md:hidden dark:border-slate-800/70">
          <SearchComponent />
        </div>

        {/* Mobile drawer */}
        {isMenuOpen && (
          <div className="border-t border-slate-200/70 bg-white/95 backdrop-blur-xl lg:hidden dark:border-slate-800/70 dark:bg-slate-950/95">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
