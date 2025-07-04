import { useState } from "react";
import { Search, ShoppingCart, User, Home, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartCount } from "@/hooks/useCart";
import { useIsAuthenticated, useLogout } from "@/hooks/useAuth";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: cartCount = 0 } = useCartCount();
  const { isAuthenticated, user } = useIsAuthenticated();
  const logout = useLogout();

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
      ? "text-blue-600 font-medium"
      : "text-gray-700 hover:text-blue-600 transition-colors";
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div>
          <div className="flex items-center justify-between py-4 w-full">
            {/* Logo */}
            <div className="flex items-center mr-10">
              <Link className="flex items-center space-x-3" to="/">
                <img src="/image.png" alt="Grace Logo" className="w-10 h-10" />
                <h1 className="text-2xl font-bold text-yellow-600">Grace</h1>
              </Link>
            </div>

            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for products..."
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" className="relative p-2">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User account */}
              {isAuthenticated ? (
                <div className="relative group">
                  <Button
                    variant="ghost"
                    className="p-2"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="h-6 w-6" />
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/signin">
                  <Button variant="ghost" className="p-2">
                    <User className="h-6 w-6" />
                  </Button>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="">
            <div className="flex items-center justify-between py-3">
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  to="/"
                  className={`flex items-center space-x-1 ${getActiveClasses(
                    "/"
                  )}`}
                >
                  {/* <Home className="h-4 w-4" /> */}
                  <span>Home</span>
                </Link>
                <Link
                  to="/shop"
                  className={`ml-10 ${getActiveClasses("/shop")}`}
                >
                  Shop
                </Link>
                <Link
                  to="/categories"
                  className={getActiveClasses("/categories")}
                >
                  Categories
                </Link>
                <Link to="/deals" className={getActiveClasses("/deals")}>
                  Deals
                </Link>
                <Link to="/track" className={getActiveClasses("/track")}>
                  Track Order
                </Link>
                <Link to="/contact" className={getActiveClasses("/contact")}>
                  Contact
                </Link>
                {user?.role === "ADMIN" && (
                  <Link to="/admin" className={getActiveClasses("/admin")}>
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile search */}
        <div className="md:hidden py-3 border-t border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for products..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`flex items-center space-x-2 py-2 ${getActiveClasses(
                  "/"
                )}`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/shop" className={`py-2 ${getActiveClasses("/shop")}`}>
                Shop
              </Link>
              <Link
                to="/categories"
                className={`py-2 ${getActiveClasses("/categories")}`}
              >
                Categories
              </Link>
              <Link
                to="/deals"
                className={`py-2 ${getActiveClasses("/deals")}`}
              >
                Deals
              </Link>
              <Link
                to="/track"
                className={`py-2 ${getActiveClasses("/track")}`}
              >
                Track Order
              </Link>
              <Link
                to="/contact"
                className={`py-2 ${getActiveClasses("/contact")}`}
              >
                Contact
              </Link>
              <div className="pt-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link to="/signin">
                    <Button className="w-full">Sign In</Button>
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
