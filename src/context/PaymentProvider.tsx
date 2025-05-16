import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../services/stripeService';

interface PaymentProviderProps {
  children: React.ReactNode;
}

const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  return (
    <Elements stripe={getStripe()}>
      {children}
    </Elements>
  );
};

export default PaymentProvider; 