import React, { useState, useEffect } from 'react';
import { 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { createPaymentIntent, processPayment } from '../../services/stripeService';
import DynamicIcon from '../common/DynamicIcon';
import { useTheme } from '../../context/ThemeContext';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentInfo: {
    orderId: string;
    transactionId: string;
    paymentMethod: string;
    amount: number;
  }) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  onSubmitStarted?: () => void;
  onCancelPayment?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  onSuccess, 
  onError,
  disabled = false,
  onSubmitStarted,
  onCancelPayment
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  // Format amount for display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100);

  // Create a payment intent when the component mounts
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        // In a real app, this would call your backend API
        await createPaymentIntent(amount);
        // Payment intent created successfully
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(errorMessage);
        onError(errorMessage);
      }
    };

    if (amount > 0) {
      fetchPaymentIntent();
    }
  }, [amount, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setProcessing(true);
    setError(null);
    
    // Notify parent component that payment processing has started
    if (onSubmitStarted) {
      onSubmitStarted();
    }

    try {
      // Create a payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      if (!paymentMethod) {
        throw new Error('Payment failed. Please try again.');
      }

      // Generate a mock order ID
      const orderId = `order_${Math.random().toString(36).substring(2)}`;

      // Process the payment
      const result = await processPayment(
        paymentMethod.id,
        amount,
        orderId
      );

      // Handle successful payment
      onSuccess({
        orderId: result.orderId,
        transactionId: result.transactionId,
        paymentMethod: 'card',
        amount
      });

      // Clear the form
      cardElement.clear();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // Style for the card element
  const cardStyle = {
    style: {
      base: {
        color: theme === 'dark' ? '#e2e8f0' : '#4b5563',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: theme === 'dark' ? '#94a3b8' : '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Payment Details</h2>
          <div className="text-blue-600 dark:text-blue-400 font-semibold">{formattedAmount}</div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Card Information
            </label>
            <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-white dark:bg-gray-700">
              <CardElement options={cardStyle} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Test card: 4242 4242 4242 4242 - Exp: Any future date - CVC: Any 3 digits
            </p>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={() => setSaveCard(!saveCard)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                disabled={disabled}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Save card for future payments
              </span>
            </label>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm flex items-start">
              <DynamicIcon name="close" size="sm" className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              disabled={!stripe || processing || disabled}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium
                     transition-colors flex items-center justify-center space-x-2
                     ${(processing || disabled) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {processing ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DynamicIcon name="cart" size="sm" color="#ffffff" withHoverEffect={false} />
                  <span>Pay {formattedAmount}</span>
                </>
              )}
            </button>
            
            {processing && onCancelPayment && (
              <button
                type="button"
                onClick={onCancelPayment}
                className="w-full py-2 px-4 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                Cancel Payment
              </button>
            )}
          </div>
        </form>
        
        <div className="mt-4 flex items-center justify-center space-x-4">
          <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-8" />
          <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="Mastercard" className="h-8" />
          <img src="https://cdn-icons-png.flaticon.com/128/196/196539.png" alt="American Express" className="h-8" />
          <img src="https://cdn-icons-png.flaticon.com/128/196/196566.png" alt="Discover" className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 