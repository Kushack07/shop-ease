import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, Phone, Calendar, Truck, ArrowLeft } from 'lucide-react';
import { Order } from '@/types';
import { api } from '@/utils/api';
import { apiHelper } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      // Fallback to mock data
      setOrder(getMockOrder());
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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Order not found</h2>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/orders" className="inline-flex items-center text-secondary-600 hover:text-secondary-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Order #{order.id}
              </h1>
              <p className="text-secondary-600">
                Placed on {apiHelper.formatDate(order.createdAt)}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg">
                      <div className="w-16 h-16 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-secondary-900">{item.product.name}</h4>
                        <p className="text-sm text-secondary-600">{item.product.brand}</p>
                        <p className="text-sm text-secondary-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-secondary-900">
                          {apiHelper.formatCurrency(item.price)}
                        </div>
                        <div className="text-sm text-secondary-600">
                          Total: {apiHelper.formatCurrency(item.total)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </div>
                  <div className="text-secondary-600">{order.shippingAddress.address}</div>
                  <div className="text-secondary-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </div>
                  <div className="text-secondary-600">{order.shippingAddress.country}</div>
                  <div className="flex items-center space-x-2 text-secondary-600">
                    <Phone className="h-4 w-4" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Tracking Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Tracking Number
                      </label>
                      <div className="font-mono bg-secondary-100 px-3 py-2 rounded-lg">
                        {order.trackingNumber}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <Calendar className="h-4 w-4" />
                      <span>Last updated: {apiHelper.formatDate(order.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Subtotal</span>
                    <span className="font-medium">{apiHelper.formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Shipping</span>
                    <span className="font-medium">
                      {order.shipping === 0 ? 'Free' : apiHelper.formatCurrency(order.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Tax</span>
                    <span className="font-medium">{apiHelper.formatCurrency(order.tax)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -{apiHelper.formatCurrency(order.discount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-secondary-200 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{apiHelper.formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-secondary-200 pt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Payment Method
                    </label>
                    <div className="text-sm text-secondary-900">{order.paymentMethod}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Payment Status
                    </label>
                    <div className="text-sm text-secondary-900 capitalize">{order.paymentStatus}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Order Status
                    </label>
                    <div className="text-sm text-secondary-900 capitalize">{order.status}</div>
                  </div>
                </div>

                {order.notes && (
                  <div className="border-t border-secondary-200 pt-4">
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Order Notes
                    </label>
                    <div className="text-sm text-secondary-600 bg-secondary-50 p-3 rounded-lg">
                      {order.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for development
const getMockOrder = (): Order => ({
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
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'],
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
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'],
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
  notes: 'Please deliver during business hours.',
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
});

export default OrderDetail;
