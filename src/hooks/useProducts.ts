import { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts, getProductById } from '../services/db';

interface UseProductsProps {
  category?: string;
  search?: string;
  sortBy?: 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  itemsPerPage?: number;
}

export const useProducts = ({
  category,
  search,
  sortBy = 'rating',
  sortOrder = 'desc',
  page = 1,
  itemsPerPage = 24
}: UseProductsProps = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const maxRetries = 2;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching products (attempt ${retryCount + 1})...`);
        
        const result = await getProducts({
          category,
          search,
          sortBy,
          sortOrder,
          page,
          limit: itemsPerPage
        });
        
        if (!isMounted) return;
        
        if (!result || !result.products) {
          throw new Error('No products data returned from server');
        }
        
        // Check if we have products or if they're empty
        if (result.products.length === 0 && result.total === 0 && !category && !search) {
          throw new Error('No products found in database');
        }
        
        setProducts(result.products);
        setTotalPages(result.totalPages);
        setTotalProducts(result.total);
        
        // Check if we're using mock data
        const usingMock = window.location.href.includes('useMockDb=true') || 
                         (document.querySelector('.bg-blue-50.border-l-4.border-blue-500') !== null);
        setUsingMockData(usingMock);
        
        // Reset retry count on success
        if (retryCount > 0) {
          setRetryCount(0);
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Product fetch error:', err);
        
        // Format a more user-friendly error message
        let errorMessage = 'Failed to fetch products';
        if (err instanceof Error) {
          if (err.message.includes('connect')) {
            errorMessage = 'Database connection failed. Please check if MongoDB is running.';
          } else {
            errorMessage = `Error: ${err.message}`;
          }
        }
        
        setError(errorMessage);
        
        // Check if we're using mock data
        const usingMock = window.location.href.includes('useMockDb=true') || 
                         (document.querySelector('.bg-blue-50.border-l-4.border-blue-500') !== null);
        setUsingMockData(usingMock);
        
        // Auto-retry logic for connection issues (but not for other errors)
        if (retryCount < maxRetries && (err instanceof Error) && 
            (err.message.includes('connect') || err.message.includes('timeout')) &&
            !usingMock) {
          console.log(`Retrying in 3 seconds... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            if (isMounted) {
              setRetryCount(prev => prev + 1);
            }
          }, 3000);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, [category, search, sortBy, sortOrder, page, itemsPerPage, retryCount]);

  const getProduct = async (id?: string): Promise<Product | undefined> => {
    if (!id) return undefined;
    try {
      const product = await getProductById(id);
      return product || undefined;
    } catch (err) {
      console.error('Failed to fetch product:', err);
      return undefined;
    }
  };

  return {
    products,
    loading,
    error,
    totalPages,
    totalProducts,
    getProduct,
    usingMockData
  };
};