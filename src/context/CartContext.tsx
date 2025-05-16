import React, { createContext, useReducer, useEffect } from 'react';
import { Product, CartItem } from '../types';

type CartState = {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
};

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

type CartContextType = CartState & {
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const initialState: CartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateCartTotals = (cartItems: CartItem[]) => {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload;
      const existingItemIndex = state.cartItems.findIndex(item => item.id === product.id);
      
      let updatedCartItems;
      
      if (existingItemIndex >= 0) {
        // Item already in cart, update quantity
        updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + 1
        };
      } else {
        // Add new item to cart
        updatedCartItems = [
          ...state.cartItems,
          { ...product, quantity: 1 }
        ];
      }
      
      const { totalItems, totalPrice } = calculateCartTotals(updatedCartItems);
      
      return {
        cartItems: updatedCartItems,
        totalItems,
        totalPrice
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedCartItems = state.cartItems.filter(item => item.id !== action.payload);
      const { totalItems, totalPrice } = calculateCartTotals(updatedCartItems);
      
      return {
        cartItems: updatedCartItems,
        totalItems,
        totalPrice
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove item
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: id });
      }
      
      const updatedCartItems = state.cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      const { totalItems, totalPrice } = calculateCartTotals(updatedCartItems);
      
      return {
        cartItems: updatedCartItems,
        totalItems,
        totalPrice
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
};

// Create context
export const CartContext = createContext<CartContextType>({
  ...initialState,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

// Provider component
export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Get cart from localStorage on initial load
  const storedCart = localStorage.getItem('cart');
  const parsedCart = storedCart ? JSON.parse(storedCart) : initialState;
  
  const [state, dispatch] = useReducer(cartReducer, parsedCart);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };
  
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};