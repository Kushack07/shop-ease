import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Calendar, DollarSign } from 'lucide-react';
import { Order } from '@/types';
import { api } from '@/utils/api';
import { apiHelper } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to mock data
      setOrders(getMockOrders());
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'processing':
        return '⚙️';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
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
            My Orders
          </h1>
          <p className="text-secondary-600">
            Track your orders and view order history
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              No orders yet
            </h2>
            <p className="text-secondary-600 mb-8">
              Start shopping to see your orders here
            </p>
            <Link to="/products">
              <Button>
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-primary-600" />
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{apiHelper.formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{apiHelper.formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <Link to={`/order/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items Preview */}
                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-secondary-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-secondary-600">
                            Qty: {item.quantity} • {apiHelper.formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-secondary-900">
                            {apiHelper.formatCurrency(item.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-center py-2 text-sm text-secondary-600">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-secondary-200 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-secondary-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.paymentStatus}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-secondary-900">
                          Total: {apiHelper.formatCurrency(order.total)}
                        </div>
                        {order.trackingNumber && (
                          <div className="text-sm text-secondary-600">
                            Tracking: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data for development
const getMockOrders = (): Order[] => [
  {
    id: '1',
    userId: '1',
    user: {
      id: '1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    items: [
      {
        id: '1',
        productId: '1',
        product: {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          description: 'High-quality wireless headphones',
          price: 99.99,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'],
          category: 'Electronics',
          brand: 'TechPro',
          rating: 4.5,
          reviewCount: 128,
          stock: 50,
          sku: 'TEC-001',
          tags: ['wireless', 'bluetooth'],
          specifications: {},
          isActive: true,
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 1,
        price: 99.99,
        total: 99.99,
      },
      {
        id: '2',
        productId: '2',
        product: {
          id: '2',
          name: 'Organic Cotton T-Shirt',
          description: 'Comfortable cotton t-shirt',
          price: 29.99,
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'],
          category: 'Fashion',
          brand: 'EcoWear',
          rating: 4.2,
          reviewCount: 89,
          stock: 100,
          sku: 'FAS-002',
          tags: ['organic', 'cotton'],
          specifications: {},
          isActive: true,
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 2,
        price: 29.99,
        total: 59.98,
      },
    ],
    total: 159.97,
    subtotal: 159.97,
    tax: 12.80,
    shipping: 0,
    discount: 0,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1-555-123-4567',
    },
    trackingNumber: 'TRK123456789',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    user: {
      id: '1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    items: [
      {
        id: '3',
        productId: '3',
        product: {
          id: '3',
          name: 'Smart Fitness Watch',
          description: 'Advanced fitness tracking',
          price: 199.99,
          images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'],
          category: 'Electronics',
          brand: 'FitTech',
          rating: 4.7,
          reviewCount: 256,
          stock: 30,
          sku: 'TEC-003',
          tags: ['smartwatch', 'fitness'],
          specifications: {},
          isActive: true,
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 1,
        price: 199.99,
        total: 199.99,
      },
    ],
    total: 199.99,
    subtotal: 199.99,
    tax: 16.00,
    shipping: 0,
    discount: 0,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1-555-123-4567',
    },
    trackingNumber: 'TRK987654321',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default Orders;
