'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, MapPin, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/currency';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image?: string;
  };
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  orderStatus: string;
  pricing: {
    itemsTotal: number;
    shippingCharges: number;
    tax: number;
    totalAmount: number;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentInfo: {
    method: string;
    status: string;
  };
  createdAt: string;
  deliveryDate?: string;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default function OrdersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.getOrders();
      
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/profile')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="p-6">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(order.pricing.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-700">Shipping Address</h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      <p>PIN: {order.shippingAddress.pincode}</p>
                      <p>Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-700">Payment</h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Method: <span className="capitalize">{order.paymentInfo.method}</span></p>
                      <p>Status: <span className="capitalize">{order.paymentInfo.status}</span></p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Items Total</span>
                      <span>{formatPrice(order.pricing.itemsTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping Charges</span>
                      <span>{formatPrice(order.pricing.shippingCharges)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (GST)</span>
                      <span>{formatPrice(order.pricing.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(order.pricing.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Date */}
                {order.deliveryDate && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                    <strong>Delivered on:</strong> {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
