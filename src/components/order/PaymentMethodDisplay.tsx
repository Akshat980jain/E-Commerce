import React from 'react';
import DynamicIcon from '../common/DynamicIcon';

interface PaymentMethodDisplayProps {
  method: string;
  className?: string;
}

const PaymentMethodDisplay: React.FC<PaymentMethodDisplayProps> = ({ method, className = '' }) => {
  // Get payment method icon and name
  const getPaymentMethodDetails = (method: string) => {
    switch (method) {
      case 'credit_card': 
        return {
          icon: <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Card" className="h-5 w-auto inline-block mr-2" />,
          name: 'Credit/Debit Card'
        };
      case 'paypal': 
        return {
          icon: <img src="https://cdn-icons-png.flaticon.com/128/196/196565.png" alt="PayPal" className="h-5 w-auto inline-block mr-2" />,
          name: 'PayPal'
        };
      case 'upi': 
        return {
          icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-4 w-auto inline-block mr-2" />,
          name: 'UPI Payment'
        };
      case 'cod': 
        return {
          icon: <DynamicIcon name="box" size="sm" className="mr-2 inline-block" />,
          name: 'Cash on Delivery'
        };
      default: 
        return {
          icon: null,
          name: 'Online Payment'
        };
    }
  };

  const { icon, name } = getPaymentMethodDetails(method);

  return (
    <div className={`flex items-center ${className}`}>
      {icon}
      <span>{name}</span>
    </div>
  );
};

export default PaymentMethodDisplay; 