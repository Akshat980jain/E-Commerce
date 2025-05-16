import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import PaymentForm from '../components/payment/PaymentForm';
import DynamicIcon from '../components/common/DynamicIcon';
import { processUpiPayment, processCodOrder } from '../services/stripeService';

interface LocationState {
  fromCheckout: boolean;
  shippingInfo: {
    name: string;
    address: string;
    city: string;
    postal: string;
  };
}

type PaymentMethod = 'card' | 'cod' | 'upi';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed' | 'cancelled'>('pending');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [upiId, setUpiId] = useState('');
  const [upiIdError, setUpiIdError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    orderId: string;
    transactionId: string;
    paymentMethod: string;
    amount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to keep track of current payment process
  const cancelTokenRef = useRef<{ isCancelled: boolean }>({ isCancelled: false });
  
  // Get shipping info from location state
  const locationState = location.state as LocationState | undefined;
  const shippingInfo = locationState?.shippingInfo;

  // Redirect if no items in cart or directly accessing the page
  React.useEffect(() => {
    if ((!cartItems.length && !locationState?.fromCheckout) || !locationState?.shippingInfo) {
      navigate('/checkout');
    }
  }, [cartItems, navigate, locationState]);

  // Convert total price to cents for Stripe
  const amountInCents = Math.round(totalPrice * 100);

  const handlePaymentSuccess = (info: {
    orderId: string;
    transactionId: string;
    paymentMethod: string;
    amount: number;
  }) => {
    if (cancelTokenRef.current.isCancelled) return;
    
    setPaymentInfo(info);
    setPaymentStatus('success');
    clearCart(); // Clear the cart after successful payment
  };

  const handlePaymentError = (errorMessage: string) => {
    if (cancelTokenRef.current.isCancelled) return;
    
    setError(errorMessage);
    setPaymentStatus('failed');
  };

  const handleCancelPayment = () => {
    // Mark current payment process as cancelled
    cancelTokenRef.current.isCancelled = true;
    
    // Update UI state
    setPaymentStatus('cancelled');
    setError('Payment cancelled by user.');
    
    // Reset cancel token for future payments
    setTimeout(() => {
      cancelTokenRef.current = { isCancelled: false };
      setPaymentStatus('pending');
    }, 1000);
  };

  const validateUpiId = (id: string) => {
    // Basic UPI ID validation (username@provider)
    const upiRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+$/;
    return upiRegex.test(id);
  };

  const handleUpiPayment = () => {
    if (!upiId) {
      setUpiIdError('UPI ID is required');
      return;
    }

    if (!validateUpiId(upiId)) {
      setUpiIdError('Invalid UPI ID format. Example: username@ybl');
      return;
    }

    setUpiIdError(null);
    setError(null);
    
    // Reset cancel token for new payment attempt
    cancelTokenRef.current = { isCancelled: false };
    
    // Generate mock order data
    const orderId = `order_${Math.random().toString(36).substring(2)}`;
    
    // Set UI to processing state
    setPaymentStatus('processing');
    
    processUpiPayment(upiId, amountInCents, orderId)
      .then(result => {
        if (cancelTokenRef.current.isCancelled) return;
        
        handlePaymentSuccess({
          orderId: result.orderId,
          transactionId: result.transactionId,
          paymentMethod: 'upi',
          amount: amountInCents
        });
      })
      .catch(err => {
        if (cancelTokenRef.current.isCancelled) return;
        
        handlePaymentError(err.message);
      });
  };

  const handleCodPayment = () => {
    if (!shippingInfo) {
      handlePaymentError('Shipping information is required for Cash on Delivery');
      return;
    }
    
    // Reset cancel token for new payment attempt
    cancelTokenRef.current = { isCancelled: false };
    
    // Generate mock order data
    const orderId = `order_${Math.random().toString(36).substring(2)}`;
    
    // Set UI to processing state
    setPaymentStatus('processing');
    setError(null);
    
    processCodOrder(orderId, amountInCents, shippingInfo)
      .then(result => {
        if (cancelTokenRef.current.isCancelled) return;
        
        handlePaymentSuccess({
          orderId: result.orderId,
          transactionId: result.transactionId,
          paymentMethod: 'cod',
          amount: amountInCents
        });
      })
      .catch(err => {
        if (cancelTokenRef.current.isCancelled) return;
        
        handlePaymentError(err?.message || 'Failed to process your order. Please try again.');
      });
  };

  if (paymentStatus === 'success' && paymentInfo) {
    // Navigate to success page with both payment and shipping info
    navigate('/payment/success', { 
      state: { 
        paymentInfo,
        shippingInfo 
      },
      replace: true // Replace current history so users can't go back to payment page
    });
    
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <DynamicIcon name="cart" size="md" className="mr-3" />
        Complete Your Purchase
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          {shippingInfo && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="font-medium">{shippingInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Address:</span>
                <span className="font-medium">{shippingInfo.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">City:</span>
                <span className="font-medium">{shippingInfo.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Postal Code:</span>
                <span className="font-medium">{shippingInfo.postal}</span>
              </div>
            </div>
          )}
        </div>
      
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
              <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        
        {/* Payment method selection tabs - disabled during processing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setPaymentMethod('card')}
            disabled={paymentStatus === 'processing'}
            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors
              ${paymentMethod === 'card' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
              ${paymentStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <DynamicIcon name="cart" size="md" color={paymentMethod === 'card' ? '#3b82f6' : undefined} className="mb-2" />
            <span className={paymentMethod === 'card' ? 'font-medium text-blue-600 dark:text-blue-400' : ''}>
              Credit/Debit Card
            </span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('upi')}
            disabled={paymentStatus === 'processing'}
            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors
              ${paymentMethod === 'upi' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
              ${paymentStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" 
                 alt="UPI" 
                 className="h-6 mb-2" />
            <span className={paymentMethod === 'upi' ? 'font-medium text-blue-600 dark:text-blue-400' : ''}>
              UPI Payment
            </span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('cod')}
            disabled={paymentStatus === 'processing'}
            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors
              ${paymentMethod === 'cod' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
              ${paymentStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <DynamicIcon name="box" size="md" color={paymentMethod === 'cod' ? '#3b82f6' : undefined} className="mb-2" />
            <span className={paymentMethod === 'cod' ? 'font-medium text-blue-600 dark:text-blue-400' : ''}>
              Cash on Delivery
            </span>
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
            <div className="flex items-start">
              <DynamicIcon name="close" size="sm" className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{paymentStatus === 'cancelled' ? 'Payment Cancelled' : 'Payment Error'}</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {paymentStatus === 'processing' && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <div className="mr-3 h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Processing your payment...</span>
              </div>
              <button 
                onClick={handleCancelPayment}
                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {paymentMethod === 'card' && (
          <PaymentForm 
            amount={amountInCents}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            disabled={paymentStatus === 'processing'}
            onSubmitStarted={() => setPaymentStatus('processing')}
            onCancelPayment={handleCancelPayment}
          />
        )}
        
        {paymentMethod === 'upi' && (
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@upi"
                className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-800 dark:text-white"
                disabled={paymentStatus === 'processing'}
              />
              {upiIdError && (
                <p className="text-red-500 text-sm mt-1">{upiIdError}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Enter your UPI ID (e.g., username@oksbi, username@ybl)
              </p>
            </div>
            
            <button
              onClick={handleUpiPayment}
              disabled={paymentStatus === 'processing'}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium
                      transition-colors flex items-center justify-center
                      ${paymentStatus === 'processing' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              Pay with UPI
            </button>
          </div>
        )}
        
        {paymentMethod === 'cod' && (
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-4">
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Cash on Delivery Information</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>Pay in cash at the time of delivery</li>
                <li>Please have the exact amount ready for the delivery person</li>
                <li>Delivery time: 3-5 business days</li>
                <li>COD charge: Free</li>
              </ul>
            </div>
            
            <button
              onClick={handleCodPayment}
              disabled={paymentStatus === 'processing'}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium
                      transition-colors flex items-center justify-center
                      ${paymentStatus === 'processing' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              Place Order (COD)
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <button 
          onClick={() => navigate('/checkout')}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          disabled={paymentStatus === 'processing'}
        >
          Return to checkout
        </button>
      </div>
    </div>
  );
};

export default Payment; 