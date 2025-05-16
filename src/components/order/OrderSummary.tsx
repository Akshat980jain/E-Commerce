import React from 'react';
import { Order } from '../../types';
import { formatCurrency } from '../../services/orderService';
import PaymentMethodDisplay from './PaymentMethodDisplay';
import DynamicIcon from '../common/DynamicIcon';

interface OrderSummaryProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  order, 
  isExpanded, 
  onToggleExpand 
}) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasItems = order.items.length > 0;
  
  return (
    <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
      <div className="mb-3 md:mb-0">
        {hasItems ? (
          <>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Items: {totalItems}
            </div>
            <div className="text-gray-800 dark:text-white font-medium">
              Total: {formatCurrency(order.totalAmount)}
            </div>
          </>
        ) : (
          <div className="text-amber-600 dark:text-amber-400 font-medium flex items-center">
            <DynamicIcon name="notification" size="sm" className="mr-2" />
            All items removed from order
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="text-gray-700 dark:text-gray-300 flex items-center">
          <span className="mr-2">Payment:</span>
          <PaymentMethodDisplay method={order.paymentMethod} />
        </div>
        
        {hasItems && (
          <button 
            onClick={onToggleExpand}
            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-md flex items-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
            <DynamicIcon 
              name={isExpanded ? "up" : "down"} 
              size="sm" 
              className="ml-1" 
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary; 