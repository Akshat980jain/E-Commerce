import React from 'react';
import { BarChart3, Users, Package } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <p className="text-2xl font-bold">$12,345</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Products</h3>
              <p className="text-2xl font-bold">567</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600">New order #1234 - $123.45</p>
            <p className="text-sm text-gray-500">2 minutes ago</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-600">User John Doe registered</p>
            <p className="text-sm text-gray-500">15 minutes ago</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-600">Product "Gaming Mouse" updated</p>
            <p className="text-sm text-gray-500">1 hour ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;