import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentSuccess from '../components/payment/PaymentSuccess';

interface LocationState {
  paymentInfo?: {
    orderId: string;
    transactionId: string;
    amount: number;
    paymentMethod: string;
  };
  shippingInfo?: {
    name: string;
    address: string;
    city: string;
    postal: string;
  };
}

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  useEffect(() => {
    // If accessed directly without proper state, redirect to home
    if (!state?.paymentInfo) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state?.paymentInfo) {
    return null;
  }

  return (
    <PaymentSuccess
      orderId={state.paymentInfo.orderId}
      amount={state.paymentInfo.amount}
      transactionId={state.paymentInfo.transactionId}
      paymentMethod={state.paymentInfo.paymentMethod}
    />
  );
};

export default PaymentSuccessPage; 