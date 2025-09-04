import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    sales: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, you would fetch this from your API
      // For now, using mock data
      setStats({
        users: 1247,
        products: 89,
        orders: 156,
        sales: 23450.67,
      });
      setRecentOrders([
        { id: '1', customer: 'John Doe', amount: 159.97, status: 'delivered' },
        { id: '2', customer: 'Jane Smith', amount: 89.99, status: 'shipped' },
        { id: '3', customer: 'Bob Johnson', amount: 234.50, status: 'processing' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-secondary-600">
            Overview of your e-commerce platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-secondary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.toLocaleString()}</div>
              <p className="text-xs text-secondary-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-secondary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
              <p className="text-xs text-secondary-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +5 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-secondary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
              <p className="text-xs text-secondary-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-secondary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.sales.toLocaleString()}</div>
              <p className="text-xs text-secondary-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                    <div>
                      <div className="font-medium text-secondary-900">Order #{order.id}</div>
                      <div className="text-sm text-secondary-600">{order.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-secondary-900">${order.amount}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
                  <div className="font-medium text-secondary-900">Add New Product</div>
                  <div className="text-sm text-secondary-600">Create a new product listing</div>
                </button>
                <button className="w-full text-left p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
                  <div className="font-medium text-secondary-900">View All Orders</div>
                  <div className="text-sm text-secondary-600">Manage customer orders</div>
                </button>
                <button className="w-full text-left p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
                  <div className="font-medium text-secondary-900">User Management</div>
                  <div className="text-sm text-secondary-600">Manage user accounts</div>
                </button>
                <button className="w-full text-left p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
                  <div className="font-medium text-secondary-900">Analytics Report</div>
                  <div className="text-sm text-secondary-600">View detailed analytics</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
