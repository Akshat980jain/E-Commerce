import React from 'react';
import { Order } from '../../types';
import { getStatusColor } from '../../services/orderService';

interface StatusBadgeProps {
  status: Order['status'];
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusColors = getStatusColor(status);
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} text-sm px-3 py-1 rounded-full border ${className}`}>
      {displayStatus}
    </span>
  );
};

export default StatusBadge; 