
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">UrbanMart</h3>
            <p className="text-gray-300 mb-4">
              Your trusted e-commerce platform for quality products with fast, reliable delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                📧
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                📱
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                🐦
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</a></li>
              <li><a href="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</a></li>
              <li><a href="/deals" className="text-gray-300 hover:text-white transition-colors">Deals</a></li>
              <li><a href="/track" className="text-gray-300 hover:text-white transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/returns" className="text-gray-300 hover:text-white transition-colors">Returns</a></li>
              <li><a href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="/support" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <p className="text-gray-300 mb-4">
              Subscribe for exclusive deals and updates
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 UrbanMart. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>🔒</span>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🚚</span>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>↩️</span>
              <span>Easy Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
