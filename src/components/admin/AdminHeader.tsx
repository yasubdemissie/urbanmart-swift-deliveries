// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import {
//   Shield,
//   BarChart3,
//   Users,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Home,
//   Bell,
//   FileText,
//   CreditCard,
//   Store,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { useIsAuthenticated } from "@/hooks/useAuth";
// import { useLogout } from "@/hooks/useAuth";

// interface AdminHeaderProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// const AdminHeader = ({ activeTab, onTabChange }: AdminHeaderProps) => {
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

//   const { user, isAuthenticated } = useIsAuthenticated();
//   const logout = useLogout();

//   const adminNavigationItems = [
//     { id: "dashboard", label: "Dashboard", icon: BarChart3 },
//     { id: "users", label: "Users", icon: Users },
//     { id: "reports", label: "Reports", icon: FileText },
//     { id: "transactions", label: "Transactions", icon: CreditCard },
//     { id: "merchant-stores", label: "Merchant Stores", icon: Store },
//   ];

//   const handleTabClick = (tabId: string) => {
//     onTabChange(tabId);
//     setIsMenuOpen(false);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsUserMenuOpen(false);
//     navigate("/");
//   };

//   if (
//     !isAuthenticated ||
//     (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN")
//   ) {
//     return null;
//   }

//   return (
//     <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//       {/* Top Bar */}
//       <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
//         <div className="container mx-auto px-4 py-2">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Shield className="h-6 w-6" />
//               <div>
//                 <h1 className="text-lg font-semibold">Admin Dashboard</h1>
//                 <p className="text-sm text-purple-100">
//                   {user?.firstName} {user?.lastName} - {user?.role}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {/* Notifications */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="text-white hover:bg-white/20"
//               >
//                 <Bell className="h-5 w-5" />
//                 <Badge variant="destructive" className="ml-1 h-5 w-5 text-xs">
//                   3
//                 </Badge>
//               </Button>

//               {/* User Menu */}
//               <div className="relative">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-white hover:bg-white/20"
//                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                 >
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={user?.avatar} />
//                     <AvatarFallback>
//                       {user?.firstName?.[0]}
//                       {user?.lastName?.[0]}
//                     </AvatarFallback>
//                   </Avatar>
//                 </Button>

//                 {isUserMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
//                     <div className="px-4 py-2 border-b">
//                       <p className="text-sm font-medium text-gray-900">
//                         {user?.firstName} {user?.lastName}
//                       </p>
//                       <p className="text-sm text-gray-500">{user?.email}</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <LogOut className="h-4 w-4 inline mr-2" />
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Bar */}
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between py-3">
//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-1">
//             {adminNavigationItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = activeTab === item.id;

//               return (
//                 <Button
//                   key={item.id}
//                   variant={isActive ? "default" : "ghost"}
//                   size="sm"
//                   onClick={() => handleTabClick(item.id)}
//                   className={`flex items-center space-x-2 ${
//                     isActive
//                       ? "bg-purple-600 text-white"
//                       : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
//                   }`}
//                 >
//                   <Icon className="h-4 w-4" />
//                   <span>{item.label}</span>
//                 </Button>
//               );
//             })}
//           </nav>

//           {/* Mobile Menu Button */}
//           <Button
//             variant="ghost"
//             size="sm"
//             className="md:hidden"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? (
//               <X className="h-5 w-5" />
//             ) : (
//               <Menu className="h-5 w-5" />
//             )}
//           </Button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t py-3">
//             <nav className="flex flex-col space-y-2">
//               {adminNavigationItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeTab === item.id;

//                 return (
//                   <Button
//                     key={item.id}
//                     variant={isActive ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => handleTabClick(item.id)}
//                     className={`justify-start ${
//                       isActive
//                         ? "bg-purple-600 text-white"
//                         : "text-gray-600 hover:text-purple-600"
//                     }`}
//                   >
//                     <Icon className="h-4 w-4 mr-2" />
//                     <span>{item.label}</span>
//                   </Button>
//                 );
//               })}
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default AdminHeader;

"use client";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Shield,
  BarChart3,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  FileText,
  CreditCard,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useAuth";

interface AdminHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminHeader = ({ activeTab, onTabChange }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, isAuthenticated } = useIsAuthenticated();
  const logout = useLogout();

  const adminNavigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "merchant-stores", label: "Stores", icon: Store },
  ];

  //   const adminNavigationItems = [
//     { id: "dashboard", label: "Dashboard", icon: BarChart3 },
//     { id: "users", label: "Users", icon: Users },
//     { id: "reports", label: "Reports", icon: FileText },
//     { id: "transactions", label: "Transactions", icon: CreditCard },
//     { id: "merchant-stores", label: "Merchant Stores", icon: Store },
//   ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white sticky top-0 z-50 shadow-lg border-b border-purple-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">Admin Panel</h1>
                <p className="text-purple-300 text-xs">UrbanMart Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {adminNavigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-white/20 text-white border border-white/30"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Store</span>
            </Button>

            {isAuthenticated && user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 hover:bg-white/10 rounded-xl p-2"
                >
                  <Avatar className="h-8 w-8 border-2 border-purple-300">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm">
                      {user?.firstName?.[0] || user?.email?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName || user?.email || "Admin"}
                    </p>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      Admin
                    </Badge>
                  </div>
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border py-2 z-50">
                    <div className="px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user?.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {user?.firstName?.[0] || user?.email?.[0] || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user?.firstName || user?.email || "Admin"}
                          </p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate("/");
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 w-full text-left"
                      >
                        <Home className="h-4 w-4" />
                        <span>View Store</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-white/10"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-purple-700 py-4">
            <div className="space-y-2">
              {adminNavigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-3 py-3 px-4 rounded-xl w-full text-left ${
                    activeTab === item.id
                      ? "bg-white/20 text-white"
                      : "text-purple-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;
