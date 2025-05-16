import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { useProducts } from '../hooks/useProducts';
import DynamicIcon from '../components/common/DynamicIcon';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'sports', name: 'Sports' },
  { id: 'books', name: 'Books' },
  { id: 'toys', name: 'Toys' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'garden', name: 'Garden' },
  { id: 'food', name: 'Food & Beverages' }
];

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1');
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  
  const categoryFilter = selectedCategory !== 'all' ? selectedCategory : undefined;
  
  const { products, loading, error, totalPages, totalProducts, usingMockData } = useProducts({
    category: categoryFilter,
    search: searchQuery,
    sortBy,
    sortOrder,
    page: currentPage,
    itemsPerPage: 24
  });

  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    setSearchParams(params);
  }, [selectedCategory, searchQuery, currentPage, setSearchParams]);
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    // setSearchQuery is not needed here since it's already updated via onChange
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('rating');
    setSortOrder('desc');
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = window.innerWidth < 640 ? 3 : 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  // Add a retry function
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center">
              <DynamicIcon name="filter" size="sm" className="mr-2" />
              <span className="font-medium">Filters</span>
            </div>
            <DynamicIcon name="down" size="sm" className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Sidebar Filters */}
        <div 
          className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block lg:w-64 space-y-6 sticky top-20 h-fit`}
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:underline flex items-center"
              >
                <DynamicIcon name="close" size="xs" className="mr-1" />
                Clear All
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      id={category.id}
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={() => {
                        setSelectedCategory(category.id);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <label htmlFor={category.id} className="ml-2 text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">${priceRange[0]}</span>
                  <span className="text-gray-500 text-sm">${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="text-xs text-gray-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs text-gray-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sort Options */}
            <div>
              <h3 className="font-medium mb-3">Sort By</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rating-desc"
                    name="sort"
                    checked={sortBy === 'rating' && sortOrder === 'desc'}
                    onChange={() => { setSortBy('rating'); setSortOrder('desc'); }}
                    className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="rating-desc" className="ml-2 text-gray-700">
                    Highest Rated
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-asc"
                    name="sort"
                    checked={sortBy === 'price' && sortOrder === 'asc'}
                    onChange={() => { setSortBy('price'); setSortOrder('asc'); }}
                    className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="price-asc" className="ml-2 text-gray-700">
                    Price: Low to High
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-desc"
                    name="sort"
                    checked={sortBy === 'price' && sortOrder === 'desc'}
                    onChange={() => { setSortBy('price'); setSortOrder('desc'); }}
                    className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="price-desc" className="ml-2 text-gray-700">
                    Price: High to Low
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:flex-1">
          {/* Search and Sorting */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <DynamicIcon name="search" size="sm" />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <DynamicIcon name="close" size="sm" />
                    </button>
                  )}
                </div>
              </form>
              
              <div className="flex items-center gap-2">
                <label htmlFor="mobile-sort" className="text-gray-700 font-medium whitespace-nowrap">
                  Sort By:
                </label>
                <select
                  id="mobile-sort"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-') as ['price' | 'rating', 'asc' | 'desc'];
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating-desc">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Product Grid or Error State */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block w-16 h-16 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 my-6 text-center">
              <DynamicIcon name="close" size="xl" color="#ef4444" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load products</h3>
              <p className="text-gray-600 mb-6">
                There was a problem connecting to the database. Please try again.
              </p>
              <button 
                onClick={handleRetry}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <DynamicIcon name="cart" size="sm" color="#ffffff" className="mr-2" withHoverEffect={false} />
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 my-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try changing your search or filter options.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center mx-auto"
              >
                <DynamicIcon name="filter" size="sm" color="#ffffff" className="mr-2" withHoverEffect={false} />
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Products Count */}
              <div className="mb-4 text-gray-600">
                Showing {products.length} of {totalProducts} products
              </div>
              
              {usingMockData && (
                <div className="mb-4 p-2 bg-blue-50 text-blue-600 text-sm rounded-md flex items-center">
                  <DynamicIcon name="notification" size="sm" className="mr-2" />
                  <span>Showing sample data. MongoDB connection unavailable.</span>
                </div>
              )}
              
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DynamicIcon name="left" size="md" />
                  </button>
                  
                  {renderPaginationButtons()}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DynamicIcon name="right" size="md" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;