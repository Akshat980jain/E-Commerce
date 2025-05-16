// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  discount: number;
}

// Cart types
export interface CartItem extends Product {
  quantity: number;
}

// Order types
export interface OrderItem extends CartItem {}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: Address;
  paymentMethod: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Address type
export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}