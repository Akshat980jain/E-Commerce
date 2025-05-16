import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import DynamicIcon from '../components/common/DynamicIcon';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useCart();
  const { user } = useAuth();
  const [formValues, setFormValues] = useState({
    name: '',
    address: '',
    city: '',
    postal: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!cartItems.length) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value
    });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formValues.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formValues.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formValues.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formValues.postal.trim()) {
      errors.postal = 'Postal code is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Navigate to payment with shipping information
      navigate('/payment', { 
        state: { 
          fromCheckout: true,
          shippingInfo: formValues
        } 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                id="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <input
                type="text"
                id="address"
                value={formValues.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
              {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
              <input
                type="text"
                id="city"
                value={formValues.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
              {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
            </div>
            <div>
              <label htmlFor="postal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal Code</label>
              <input
                type="text"
                id="postal"
                value={formValues.postal}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
              {formErrors.postal && <p className="text-red-500 text-sm mt-1">{formErrors.postal}</p>}
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-semibold">
                <p>Total</p>
                <p>₹{totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            onClick={handleSubmit}
            type="button"
          >
            <DynamicIcon name="cart" size="sm" className="mr-2" withHoverEffect={false} color="#ffffff" />
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;