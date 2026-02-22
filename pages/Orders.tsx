import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { ShoppingBag, Package, Truck, CheckCircle2, AlertCircle, ExternalLink, Clock, MapPin, Loader2, Printer } from 'lucide-react';
import { Button } from '../components/Button';
import { orderService, Order } from '../services/orderService';

export const Orders: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders(pagination.page, pagination.limit);

        // Check if response has the new paginated structure
        if (response.data && 'orders' in response.data && 'pagination' in response.data) {
          setOrders(response.data.orders);
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages
          }));
        } else {
          // Fallback for non-paginated response if any
          const ordersData = Array.isArray(response) ? response : (response.data || []);
          setOrders(ordersData as Order[]);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, pagination.page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
         <title>Invoice - ${order.orderId}</title>
         <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #8B4513; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #8B4513; margin: 0; font-size: 32px; }
            .header p { color: #666; margin: 5px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
            .info-box h3 { color: #8B4513; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; }
            .info-box p { margin: 5px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f5f5f5; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .total-row { background: #f9f9f9; font-weight: bold; }
            .total-amount { color: #8B4513; font-size: 18px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
            @media print { body { print-color-adjust: exact; } }
         </style>
      </head>
      <body>
         <div class="header">
            <h1>KC Nuts</h1>
            <p>Premium Dry Fruits & Nuts</p>
            <p style="font-size: 12px; color: #999;">Invoice</p>
         </div>
         <div class="info-grid">
            <div class="info-box">
               <h3>Order Details</h3>
               <p><strong>Order ID:</strong> ${order.orderId}</p>
               <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
               <p><strong>Payment:</strong> ${order.paymentInfo?.status === 'success' ? 'Paid' : 'Pending'}</p>
            </div>
            <div class="info-box">
               <h3>Shipping Address</h3>
               <p><strong>${user?.name || 'Customer'}</strong></p>
               <p>${order.shippingAddress?.street || ''}</p>
               <p>${order.shippingAddress?.city}, ${order.shippingAddress?.state}</p>
               <p>${order.shippingAddress?.zip}</p>
            </div>
         </div>
         <table>
            <thead>
               <tr>
                  <th>Item</th>
                  <th>Weight</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th style="text-align: right;">Total</th>
               </tr>
            </thead>
            <tbody>
               ${order.items?.map((item: any) => `
                  <tr>
                     <td>${item.product?.name || item.productName || 'Product'}</td>
                     <td>${item.weight || '-'}</td>
                     <td>${item.quantity}</td>
                     <td>₹${item.price?.toLocaleString('en-IN')}</td>
                     <td style="text-align: right;">₹${(item.price * item.quantity)?.toLocaleString('en-IN')}</td>
                  </tr>
               `).join('') || ''}
               <tr class="total-row">
                  <td colspan="4">Subtotal</td>
                  <td style="text-align: right;">₹${order.totalAmount?.toLocaleString('en-IN')}</td>
               </tr>
               ${order.couponApplied ? `
               <tr>
                  <td colspan="4" style="color: green;">Discount (Code: ${order.couponApplied.code})</td>
                  <td style="text-align: right; color: green;">-₹${(order.totalAmount + (order.shippingFee || 0) - order.finalAmount)?.toLocaleString('en-IN')}</td>
               </tr>` : ''}
               <tr>
                  <td colspan="4">Shipping</td>
                  <td style="text-align: right; ${order.shippingFee === 0 ? 'color: green;' : ''}">${order.shippingFee === 0 ? 'Free' : '₹' + order.shippingFee?.toLocaleString('en-IN')}</td>
               </tr>
               <tr class="total-row">
                  <td colspan="4" class="total-amount">Total Amount</td>
                  <td style="text-align: right;" class="total-amount">₹${order.finalAmount?.toLocaleString('en-IN')}</td>
               </tr>
            </tbody>
         </table>
         <div class="footer">
            <p>Thank you for shopping with KC Nuts!</p>
            <p>For queries, contact us at support@kcnuts.com</p>
         </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-36 pb-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-36 pb-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-36 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <span className="text-brand font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Order History</span>
              <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight">Recent Orders</h1>
              <p className="text-neutral-500 mt-4 text-lg font-light">Showing orders for <span className="text-neutral-900 font-bold">{user?.name}</span></p>
            </div>
            <Link to="/shop">
              <Button variant="outline" size="md" className="shadow-sm">Continue Shopping</Button>
            </Link>
          </div>

          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[40px] border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden hover:shadow-2xl transition-all duration-500 group">

                {/* Order Header */}
                <div className="bg-neutral-50/30 px-6 py-5 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2 w-full md:w-auto">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Placed On</p>
                      <p className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                        <Clock size={14} className="text-neutral-400" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="font-bold text-brand text-sm">₹{order.finalAmount?.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Ship To</p>
                      <p className="font-bold text-neutral-900 text-sm flex items-center gap-2 truncate max-w-[150px]" title={`${order.shippingAddress?.city}, ${order.shippingAddress?.state}`}>
                        <MapPin size={14} className="text-neutral-400" />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                      #{order.orderId.slice(-8).toUpperCase()}
                    </span>

                    <div className="flex items-center gap-2">
                      {order.status === 'delivered' ? (
                        <div className="flex items-center gap-2 bg-success-bg px-3 py-1.5 rounded-full text-success border border-success/10">
                          <CheckCircle2 size={14} className="fill-success text-white" />
                          <span className="font-extrabold uppercase tracking-wider text-[10px]">Delivered</span>
                        </div>
                      ) : order.status === 'cancelled' ? (
                        <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full text-red-600 border border-red-100">
                          <AlertCircle size={14} />
                          <span className="font-extrabold uppercase tracking-wider text-[10px]">Cancelled</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-brand-50 px-3 py-1.5 rounded-full text-brand border border-brand/10">
                          <div className="relative w-2 h-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                          </div>
                          <span className="font-extrabold uppercase tracking-wider text-[10px]">{order.status}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="p-2 bg-white rounded-lg border border-neutral-200 text-neutral-500 hover:text-brand hover:border-brand transition-colors"
                        title="Print Invoice"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="space-y-6">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-neutral-50 pb-6 last:border-none last:pb-0">
                        <div className="flex items-center gap-6 flex-1 w-full">
                          <div className="w-16 h-16 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden flex-shrink-0 group-hover:shadow-md transition-all duration-500">
                            {item.product?.images?.[0] ? (
                              <img src={item.product?.images[0]?.url || item.product?.images[0]} alt={item.product?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                <Package size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-neutral-900 mb-1">{item.product?.name || 'Product'}</h4>
                            <div className="flex flex-wrap gap-2 text-xs text-neutral-500 font-medium">
                              <span className="bg-neutral-100 px-2 py-0.5 rounded">{item.weight}</span>
                              <span className="bg-neutral-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                              <span className="text-neutral-400">•</span>
                              <span>Total: ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {order.shippingInfo && (
                      <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-wrap gap-8 text-sm bg-neutral-50/50 p-4 rounded-2xl">
                        <div>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Courier Partner</p>
                          <p className="font-bold text-neutral-900 flex items-center gap-2"><Truck size={14} className="text-brand" /> {order.shippingInfo.courierName}</p>
                        </div>
                        {order.shippingInfo.trackingId && (
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Tracking ID</p>
                            <p className="font-bold text-brand">{order.shippingInfo.trackingId}</p>
                          </div>
                        )}
                        {order.shippingInfo.etd && (
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                            <p className="font-bold text-neutral-900">{order.shippingInfo.etd}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {!loading && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="text-sm font-bold text-neutral-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[40px] border border-neutral-100 shadow-xl shadow-neutral-100/30">
              <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8 text-neutral-200">
                <ShoppingBag size={48} />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900 mb-3">No orders found</h3>
              <p className="text-neutral-500 mb-12 text-lg font-light">You haven't placed any orders with us yet.</p>
              <Link to="/shop">
                <Button size="lg" className="px-10">Start Your Journey</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};