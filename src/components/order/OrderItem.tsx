import React from 'react';
import { OrderItem as OrderItemType } from '../../types';
import { formatCurrency } from '../../services/orderService';
import DynamicIcon from '../common/DynamicIcon';

interface OrderItemProps {
  item: OrderItemType;
  onRemove?: (itemId: string) => void;
  showRemoveButton?: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({ 
  item, 
  onRemove,
  showRemoveButton = false
}) => {
  const discountedPrice = item.price * (1 - item.discount / 100);
  const totalPrice = discountedPrice * item.quantity;

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <div className="w-full sm:w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <h5 className="font-medium text-gray-800 dark:text-white">
            {item.name}
          </h5>
          
          {showRemoveButton && (
            <button 
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 transition-colors p-1"
              aria-label="Remove item"
              title="Remove from order"
            >
              <DynamicIcon name="close" size="sm" />
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {item.description.substring(0, 100)}{item.description.length > 100 ? '...' : ''}
        </div>
        
        <div className="flex justify-between mt-2">
          <div className="text-gray-700 dark:text-gray-300">
            Quantity: {item.quantity}
          </div>
          <div>
            <div className="font-medium text-gray-800 dark:text-white text-right">
              {item.discount > 0 ? (
                <span>
                  <span className="line-through text-gray-400 mr-2">
                    {formatCurrency(item.price)}
                  </span>
                  {formatCurrency(discountedPrice)}
                </span>
              ) : (
                formatCurrency(item.price)
              )}
            </div>
            {item.quantity > 1 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                Total: {formatCurrency(totalPrice)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem; 