import { useState, useEffect } from 'react';
import { X, Package, User, MapPin, CreditCard, Calendar, Search, Filter } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Order {
  orderId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  nearestLandmark: string;
  cityTown: string;
  county: string;
  additionalNotes: string;
  cartItems: Array<{
    productId: number;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: string;
    imageUrl: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  cartTotal: number;
  paymentReference: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export function AdminOrdersPage({ onClose }: { onClose: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5cb00c7d/orders`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Sort by most recent first
        const sortedOrders = data.orders.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0A0A0A] via-[#1A0A0A] to-[#0A0A0A] overflow-y-auto">
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl text-[#FFFFF0] mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Order Management
              </h1>
              <p className="text-[#FFFFF0]/60">View and manage all customer orders</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-[#FFFFF0]/5 hover:bg-[#FFFFF0]/10 transition-all group"
            >
              <X className="w-6 h-6 text-[#FFFFF0]/70 group-hover:text-[#FFFFF0]" />
            </button>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FFFFF0]/40" />
                <input
                  type="text"
                  placeholder="Search by order ID, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#FFFFF0]/5 border border-[#FFFFF0]/20 rounded-lg text-[#FFFFF0] placeholder-[#FFFFF0]/40 focus:outline-none focus:border-[#F5F5DC] transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FFFFF0]/40" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#FFFFF0]/5 border border-[#FFFFF0]/20 rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-card rounded-xl p-4">
              <p className="text-[#FFFFF0]/60 text-sm mb-1">Total Orders</p>
              <p className="text-2xl text-[#FFFFF0]">{orders.length}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-[#FFFFF0]/60 text-sm mb-1">Paid Orders</p>
              <p className="text-2xl text-green-400">{orders.filter(o => o.status === 'paid').length}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-[#FFFFF0]/60 text-sm mb-1">Pending Orders</p>
              <p className="text-2xl text-yellow-400">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-[#FFFFF0]/60 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl text-[#F5F5DC]">
                KSh {orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.cartTotal, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#F5F5DC] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#FFFFF0]/60">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchOrders}
                className="px-6 py-2 bg-[#800020] text-[#FFFFF0] rounded-lg hover:bg-[#800020]/80 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 text-[#FFFFF0]/20 mx-auto mb-4" />
              <p className="text-[#FFFFF0]/60">
                {searchTerm || statusFilter !== 'all' ? 'No orders match your filters' : 'No orders yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="glass-card rounded-2xl p-6 hover:bg-[#FFFFF0]/8 transition-all cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-[#FFFFF0] mb-1">{order.orderId}</h3>
                      <p className="text-sm text-[#FFFFF0]/60">
                        {new Date(order.createdAt).toLocaleString('en-KE', { 
                          dateStyle: 'medium', 
                          timeStyle: 'short',
                          timeZone: 'Africa/Nairobi'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-[#FFFFF0]/40" />
                      <div>
                        <p className="text-sm text-[#FFFFF0]/60">Customer</p>
                        <p className="text-[#FFFFF0]">{order.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#FFFFF0]/40" />
                      <div>
                        <p className="text-sm text-[#FFFFF0]/60">Location</p>
                        <p className="text-[#FFFFF0]">{order.cityTown}, {order.county}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-[#FFFFF0]/40" />
                      <div>
                        <p className="text-sm text-[#FFFFF0]/60">Total</p>
                        <p className="text-[#F5F5DC]">KSh {order.cartTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#FFFFF0]/60">
                    <Package className="w-4 h-4" />
                    <span>{order.cartItems.length} item{order.cartItems.length !== 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="glass-card rounded-3xl p-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#FFFFF0]/10 hover:bg-[#FFFFF0]/20 transition-all"
              >
                <X className="w-5 h-5 text-[#FFFFF0]" />
              </button>

              {/* Order Header */}
              <div className="mb-8">
                <h2 className="text-3xl text-[#FFFFF0] mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Order Details
                </h2>
                <div className="flex items-center gap-4">
                  <p className="text-[#FFFFF0]/60">{selectedOrder.orderId}</p>
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-xl text-[#FFFFF0] mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#FFFFF0]/60 mb-1">Name</p>
                    <p className="text-[#FFFFF0]">{selectedOrder.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#FFFFF0]/60 mb-1">Email</p>
                    <p className="text-[#FFFFF0]">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#FFFFF0]/60 mb-1">Phone</p>
                    <p className="text-[#FFFFF0]">{selectedOrder.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#FFFFF0]/60 mb-1">Order Date</p>
                    <p className="text-[#FFFFF0]">
                      {new Date(selectedOrder.createdAt).toLocaleString('en-KE', { 
                        dateStyle: 'long', 
                        timeStyle: 'short',
                        timeZone: 'Africa/Nairobi'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <h3 className="text-xl text-[#FFFFF0] mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Delivery Address
                </h3>
                <div className="bg-[#FFFFF0]/5 rounded-lg p-4">
                  <p className="text-[#FFFFF0] mb-1">{selectedOrder.streetAddress}</p>
                  {selectedOrder.nearestLandmark && selectedOrder.nearestLandmark !== 'N/A' && (
                    <p className="text-[#FFFFF0]/80 mb-1">Near: {selectedOrder.nearestLandmark}</p>
                  )}
                  <p className="text-[#FFFFF0]/80">{selectedOrder.cityTown}, {selectedOrder.county}</p>
                  {selectedOrder.additionalNotes && (
                    <div className="mt-3 pt-3 border-t border-[#FFFFF0]/10">
                      <p className="text-sm text-[#FFFFF0]/60 mb-1">Additional Notes:</p>
                      <p className="text-[#FFFFF0]/80">{selectedOrder.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-xl text-[#FFFFF0] mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.cartItems.map((item, index) => (
                    <div key={index} className="flex gap-4 bg-[#FFFFF0]/5 rounded-lg p-4">
                      <div className="flex-1">
                        <p className="text-[#FFFFF0] mb-2">{item.productName}</p>
                        <div className="flex flex-wrap gap-2 text-sm text-[#FFFFF0]/60">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>Color: {item.color}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#F5F5DC]">{item.unitPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#FFFFF0]/5 rounded-lg p-6">
                <h3 className="text-xl text-[#FFFFF0] mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-[#FFFFF0]/80">
                    <span>Subtotal</span>
                    <span>KSh {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#FFFFF0]/80">
                    <span>Delivery Fee</span>
                    <span>KSh {selectedOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-[#FFFFF0]/10"></div>
                  <div className="flex justify-between text-xl text-[#FFFFF0]">
                    <span>Total</span>
                    <span>KSh {selectedOrder.cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#FFFFF0]/10">
                    <div className="flex justify-between text-sm text-[#FFFFF0]/60">
                      <span>Payment Method</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#FFFFF0]/60 mt-2">
                      <span>Transaction ID</span>
                      <span className="font-mono">{selectedOrder.paymentReference}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
