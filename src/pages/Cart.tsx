import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  
  // Calculate shipping costs
  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  // Calculate tax (e.g. 8.5%)
  const taxRate = 0.085;
  const taxAmount = totalPrice * taxRate;
  // Calculate final total
  const orderTotal = totalPrice + shippingCost + taxAmount;
  
  if (cartItems.length === 0) {
    return (
      <div className="py-8 max-w-3xl mx-auto">
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="bg-gray-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={32} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link 
            to="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500 bg-gray-50 p-4">
              <div className="col-span-2">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 p-4 items-center">
                  {/* Product */}
                  <div className="col-span-2 flex items-center mb-4 md:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm flex items-center mt-2 md:hidden"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="mb-4 md:mb-0">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Price:</div>
                    <div className="font-medium">₹{item.price.toFixed(2)}</div>
                  </div>
                  
                  {/* Quantity */}
                  <div className="mb-4 md:mb-0">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Quantity:</div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-12 text-center mx-1 p-1 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="mb-4 md:mb-0">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Total:</div>
                    <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  
                  {/* Remove Button (desktop) */}
                  <div className="hidden md:block text-right">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Continue Shopping Link */}
          <div className="mt-6">
            <Link to="/products" className="text-blue-600 flex items-center hover:underline">
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 font-bold flex justify-between">
                <span>Total</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-grow p-2 border border-r-0 border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
            
            {/* Free Shipping Notice */}
            {totalPrice < 50 && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-6 flex items-start">
                <AlertCircle size={18} className="flex-shrink-0 mr-2 mt-0.5" />
                <span>Add ₹{(50 - totalPrice).toFixed(2)} more to qualify for FREE shipping!</span>
              </div>
            )}
            
            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;