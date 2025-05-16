import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DynamicIcon from '../common/DynamicIcon';

interface LocationState {
  shippingInfo?: {
    name: string;
    address: string;
    city: string;
    postal: string;
  };
  paymentInfo?: {
    paymentMethod: string;
  };
}

interface PaymentSuccessProps {
  orderId: string;
  amount: number;
  transactionId: string;
  paymentMethod?: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ 
  orderId,
  amount,
  transactionId,
  paymentMethod
}) => {
  const location = useLocation();
  const locationState = location.state as LocationState | undefined;
  const shippingInfo = locationState?.shippingInfo;
  
  // Get payment method from props or location state
  const actualPaymentMethod = paymentMethod || locationState?.paymentInfo?.paymentMethod || 'card';
  
  // Display name for payment method
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'upi': return 'UPI Payment';
      case 'cod': return 'Cash on Delivery';
      default: return 'Online Payment';
    }
  };

  // Icon for payment method
  const getPaymentMethodIcon = () => {
    switch (actualPaymentMethod) {
      case 'card': 
        return <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Card" className="h-5 w-auto inline-block mr-2" />;
      case 'upi': 
        return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-4 w-auto inline-block mr-2" />;
      case 'cod': 
        return <DynamicIcon name="box" size="sm" className="mr-2 inline-block" />;
      default: 
        return null;
    }
  };
  
  // Format amount for display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100);
  
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mb-6">
        <div className="text-center mb-6">
          <div className="mx-auto rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mb-4">
            <DynamicIcon name="cart" size="lg" color="#10b981" animate="pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {actualPaymentMethod === 'cod' ? 'Order Placed!' : 'Payment Successful!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {actualPaymentMethod === 'cod' 
              ? 'Your order has been placed and will be delivered soon.' 
              : 'Your payment has been processed and your order is confirmed.'}
          </p>
        </div>
        
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400">Order ID</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400">Amount</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{formattedAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
            <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
              {getPaymentMethodIcon()}
              {getPaymentMethodDisplay(actualPaymentMethod)}
            </span>
          </div>
        </div>
        
        {shippingInfo && (
          <div className="border-b border-gray-200 dark:border-gray-700 py-4 mb-4">
            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">Shipping Information</h3>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500 dark:text-gray-400">Name</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{shippingInfo.name}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500 dark:text-gray-400">Address</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{shippingInfo.address}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500 dark:text-gray-400">City</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{shippingInfo.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Postal Code</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{shippingInfo.postal}</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <Link 
            to="/orders" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-center font-medium transition-colors flex items-center justify-center"
          >
            <DynamicIcon name="box" size="sm" color="#ffffff" className="mr-2" withHoverEffect={false} />
            View Your Orders
          </Link>
          <Link 
            to="/products" 
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-md text-center font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Need help? <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact our support team</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 