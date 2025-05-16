import React from 'react';
import { Address } from '../../types';

interface ShippingAddressDisplayProps {
  address: Address;
  className?: string;
}

const ShippingAddressDisplay: React.FC<ShippingAddressDisplayProps> = ({ 
  address,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <h4 className="font-medium text-gray-800 dark:text-white mb-2">
        Shipping Address
      </h4>
      <div className="text-gray-700 dark:text-gray-300">
        <p>{address.firstName} {address.lastName}</p>
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
        <p>Phone: {address.phone}</p>
      </div>
    </div>
  );
};

export default ShippingAddressDisplay; 