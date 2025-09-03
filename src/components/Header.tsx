// Chat GPT Version 2
"use client";

import type React from "react";

import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, User, Search, X, Menu } from "lucide-react";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

const navigationItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/shop", label: "Shop" },
  { path: "/categories", label: "Categories" },
  { path: "/deals", label: "Deals", badge: "Hot" },
  { path: "/track", label: "Track Order" },
  { path: "/contact", label: "Contact" },
];

const popularSearches = [
  "Wireless headphones",
  "Gaming laptop",
  "Smartphone cases",
  "Running shoes",
  "Coffee maker",
];

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      setRecentSearches((prev) => {
        const updated = [query, ...prev.filter((item) => item !== query)].slice(
          0,
          5
        );
        return updated;
      });

      // Here you would typically navigate to search results or trigger search
      console.log("Searching for:", query);

      // Close search and clear input
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">MyStore</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map(({ path, label, icon: Icon, badge }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                "relative flex items-center gap-1 text-gray-700 hover:text-blue-600 transition",
                pathname === path && "text-blue-600 font-semibold"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{label}</span>
              {badge && (
                <span className="absolute -top-2 -right-3 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {!isSearchOpen ? (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Open search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <div className="absolute right-0 top-0 w-80 bg-white border rounded-lg shadow-lg">
                {/* ... existing search code ... */}
                <form onSubmit={handleSubmit} className="p-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="flex-1 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Close search"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </form>

                {/* Search suggestions */}
                <div className="border-t px-4 py-3">
                  {recentSearches.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Recent Searches
                      </h4>
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1 rounded"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Popular Searches
                    </h4>
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              3
            </span>
          </Link>
          {/* User */}
          <Link
            to="/account"
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <User className="w-5 h-5 text-gray-600" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="px-4 py-3 space-y-2">
            {navigationItems.map(({ path, label, icon: Icon, badge }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition",
                  pathname === path && "bg-blue-50 text-blue-600 font-semibold"
                )}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span>{label}</span>
                {badge && (
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import {
//   Search,
//   ShoppingCart,
//   User,
//   Home,
//   LogOut,
//   Menu,
//   X,
//   ChevronDown,
//   Bell,
//   Heart,
//   Package,
//   Settings,
//   Shield,
// } from "lucide-react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useCartCount } from "@/hooks/useCart";
// import { useIsAuthenticated, useLogout } from "@/hooks/useAuth";
// import { toast } from "sonner";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   // Remove scroll state: always expanded
//   // const [isScrolled, setIsScrolled] = useState(false);
//   // const [isCompact, setIsCompact] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { data: cartCount = 0 } = useCartCount();
//   const { isAuthenticated, user } = useIsAuthenticated();
//   const logout = useLogout();

//   // Pages that should trigger header compression
//   const compressionPages = [
//     "/admin",
//     "/shop",
//     "/cart",
//     "/categories",
//     "/deals",
//     "/track",
//     "/contact",
//     "/profile",
//     "/orders",
//     "/wishlist",
//   ];

//   // Always expanded
//   const isCompact = false;
//   const isScrolled = false;

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location.pathname]);

//   // Helper function to check if a link is active
//   const isActive = (path: string) => {
//     if (path === "/") {
//       return location.pathname === "/";
//     }
//     return location.pathname.startsWith(path);
//   };

//   // Helper function to get active classes
//   const getActiveClasses = (path: string) => {
//     return isActive(path)
//       ? "text-blue-600 font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full"
//       : "text-gray-700 hover:text-blue-600 transition-colors duration-300 relative hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-blue-600 hover:after:rounded-full";
//   };

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     navigate("/");
//     setIsUserMenuOpen(false);
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   const navigationItems = [
//     { path: "/", label: "Home", icon: Home },
//     { path: "/shop", label: "Shop" },
//     { path: "/categories", label: "Categories" },
//     { path: "/deals", label: "Deals", badge: "Hot" },
//     { path: "/track", label: "Track Order" },
//     { path: "/contact", label: "Contact" },
//   ];

//   return (
//     <header
//       className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-500 ease-in-out ${
//         isScrolled ? "shadow-lg border-b border-gray-100" : "shadow-sm"
//       }`}
//     >
//       <div className="container mx-auto px-4">
//         {/* Main Header */}
//         <div
//           className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
//             isCompact ? "py-1.5" : "py-3"
//           }`}
//         >
//           {/* Logo Section */}
//           <div className="flex items-center">
//             <Link
//               to="/"
//               className="flex items-center space-x-2 group transition-transform duration-500 ease-in-out hover:scale-105"
//             >
//               <div className="relative">
//                 <img
//                   src="/image.png"
//                   alt="Grace Logo"
//                   className={`rounded-xl shadow-md group-hover:shadow-lg transition-transform duration-500 ease-in-out ${
//                     isCompact ? "w-7 h-7" : "w-9 h-9"
//                   }`}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
//               </div>
//               <div
//                 className={`transition-transform duration-500 ease-in-out ${
//                   isCompact ? "scale-90" : "scale-100"
//                 }`}
//               >
//                 <h1
//                   className={`font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent transition-all duration-500 ease-in-out ${
//                     isCompact ? "text-lg" : "text-xl"
//                   }`}
//                 >
//                   Grace
//                 </h1>
//                 <p
//                   className={`text-gray-500 transition-all duration-500 ease-in-out ${
//                     isCompact ? "text-xs opacity-0 h-0" : "text-xs opacity-100"
//                   }`}
//                 >
//                   Premium Store
//                 </p>
//               </div>
//             </Link>
//           </div>

//           {/* Search Bar - Desktop */}
//           <div
//             className={`hidden lg:flex flex-1 max-w-xl mx-6 transition-all duration-500 ease-in-out ${
//               isCompact
//                 ? "max-w-md mx-4 scale-y-90"
//                 : "max-w-xl mx-6 scale-y-100"
//             }`}
//           >
//             <form onSubmit={handleSearch} className="relative w-full group">
//               <div className="relative">
//                 <Search
//                   className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-500 ease-in-out ${
//                     isCompact ? "h-4 w-4" : "h-5 w-5"
//                   }`}
//                 />
//                 <Input
//                   placeholder={
//                     isCompact ? "Search..." : "Search for products, brands..."
//                   }
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className={`w-full border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-500 ease-in-out bg-gray-50 focus:bg-white ${
//                     isCompact ? "pl-9 pr-4 py-1.5 text-sm" : "pl-10 pr-4 py-2.5"
//                   }`}
//                 />
//                 <Button
//                   type="submit"
//                   size="sm"
//                   className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-500 ease-in-out ${
//                     isCompact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5"
//                   }`}
//                 >
//                   {isCompact ? "Go" : "Search"}
//                 </Button>
//               </div>
//             </form>
//           </div>

//           {/* Right Section */}
//           <div
//             className={`flex items-center transition-all duration-500 ease-in-out ${
//               isCompact ? "space-x-1" : "space-x-2"
//             }`}
//           >
//             {/* Wishlist - Desktop Only */}
//             {/* <div className="hidden md:block">
//               <Link to="/wishlist">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className={`relative hover:bg-red-50 hover:text-red-600 transition-all duration-500 ease-in-out rounded-xl group ${
//                     isCompact ? "p-1.5" : "p-2.5"
//                   }`}
//                 >
//                   <Heart
//                     className={`group-hover:scale-105 transition-transform duration-500 ease-in-out ${
//                       isCompact ? "h-4 w-4" : "h-5 w-5"
//                     }`}
//                   />
//                   <Badge
//                     className={`absolute bg-red-500 text-white text-xs rounded-full p-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
//                       isCompact
//                         ? "-top-0.5 -right-0.5 h-4 w-4"
//                         : "-top-1 -right-1 h-5 w-5"
//                     }`}
//                   >
//                     3
//                   </Badge>
//                 </Button>
//               </Link>
//             </div> */}

//             {/* Notifications - Authenticated Users Only */}

//             {/* Shopping Cart */}
//             <Link to="/cart">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className={`relative hover:bg-green-50 hover:text-green-600 transition-all duration-500 ease-in-out rounded-xl group ${
//                   isCompact ? "p-1.5" : "p-2.5"
//                 }`}
//               >
//                 <ShoppingCart
//                   className={`group-hover:scale-105 transition-transform duration-500 ease-in-out ${
//                     isCompact ? "h-4 w-4" : "h-5 w-5"
//                   }`}
//                 />
//                 {cartCount > 0 && (
//                   <Badge
//                     className={`absolute bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full p-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
//                       isCompact
//                         ? "-top-0.5 -right-0.5 h-4 w-4"
//                         : "-top-1 -right-1 h-5 w-5"
//                     }`}
//                   >
//                     {cartCount}
//                   </Badge>
//                 )}
//               </Button>
//             </Link>

//             {/* User Account */}
//             {isAuthenticated ? (
//               <div className="relative">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                   className={`flex items-center space-x-1.5 hover:bg-gray-50 transition-all duration-500 ease-in-out rounded-xl ${
//                     isCompact ? "p-1" : "p-1.5"
//                   }`}
//                 >
//                   <Avatar
//                     className={`border-2 border-gray-200 transition-all duration-500 ease-in-out ${
//                       isCompact ? "h-6 w-6" : "h-7 w-7"
//                     }`}
//                   >
//                     <AvatarImage src={user?.avatar || "/placeholder.svg"} />
//                     <AvatarFallback
//                       className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition-all duration-500 ease-in-out ${
//                         isCompact ? "text-xs" : "text-sm"
//                       }`}
//                     >
//                       {user?.firstName?.[0]}
//                       {user?.lastName?.[0]}
//                     </AvatarFallback>
//                   </Avatar>
//                   <ChevronDown
//                     className={`transition-transform duration-500 ease-in-out ${
//                       isUserMenuOpen ? "rotate-180" : ""
//                     } ${isCompact ? "h-3 w-3" : "h-4 w-4"}`}
//                   />
//                 </Button>

//                 {/* User Dropdown Menu */}
//                 {isUserMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out">
//                     {/* User Info Header */}
//                     <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                       <div className="flex items-center space-x-3">
//                         <Avatar className="h-10 w-10 border-2 border-white shadow-md">
//                           <AvatarImage
//                             src={user?.avatar || "/placeholder.svg"}
//                           />
//                           <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
//                             {user?.firstName?.[0]}
//                             {user?.lastName?.[0]}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-semibold text-gray-900">
//                             {user?.firstName} {user?.lastName}
//                           </p>
//                           <p className="text-sm text-gray-600">{user?.email}</p>
//                           {user?.role === "ADMIN" && (
//                             <Badge className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
//                               <Shield className="h-3 w-3 mr-1" />
//                               Admin
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Menu Items */}
//                     <div className="py-2">
//                       <Link
//                         to="/profile"
//                         onClick={() => setIsUserMenuOpen(false)}
//                         className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 ease-in-out"
//                       >
//                         <User className="h-4 w-4" />
//                         <span>My Profile</span>
//                       </Link>
//                       <Link
//                         to="/orders"
//                         onClick={() => setIsUserMenuOpen(false)}
//                         className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-300 ease-in-out"
//                       >
//                         <Package className="h-4 w-4" />
//                         <span>My Orders</span>
//                       </Link>
//                       <Link
//                         to="/wishlist"
//                         onClick={() => setIsUserMenuOpen(false)}
//                         className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out"
//                       >
//                         <Heart className="h-4 w-4" />
//                         <span>Wishlist</span>
//                       </Link>
//                       <Link
//                         to="/settings"
//                         onClick={() => setIsUserMenuOpen(false)}
//                         className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 ease-in-out"
//                       >
//                         <Settings className="h-4 w-4" />
//                         <span>Settings</span>
//                       </Link>

//                       {user?.role === "ADMIN" && (
//                         <>
//                           <div className="border-t border-gray-100 my-1"></div>
//                           <Link
//                             to="/admin"
//                             onClick={() => setIsUserMenuOpen(false)}
//                             className="flex items-center space-x-3 px-4 py-2.5 text-purple-600 hover:bg-purple-50 transition-all duration-300 ease-in-out font-medium"
//                           >
//                             <Shield className="h-4 w-4" />
//                             <span>Admin Dashboard</span>
//                           </Link>
//                         </>
//                       )}

//                       <div className="border-t border-gray-100 my-1"></div>
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-300 ease-in-out w-full text-left"
//                       >
//                         <LogOut className="h-4 w-4" />
//                         <span>Sign Out</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link to="/signin">
//                 <Button
//                   className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-500 ease-in-out hover:scale-105 shadow-md hover:shadow-lg ${
//                     isCompact ? "px-3 py-1 text-sm" : "px-4 py-1.5"
//                   }`}
//                 >
//                   Sign In
//                 </Button>
//               </Link>
//             )}

//             {/* Mobile Menu Toggle */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className={`lg:hidden hover:bg-gray-50 transition-all duration-500 ease-in-out rounded-xl ${
//                 isCompact ? "p-1.5" : "p-2.5"
//               }`}
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? (
//                 <X className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
//               ) : (
//                 <Menu className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Navigation - Desktop */}
//         <nav
//           className={`hidden lg:block border-t border-gray-100 transition-all duration-500 ease-in-out overflow-hidden ${
//             isCompact
//               ? "h-0 scale-y-0 origin-top"
//               : "h-12 scale-y-100 origin-top"
//           }`}
//         >
//           <div
//             className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
//               isCompact ? "py-0" : "py-3"
//             }`}
//           >
//             <div className="flex items-center space-x-6">
//               {navigationItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center space-x-2 py-1.5 px-1 ${getActiveClasses(
//                     item.path
//                   )}`}
//                 >
//                   {item.icon && <item.icon className="h-4 w-4" />}
//                   <span>{item.label}</span>
//                   {item?.badge && (
//                     <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5">
//                       {item.badge}
//                     </Badge>
//                   )}
//                 </Link>
//               ))}
//               {user?.role === "ADMIN" && (
//                 <Link
//                   to="/admin"
//                   className={`flex items-center space-x-2 py-1.5 px-1 ${getActiveClasses(
//                     "/admin"
//                   )}`}
//                 >
//                   <Shield className="h-4 w-4" />
//                   <span>Admin</span>
//                 </Link>
//               )}
//             </div>

//             {/* Quick Actions */}
//             <div
//               className={`flex items-center space-x-3 text-sm text-gray-600 transition-all duration-500 ease-in-out ${
//                 isCompact ? "opacity-0 scale-0" : "opacity-100 scale-100"
//               }`}
//             >
//               <span className="flex items-center space-x-1">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <span>Free Shipping on $50+</span>
//               </span>
//               <span>|</span>
//               <span>24/7 Support</span>
//             </div>
//           </div>
//         </nav>

//         {/* Mobile Search */}
//         <div
//           className={`lg:hidden border-t border-gray-100 transition-all duration-500 ease-in-out ${
//             isCompact ? "py-1.5 scale-y-90" : "py-2.5 scale-y-100"
//           }`}
//         >
//           <form onSubmit={handleSearch} className="relative">
//             <Search
//               className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-500 ease-in-out ${
//                 isCompact ? "left-3 h-4 w-4" : "left-3 h-5 w-5"
//               }`}
//             />
//             <Input
//               placeholder={isCompact ? "Search..." : "Search products..."}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={`w-full border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-500 ease-in-out ${
//                 isCompact ? "pl-9 pr-4 py-1.5 text-sm" : "pl-10 pr-4 py-2.5"
//               }`}
//             />
//           </form>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="lg:hidden border-t border-gray-100 py-3 animate-in slide-in-from-top duration-300 ease-in-out">
//             <div className="space-y-1">
//               {navigationItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center justify-between py-2.5 px-4 rounded-xl transition-all duration-300 ease-in-out ${
//                     isActive(item.path)
//                       ? "bg-blue-50 text-blue-600 font-semibold"
//                       : "text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     {item.icon && <item.icon className="h-5 w-5" />}
//                     <span>{item.label}</span>
//                   </div>
//                   {item.badge && (
//                     <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
//                       {item.badge}
//                     </Badge>
//                   )}
//                 </Link>
//               ))}

//               {/* Mobile User Section */}
//               <div className="pt-3 mt-3 border-t border-gray-200">
//                 {isAuthenticated ? (
//                   <div className="space-y-1">
//                     <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
//                       <Avatar className="h-9 w-9 border-2 border-white shadow-md">
//                         <AvatarImage src={user?.avatar || "/placeholder.svg"} />
//                         <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
//                           {user?.firstName?.[0]}
//                           {user?.lastName?.[0]}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-semibold text-gray-900">
//                           {user?.firstName} {user?.lastName}
//                         </p>
//                         <p className="text-sm text-gray-600">{user?.email}</p>
//                       </div>
//                     </div>

//                     <Link
//                       to="/profile"
//                       className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 ease-in-out"
//                     >
//                       <User className="h-5 w-5" />
//                       <span>Profile</span>
//                     </Link>
//                     <Link
//                       to="/orders"
//                       className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 ease-in-out"
//                     >
//                       <Package className="h-5 w-5" />
//                       <span>Orders</span>
//                     </Link>
//                     <Link
//                       to="/wishlist"
//                       className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 ease-in-out"
//                     >
//                       <Heart className="h-5 w-5" />
//                       <span>Wishlist</span>
//                     </Link>

//                     {user?.role === "ADMIN" && (
//                       <Link
//                         to="/admin"
//                         className="flex items-center space-x-3 px-4 py-2.5 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 ease-in-out font-medium"
//                       >
//                         <Shield className="h-5 w-5" />
//                         <span>Admin Dashboard</span>
//                       </Link>
//                     )}

//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 ease-in-out w-full text-left"
//                     >
//                       <LogOut className="h-5 w-5" />
//                       <span>Sign Out</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <Link to="/signin">
//                     <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-xl font-medium transition-all duration-300 ease-in-out">
//                       Sign In
//                     </Button>
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Click outside to close user menu */}
//       {isUserMenuOpen && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setIsUserMenuOpen(false)}
//         />
//       )}
//     </header>
//   );
// };

// export default Header;

// CHAT GPT VERSION

// "use client";

// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { Home, Search, ShoppingCart, User, Menu, X } from "lucide-react";

// const navigationItems = [
//   { path: "/", label: "Home", icon: Home },
//   { path: "/shop", label: "Shop" },
//   { path: "/categories", label: "Categories" },
//   { path: "/deals", label: "Deals", badge: "Hot" },
//   { path: "/track", label: "Track Order" },
//   { path: "/contact", label: "Contact" },
// ];

// export default function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4 flex items-center justify-between h-16">
//         {/* Logo */}
//         <Link to="/" className="text-xl font-bold text-gray-800">
//           MyStore
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex gap-6">
//           {navigationItems.map((item) => {
//             const Icon = item.icon || null;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className="relative flex items-center gap-1 text-gray-700 hover:text-blue-600"
//               >
//                 {Icon && <Icon className="w-4 h-4" />}
//                 {item.label}
//                 {item.badge && (
//                   <span className="ml-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
//                     {item.badge}
//                   </span>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Search bar */}
//         <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1">
//           <Search className="w-4 h-4 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="bg-transparent outline-none ml-2 text-sm"
//           />
//         </div>

//         {/* Icons */}
//         <div className="flex items-center gap-4">
//           <Link to="/account">
//             <User className="w-5 h-5 text-gray-700 hover:text-blue-600" />
//           </Link>
//           <Link to="/cart" className="relative">
//             <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-blue-600" />
//             <span className="absolute -top-2 -right-2 text-xs bg-blue-600 text-white rounded-full px-1">
//               2
//             </span>
//           </Link>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             {isMobileMenuOpen ? (
//               <X className="w-5 h-5" />
//             ) : (
//               <Menu className="w-5 h-5" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white shadow-sm">
//           <nav className="flex flex-col gap-2 p-4">
//             {navigationItems.map((item) => {
//               const Icon = item.icon || null;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   {Icon && <Icon className="w-4 h-4" />}
//                   {item.label}
//                   {item.badge && (
//                     <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
//                       {item.badge}
//                     </span>
//                   )}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }

// DEEP SEEK VERSION

// import { Link } from 'react-router-dom';
// // import { Home } from '@mui/icons-material'; // or any other icon library you're using
// import { Home } from "lucide-react"; // Make sure lucide-react is installed, or use another icon library you have

// const Header = () => {
//   const navigationItems = [
//     { path: "/", label: "Home", icon: Home },
//     { path: "/shop", label: "Shop" },
//     { path: "/categories", label: "Categories" },
//     { path: "/deals", label: "Deals", badge: "Hot" },
//     { path: "/track", label: "Track Order" },
//     { path: "/contact", label: "Contact" },
//   ];

//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-md">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="text-2xl font-bold text-indigo-600">
//               {/* Replace with your logo image or text */}
//               ShopEase
//             </Link>
//           </div>

//           {/* Search Bar - Desktop */}
//           <div className="hidden md:flex flex-1 max-w-md mx-6">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Search for products..."
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <button className="absolute right-0 top-0 h-full px-4 text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-700 focus:outline-none">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* User Actions */}
//           <div className="flex items-center space-x-4">
//             <button className="p-2 text-gray-600 hover:text-indigo-600">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                 />
//               </svg>
//               <span className="sr-only">Cart</span>
//             </button>
//             <button className="p-2 text-gray-600 hover:text-indigo-600">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                 />
//               </svg>
//               <span className="sr-only">Account</span>
//             </button>
//           </div>
//         </div>

//         {/* Navigation and Mobile Search */}
//         <div className="flex items-center justify-between mt-4">
//           {/* Navigation */}
//           <nav className="hidden md:block">
//             <ul className="flex space-x-6">
//               {navigationItems.map((item) => (
//                 <li key={item.path}>
//                   <Link to={item.path} className="flex items-center px-2 py-1 text-gray-700 hover:text-indigo-600 transition-colors">
//                     {item.icon && <item.icon className="mr-1" />}
//                     {item.label}
//                     {item.badge && (
//                       <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
//                         {item.badge}
//                       </span>
//                     )}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           {/* Mobile Search - Hidden on desktop */}
//           <div className="md:hidden w-full ml-4">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <button className="absolute right-0 top-0 h-full px-4 text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-700 focus:outline-none">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Button - Hidden on desktop */}
//       <div className="md:hidden flex justify-between items-center px-4 py-2 bg-gray-100">
//         <button className="p-2 text-gray-600 hover:text-indigo-600">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//           <span className="sr-only">Menu</span>
//         </button>
//         <div className="flex space-x-4">
//           <button className="p-2 text-gray-600 hover:text-indigo-600">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//               />
//             </svg>
//             <span className="sr-only">Cart</span>
//           </button>
//           <button className="p-2 text-gray-600 hover:text-indigo-600">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//             <span className="sr-only">Account</span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// GROK Version

// import React from 'react';
// import { Home } from 'lucide-react'; // Assuming lucide-react for icons

// const navigationItems = [
//   { path: "/", label: "Home", icon: Home },
//   { path: "/shop", label: "Shop" },
//   { path: "/categories", label: "Categories" },
//   { path: "/deals", label: "Deals", badge: "Hot" },
//   { path: "/track", label: "Track Order" },
//   { path: "/contact", label: "Contact" },
// ];

// const Header: React.FC = () => {
//   return (
//     <header className="bg-white shadow-md sticky top-0 z-50">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <a href="/" className="text-2xl font-bold text-gray-900">
//               MyStore
//             </a>
//           </div>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navigationItems.map((item) => (
//               <a
//                 key={item.path}
//                 href={item.path}
//                 className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
//               >
//                 {item.icon && (
//                   <item.icon className="w-5 h-5 mr-2" aria-hidden="true" />
//                 )}
//                 {item.label}
//                 {item.badge && (
//                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                     {item.badge}
//                   </span>
//                 )}
//               </a>
//             ))}
//           </div>

//           {/* Right Side: Search, Cart, User */}
//           <div className="flex items-center space-x-4">
//             {/* Search */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-48 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <svg
//                 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>

//             {/* Cart */}
//             <a
//               href="/cart"
//               className="text-gray-700 hover:text-blue-600 relative"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                 />
//               </svg>
//               <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
//                 3
//               </span>
//             </a>

//             {/* User Profile */}
//             <a
//               href="/profile"
//               className="text-gray-700 hover:text-blue-600"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </a>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               type="button"
//               className="text-gray-700 hover:text-blue-600 focus:outline-none"
//               aria-label="Toggle menu"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16m-7 6h7"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
