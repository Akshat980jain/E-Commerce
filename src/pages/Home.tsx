import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  CreditCard, 
  Package, 
  Headphones, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

import ProductCard from '../components/product/ProductCard';
import { useProducts } from '../hooks/useProducts';

const Home: React.FC = () => {
  const { products, loading } = useProducts({ itemsPerPage: 8 });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-2xl overflow-hidden">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Shop Smart, Shop <span className="text-yellow-300 inline-block animate-pulse-slow">Quick</span> with QuickKart
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-md mx-auto md:mx-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Discover amazing products at unbeatable prices. Free shipping on your first order!
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold 
                      px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition 
                      duration-300 transform hover:-translate-y-1 group"
            >
              <span>Shop Now</span>
              <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
            </Link>
          </div>
          <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-30 
                          animate-pulse-slow"></div>
              <img 
                src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                alt="Shopping Bags" 
                className="relative rounded-lg shadow-xl object-cover w-full h-80 md:h-96 z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30 text-center 
                         transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in">
              <div className="text-blue-600 dark:text-blue-400 mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 
                         flex items-center justify-center rounded-full mb-4">
                <Truck size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-300">On orders over $50</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30 text-center 
                         transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in" 
                 style={{ animationDelay: '0.1s' }}>
              <div className="text-blue-600 dark:text-blue-400 mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 
                         flex items-center justify-center rounded-full mb-4">
                <Package size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Easy Returns</h3>
              <p className="text-gray-600 dark:text-gray-300">30-day return policy</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30 text-center 
                         transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in" 
                 style={{ animationDelay: '0.2s' }}>
              <div className="text-blue-600 dark:text-blue-400 mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 
                         flex items-center justify-center rounded-full mb-4">
                <CreditCard size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-300">100% secure checkout</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30 text-center 
                         transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in" 
                 style={{ animationDelay: '0.3s' }}>
              <div className="text-blue-600 dark:text-blue-400 mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 
                         flex items-center justify-center rounded-full mb-4">
                <Headphones size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold dark:text-white">Featured Products</h2>
            <Link 
              to="/products" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                     flex items-center group transition-colors"
            >
              <span>View All</span> 
              <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden h-96 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="flex justify-between items-center mt-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">Shop By Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/products?category=electronics" 
              className="relative overflow-hidden rounded-lg h-64 group animate-fade-in"
            >
              <img
                src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Electronics"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                  <h3 className="text-white text-2xl font-bold mb-1">Electronics</h3>
                  <p className="text-white/80 mb-3">Latest gadgets and devices</p>
                  <span className="inline-flex items-center text-sm text-blue-300 group-hover:text-blue-400 transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/products?category=clothing" 
              className="relative overflow-hidden rounded-lg h-64 group animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <img
                src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Clothing"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                  <h3 className="text-white text-2xl font-bold mb-1">Clothing</h3>
                  <p className="text-white/80 mb-3">Trendy fashion for everyone</p>
                  <span className="inline-flex items-center text-sm text-blue-300 group-hover:text-blue-400 transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/products?category=home" 
              className="relative overflow-hidden rounded-lg h-64 group animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <img
                src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Home & Kitchen"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                  <h3 className="text-white text-2xl font-bold mb-1">Home & Kitchen</h3>
                  <p className="text-white/80 mb-3">Essentials for your space</p>
                  <span className="inline-flex items-center text-sm text-blue-300 group-hover:text-blue-400 transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-100 dark:bg-gray-800 rounded-lg animate-fade-in">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Get exclusive deals, updates, and more delivered to your inbox.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                       dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-lg 
                       hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;