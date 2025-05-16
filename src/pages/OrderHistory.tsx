import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  getUserOrders, 
  formatDate, 
  removeItemFromOrder, 
  clearOrderHistory 
} from '../services/orderService';
import { Order } from '../types';
import OrderItem from '../components/order/OrderItem';
import OrderSummary from '../components/order/OrderSummary';
import StatusBadge from '../components/order/StatusBadge';
import ShippingAddressDisplay from '../components/order/ShippingAddressDisplay';
import DynamicIcon from '../components/common/DynamicIcon';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [removeConfirmation, setRemoveConfirmation] = useState<{ orderId: string; itemId: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clearConfirmation, setClearConfirmation] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);

  const loadOrders = () => {
    if (user) {
      setIsLoading(true);
      try {
        const userOrders = getUserOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  // Toggle order details expansion
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Handle remove item confirmation
  const handleRemoveItem = (orderId: string, itemId: string) => {
    setRemoveConfirmation({ orderId, itemId });
  };

  // Confirm remove item
  const confirmRemoveItem = () => {
    if (!removeConfirmation || !user) return;
    
    setIsRemoving(true);
    
    const { orderId, itemId } = removeConfirmation;
    
    // Remove the item from the order and update localStorage
    const updatedOrder = removeItemFromOrder(orderId, itemId, user.id);
    
    if (updatedOrder) {
      // Update the orders state by replacing the modified order
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      // If order has no more items, close the expanded details
      if (updatedOrder.items.length === 0 && expandedOrder === orderId) {
        setExpandedOrder(null);
      }
    }
    
    setIsRemoving(false);
    setRemoveConfirmation(null);
  };

  // Cancel remove item
  const cancelRemoveItem = () => {
    setRemoveConfirmation(null);
  };

  // Handle clear history confirmation
  const handleClearHistory = () => {
    setClearConfirmation(true);
  };

  // Confirm clear history
  const confirmClearHistory = () => {
    if (!user) return;
    
    setIsClearing(true);
    
    try {
      clearOrderHistory(user.id);
      setOrders([]);
      setExpandedOrder(null);
    } catch (error) {
      console.error('Failed to clear order history:', error);
    } finally {
      setIsClearing(false);
      setClearConfirmation(false);
    }
  };

  // Cancel clear history
  const cancelClearHistory = () => {
    setClearConfirmation(false);
  };

  // Filter orders to show only those with items, or show a message if none
  const ordersWithItems = orders.filter(order => order.items.length > 0);
  const hasEmptyOrders = orders.length > 0 && ordersWithItems.length < orders.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Order History</h1>
        {user && (
          <div className="mt-2 md:mt-0 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
            <span>Showing orders for </span>
            <span className="font-medium text-gray-700 dark:text-gray-200">{user.name} ({user.email})</span>
          </div>
        )}
      </div>

      {!user ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Please log in to view your order history.</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 flex justify-center items-center">
            <div className="h-6 w-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400">You have no orders yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Remove Item Confirmation Modal */}
          {removeConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Remove Item
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to remove this item from your order? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelRemoveItem}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    disabled={isRemoving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRemoveItem}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Removing...
                      </>
                    ) : (
                      'Remove'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clear History Confirmation Modal */}
          {clearConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Clear Order History
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to clear your entire order history? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelClearHistory}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    disabled={isClearing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClearHistory}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                    disabled={isClearing}
                  >
                    {isClearing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Clearing History...
                      </>
                    ) : (
                      'Clear History'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {ordersWithItems.length} {ordersWithItems.length === 1 ? 'order' : 'orders'} found
            </div>
            <button
              onClick={handleClearHistory}
              className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md text-sm transition-colors flex items-center"
              disabled={isLoading || orders.length === 0}
            >
              <DynamicIcon name="close" size="sm" className="mr-1" />
              Clear History
            </button>
          </div>

          {hasEmptyOrders && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 mb-2">
              <div className="flex">
                <DynamicIcon name="notification" size="md" className="text-amber-500 mr-3 flex-shrink-0" />
                <p className="text-amber-700 dark:text-amber-400">
                  Some orders have been hidden because all items were removed.
                </p>
              </div>
            </div>
          )}

          {ordersWithItems.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400">All items have been removed from your orders.</p>
              </div>
            </div>
          ) : (
            ordersWithItems.map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {/* Order header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Order #{order.id.substring(4)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                
                {/* Order summary */}
                <OrderSummary 
                  order={order} 
                  isExpanded={expandedOrder === order.id}
                  onToggleExpand={() => toggleOrderDetails(order.id)}
                />
                
                {/* Order details (expanded) */}
                {expandedOrder === order.id && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                      Purchased Products
                    </h4>
                    
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <OrderItem 
                          key={`${item.id}-${index}`}
                          item={item} 
                          showRemoveButton={order.status === 'pending' || order.status === 'processing'}
                          onRemove={(itemId) => handleRemoveItem(order.id, itemId)}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md">
                      <ShippingAddressDisplay address={order.shippingAddress} />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;