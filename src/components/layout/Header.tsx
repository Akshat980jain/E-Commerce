import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DynamicIcon from '../common/DynamicIcon';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Add scroll event listener to create sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle clicks outside of user menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
    setSearchQuery('');
    setIsMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header 
      className={`bg-white dark:bg-gray-900 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center transition-transform hover:scale-105 duration-300"
          >
            <DynamicIcon name="bag" size="lg" color={theme === 'dark' ? '#60a5fa' : '#2563eb'} className="mr-2" />
            <span>QuickKart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              <span>Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              <span>Products</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
              >
                <span>Admin</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 
                        dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 
                        focus:ring-blue-500 transition duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <DynamicIcon name="search" size="sm" />
              </div>
            </div>
          </form>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme} 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 
                      transition-all duration-300 hover:rotate-12"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <DynamicIcon name="lightMode" size="md" animate="pulse" />
              ) : (
                <DynamicIcon name="darkMode" size="md" animate="pulse" />
              )}
            </button>
            
            {/* Notifications */}
            <button 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 
                      transition-colors relative"
              aria-label="Notifications"
            >
              <DynamicIcon name="notification" size="md" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-2 h-2"></span>
            </button>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 
                      transition-colors relative"
              aria-label="Cart"
            >
              <DynamicIcon name="cart" size="md" animate={totalItems > 0 ? "bounce" : "none"} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 
                            flex items-center justify-center animate-scale">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={toggleUserMenu}
                  className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 
                          transition-colors flex items-center ${isUserMenuOpen ? 'text-blue-600 dark:text-blue-400' : ''}`}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold mr-2 border-2 border-transparent hover:border-blue-500 transition-all">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                  <DynamicIcon 
                    name={isUserMenuOpen ? "up" : "down"} 
                    size="sm" 
                    className="ml-1 transition-transform" 
                  />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50
                            animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <DynamicIcon name="user" size="sm" className="mr-2" />
                      Your Profile
                    </Link>
                    
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <DynamicIcon name="box" size="sm" className="mr-2" />
                      Order History
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <DynamicIcon name="users" size="sm" className="mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 
                              hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <div className="flex items-center">
                        <DynamicIcon name="logout" size="sm" className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
              >
                <DynamicIcon name="user" size="sm" className="mr-1" />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 dark:text-gray-200" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <DynamicIcon name="x" size="lg" animate="none" />
              ) : (
                <DynamicIcon name="menu" size="lg" animate="none" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 
                          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <DynamicIcon name="search" size="sm" />
                </div>
              </div>
            </form>
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <DynamicIcon name="home" size="sm" className="mr-2" />
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <DynamicIcon name="tag" size="sm" className="mr-2" />
                Products
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <DynamicIcon name="user" size="sm" className="mr-2" />
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <DynamicIcon name="box" size="sm" className="mr-2" />
                    Orders
                  </Link>
                </>
              )}
              
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <DynamicIcon name="users" size="sm" className="mr-2" />
                  Admin
                </Link>
              )}
              {!user ? (
                <Link 
                  to="/login" 
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <DynamicIcon name="user" size="sm" className="mr-2" />
                  Login
                </Link>
              ) : (
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                  className="text-left text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                >
                  <DynamicIcon name="logout" size="sm" className="mr-2" />
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;