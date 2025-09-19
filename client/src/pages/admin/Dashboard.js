import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Store, Star } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Stores',
      value: stats.totalStores,
      icon: Store,
      color: 'bg-green-500',
    },
    {
      title: 'Total Ratings',
      value: stats.totalRatings,
      icon: Star,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2 text-gray-500">
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm">System Overview</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-900">User Management</h3>
            <p className="text-sm text-gray-600 mt-1">
              View, add, edit, and delete users. Manage user roles and permissions.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-900">Store Management</h3>
            <p className="text-sm text-gray-600 mt-1">
              View, add, edit, and delete stores. Assign store owners and manage store information.
            </p>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Application Version:</span>
            <span className="ml-2 text-gray-600">1.0.0</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Database Status:</span>
            <span className="ml-2 text-green-600">Connected</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Updated:</span>
            <span className="ml-2 text-gray-600">{new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Environment:</span>
            <span className="ml-2 text-gray-600">Development</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

