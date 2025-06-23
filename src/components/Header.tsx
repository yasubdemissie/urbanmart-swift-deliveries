
import { useState } from 'react';
import { Search, ShoppingCart, User, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [cartCount, setCartCount] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-blue-600">UrbanMart</h1>
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
            <Button variant="ghost" className="relative p-2">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* User account */}
            <Button variant="ghost" className="p-2">
              <User className="h-6 w-6" />
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200">
          <div className="flex items-center justify-between py-3">
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-blue-600 transition-colors">Shop</Link>
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">Categories</Link>
              <Link to="/deals" className="text-gray-700 hover:text-blue-600 transition-colors">Deals</Link>
              <Link to="/track" className="text-gray-700 hover:text-blue-600 transition-colors">Track Order</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">📞 1-800-URBAN-MART</span>
              <Link to="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </nav>

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
              <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-blue-600 py-2">Shop</Link>
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 py-2">Categories</Link>
              <Link to="/deals" className="text-gray-700 hover:text-blue-600 py-2">Deals</Link>
              <Link to="/track" className="text-gray-700 hover:text-blue-600 py-2">Track Order</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 py-2">Contact</Link>
              <div className="pt-3 border-t border-gray-200">
                <Link to="/signin">
                  <Button className="w-full">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
