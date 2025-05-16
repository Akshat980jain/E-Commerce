import { Product } from '../types';
import { generateMockProducts } from '../data/generateMockProducts';

// In-memory store for our mock data
class MockDatabase {
  private static instance: MockDatabase;
  private products: Product[] = [];
  private initialized = false;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  public async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    
    console.log('Initializing mock database...');
    try {
      // Generate mock products
      this.products = generateMockProducts(50);
      this.initialized = true;
      console.log('Mock database initialized with 50 products');
      return true;
    } catch (error) {
      console.error('Failed to initialize mock database:', error);
      return false;
    }
  }

  public async getProducts(options: {
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; totalPages: number }> {
    const { category, search, sortBy = 'rating', sortOrder = 'desc', page = 1, limit = 24 } = options;
    
    // Filter products
    let filteredProducts = [...this.products];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort products
    filteredProducts.sort((a, b) => {
      const aValue = a[sortBy as keyof Product];
      const bValue = b[sortBy as keyof Product];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Default sort for non-numeric fields
      return sortOrder === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    
    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit)
    };
  }

  public async getProductById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }
}

export default MockDatabase; 