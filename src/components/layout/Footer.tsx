import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram,
  Heart
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="animate-fade-in">
            <Link to="/" className="text-xl font-bold flex items-center mb-4 group transition-all duration-300">
              <ShoppingBag className="mr-2 group-hover:text-blue-400 transition-colors" />
              <span className="group-hover:text-blue-400 transition-colors">QuickKart</span>
            </Link>
            <p className="text-gray-300 dark:text-gray-400 mb-4">
              Your one-stop shop for all your shopping needs. Quality products, competitive prices.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 dark:text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-300 dark:text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-300 dark:text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white group flex items-center transition-colors"
                >
                  <span className="w-0 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white group flex items-center transition-colors"
                >
                  <span className="w-0 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white group flex items-center transition-colors"
                >
                  <span className="w-0 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                  Cart
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white group flex items-center transition-colors"
                >
                  <span className="w-0 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/products?category=electronics" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white group flex items-center transition-colors"
                >
                  <span className="w-0 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                  Electronics
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=clothing" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white group flex items-center transition-colors"
                >
                  <span className="w-0 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                  Clothing
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=home" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white group flex items-center transition-colors"
                >
                  <span className="w-0 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=beauty" 
                  className="text-gray-300 dark:text-gray-400 hover:text-white group flex items-center transition-colors"
                >
                  <span className="w-0 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:w-3 group-hover:mr-2"></span>
                  Beauty & Personal Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start group">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-gray-300 dark:text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-gray-300 dark:text-gray-400 group-hover:text-white transition-colors">
                  123 Commerce St, Shopping City, SC 12345
                </span>
              </li>
              <li className="flex items-center group">
                <Phone size={18} className="mr-2 flex-shrink-0 text-gray-300 dark:text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-gray-300 dark:text-gray-400 group-hover:text-white transition-colors">
                  (123) 456-7890
                </span>
              </li>
              <li className="flex items-center group">
                <Mail size={18} className="mr-2 flex-shrink-0 text-gray-300 dark:text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-gray-300 dark:text-gray-400 group-hover:text-white transition-colors">
                  support@quickkart.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center">
            &copy; {new Date().getFullYear()} QuickKart. All rights reserved. 
            <span className="flex items-center ml-2">
              Made with <Heart size={14} className="mx-1 text-red-500" fill="currentColor" /> by QuickKart Team
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;