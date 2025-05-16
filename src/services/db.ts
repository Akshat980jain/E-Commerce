import connectDB from '../lib/mongodb';
import Product from '../models/Product';
import User from '../models/User';
import Order from '../models/Order';
import { generateMockProducts } from '../data/generateMockProducts';
import MockDatabase from './mockDb';
import { Product as ProductType } from '../types';

// Flag to track if we're using mock database
let usingMockDatabase = false;

export async function initializeDatabase() {
  try {
    // First try to connect to MongoDB
    await connectDB();
    
    // MongoDB connected successfully, check if products collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding products...');
      const mockProducts = generateMockProducts(100); // Reduced for faster seeding
      await Product.insertMany(mockProducts);
      console.log('Products seeded successfully');
    } else {
      console.log(`Database already contains ${productCount} products`);
    }
    
    // Using real MongoDB
    usingMockDatabase = false;
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    console.log('Falling back to mock database...');
    
    // MongoDB connection failed, initialize mock database
    const mockDb = MockDatabase.getInstance();
    const success = await mockDb.initialize();
    
    // Using mock database
    usingMockDatabase = true;
    
    return success;
  }
}

export async function getProducts(options: {
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  // If using mock database, use it instead of MongoDB
  if (usingMockDatabase) {
    const mockDb = MockDatabase.getInstance();
    return await mockDb.getProducts(options);
  }
  
  const { category, search, sortBy = 'rating', sortOrder = 'desc', page = 1, limit = 24 } = options;
  
  try {
    const db = await connectDB();
    console.log('Database connected successfully for product fetch');
    
    const query: Record<string, any> = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sort: Record<string, number> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    // Add logging for query debugging
    console.log('Product query:', JSON.stringify(query));
    console.log('Product sort:', JSON.stringify(sort));
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);
    
    console.log(`Found ${products.length} products out of ${total} total`);
    
    return {
      products,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Failed to fetch products - Detailed error:', error);
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // If MongoDB query fails, fall back to mock database
    console.log('Falling back to mock database for product fetch...');
    const mockDb = MockDatabase.getInstance();
    usingMockDatabase = true;
    return await mockDb.getProducts(options);
  }
}

export async function getProductById(id: string): Promise<ProductType | null> {
  // If using mock database, use it instead of MongoDB
  if (usingMockDatabase) {
    const mockDb = MockDatabase.getInstance();
    return await mockDb.getProductById(id);
  }
  
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    return product as ProductType;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    
    // If MongoDB query fails, fall back to mock database
    console.log('Falling back to mock database for product fetch...');
    const mockDb = MockDatabase.getInstance();
    usingMockDatabase = true;
    return await mockDb.getProductById(id);
  }
}