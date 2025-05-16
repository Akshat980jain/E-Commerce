import { Order, OrderItem, Address } from '../types';
import { getUserData, saveUserData } from './userDataService';

// Fixed user shipping addresses based on user ID
const getUserAddress = (userId: string): Address[] => {
  const name = userId.includes('1') ? 'John' : (userId.includes('2') ? 'Jane' : 'Alex');
  
  return [
    {
      firstName: name,
      lastName: 'Doe',
      address1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567'
    },
    {
      firstName: name,
      lastName: 'Doe',
      address1: '456 Park Avenue',
      address2: 'Apt 7B',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA',
      phone: '555-987-6543'
    },
    {
      firstName: name,
      lastName: 'Doe',
      address1: '789 Oak Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'USA',
      phone: '555-789-0123'
    }
  ];
};

// Fixed product sets for orders
const productSets: OrderItem[][] = [
  [
    {
      id: 'prod_1',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      category: 'electronics',
      inStock: true,
      rating: 4.5,
      reviews: 128,
      discount: 0,
      quantity: 1
    },
    {
      id: 'prod_2',
      name: 'Smart Watch',
      description: 'Fitness tracking smart watch with heart rate monitor',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      category: 'electronics',
      inStock: true,
      rating: 4.2,
      reviews: 95,
      discount: 10,
      quantity: 1
    }
  ],
  [
    {
      id: 'prod_3',
      name: 'Smartphone',
      description: 'Latest smartphone with advanced camera features',
      price: 799.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      category: 'electronics',
      inStock: true,
      rating: 4.8,
      reviews: 253,
      discount: 5,
      quantity: 1
    }
  ],
  [
    {
      id: 'prod_4',
      name: 'Laptop Backpack',
      description: 'Durable backpack with laptop compartment and USB charging port',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7',
      category: 'accessories',
      inStock: true,
      rating: 4.3,
      reviews: 76,
      discount: 0,
      quantity: 1
    },
    {
      id: 'prod_5',
      name: 'Wireless Keyboard',
      description: 'Ergonomic wireless keyboard with customizable keys',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      category: 'electronics',
      inStock: true,
      rating: 4.1,
      reviews: 42,
      discount: 0,
      quantity: 2
    },
    {
      id: 'prod_6',
      name: 'USB-C Hub',
      description: 'Multi-port USB-C hub with HDMI, USB-A and SD card slots',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1625727966305-085c2300ba0a',
      category: 'accessories',
      inStock: true,
      rating: 4.4,
      reviews: 63,
      discount: 15,
      quantity: 1
    }
  ]
];

// Initialize mock orders for a user (only if they don't already have orders)
const initUserOrders = (userId: string): Order[] => {
  // Determine which orders to create based on user ID
  const userAddresses = getUserAddress(userId);
  const userOrders: Order[] = [];
  const now = new Date();
  
  // User ID starting with 1 gets set 1 of orders
  if (userId.startsWith('1')) {
    userOrders.push(
      {
        id: `ord_1001`,
        userId,
        items: productSets[0],
        totalAmount: 0, // Will be calculated below
        status: 'delivered',
        shippingAddress: userAddresses[0],
        paymentMethod: 'credit_card',
        paymentId: `txn_${userId}_1001`,
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: `ord_1002`,
        userId,
        items: productSets[1],
        totalAmount: 0, // Will be calculated below
        status: 'shipped',
        shippingAddress: userAddresses[1],
        paymentMethod: 'paypal',
        paymentId: `txn_${userId}_1002`,
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      }
    );
  }
  
  // User ID starting with 2 gets set 2 of orders
  if (userId.startsWith('2')) {
    userOrders.push(
      {
        id: `ord_2001`,
        userId,
        items: productSets[2],
        totalAmount: 0, // Will be calculated below
        status: 'processing',
        shippingAddress: userAddresses[2],
        paymentMethod: 'cod',
        paymentId: `cod_${userId}_2001`,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    );
  }
  
  // All users get this order
  userOrders.push({
    id: `ord_3001`,
    userId,
    items: [...productSets[0], ...productSets[1]],
    totalAmount: 0, // Will be calculated below
    status: 'pending',
    shippingAddress: userAddresses[0],
    paymentMethod: 'upi',
    paymentId: `upi_${userId}_3001`,
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  });
  
  // Calculate total amounts for each order
  userOrders.forEach(order => {
    order.totalAmount = calculateOrderTotal(order.items);
  });
  
  return userOrders;
};

// Save user orders to localStorage
const saveUserOrders = (userId: string, orders: Order[]): void => {
  saveUserData(userId, 'orders', orders);
};

// Get all orders for a user
export const getUserOrders = (userId: string): Order[] => {
  // Get orders from localStorage or initialize if none exist
  const orders = getUserData<Order[]>(userId, 'orders', []);
  
  // If no orders exist, create and store initialized orders
  if (orders.length === 0) {
    const initialOrders = initUserOrders(userId);
    saveUserOrders(userId, initialOrders);
    return initialOrders;
  }
  
  return orders;
};

// Get a single order by ID
export const getOrderById = (orderId: string, userId: string): Order | undefined => {
  const orders = getUserOrders(userId);
  return orders.find(order => order.id === orderId);
};

// Remove item from order
export const removeItemFromOrder = (orderId: string, itemId: string, userId: string): Order | undefined => {
  const orders = getUserOrders(userId);
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) return undefined;
  
  const order = { ...orders[orderIndex] };
  const itemIndex = order.items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) return order;
  
  // Remove the item
  const updatedItems = [...order.items];
  updatedItems.splice(itemIndex, 1);
  
  // Update order with new items and recalculate total
  const updatedOrder = {
    ...order,
    items: updatedItems,
    totalAmount: calculateOrderTotal(updatedItems),
    updatedAt: new Date().toISOString() // Update the timestamp
  };
  
  // Update the order in the orders array
  const updatedOrders = [...orders];
  updatedOrders[orderIndex] = updatedOrder;
  
  // Save the updated orders to localStorage
  saveUserOrders(userId, updatedOrders);
  
  return updatedOrder;
};

// Clear all orders for a user
export const clearOrderHistory = (userId: string): void => {
  saveUserOrders(userId, []);
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

// Calculate order total with discounts
export const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => {
    const discountedPrice = item.price * (1 - item.discount / 100);
    return total + (discountedPrice * item.quantity);
  }, 0);
};

// Format date to readable string
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Get status badge color
export const getStatusColor = (status: Order['status']): { bg: string; text: string; border: string } => {
  switch (status) {
    case 'pending':
      return { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' };
    case 'processing':
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
    case 'shipped':
      return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' };
    case 'delivered':
      return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' };
  }
}; 