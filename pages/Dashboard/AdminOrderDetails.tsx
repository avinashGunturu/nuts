import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
   ArrowLeft,
   Printer,
   Truck,
   CheckCircle2,
   Clock,
   Mail,
   Phone,
   MapPin,
   ChevronRight,
   Package,
   CreditCard,
   MessageCircle,
   AlertCircle,
   Loader2,
   XCircle
} from 'lucide-react';
import { Button } from '../../components/Button';
import { orderService } from '../../services/orderService';

export const AdminOrderDetails: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();

   const [order, setOrder] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [isUpdating, setIsUpdating] = useState(false);
   const [confirmModal, setConfirmModal] = useState<{ open: boolean; status: string; label: string }>({ open: false, status: '', label: '' });

   // Fetch order details
   useEffect(() => {
      const fetchOrder = async () => {
         if (!id) return;

         setLoading(true);
         setError('');
         try {
            const orderData = await orderService.getOrderById(id);
            setOrder(orderData);
         } catch (err: any) {
            setError(err.message || 'Failed to load order');
         } finally {
            setLoading(false);
         }
      };

      fetchOrder();
   }, [id]);

   const openConfirmModal = (status: string, label: string) => {
      if (order.status === status) return; // Don't show modal for current status
      setConfirmModal({ open: true, status, label });
   };

   const handleStatusChange = async () => {
      if (!order) return;

      setIsUpdating(true);
      setConfirmModal({ ...confirmModal, open: false });
      try {
         const updated = await orderService.updateOrderStatus(order._id, confirmModal.status);
         setOrder(updated);
      } catch (err: any) {
         alert('Failed to update status: ' + err.message);
      } finally {
         setIsUpdating(false);
      }
   };

   const handlePrintInvoice = () => {
      const printWindow = window.open('', '_blank');
      if (!printWindow || !order) return;

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
                  <p><strong>${order.user?.name || 'Customer'}</strong></p>
                  <p>${order.shippingAddress?.street || ''}</p>
                  <p>${order.shippingAddress?.city}, ${order.shippingAddress?.state}</p>
                  <p>${order.shippingAddress?.zip}</p>
                  ${order.user?.phone ? `<p>Phone: ${order.user.phone}</p>` : ''}
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
                        <td>${item.productName || 'Product'}</td>
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
                     <td colspan="4" style="color: green;">Discount</td>
                     <td style="text-align: right; color: green;">-₹${(order.totalAmount - order.finalAmount)?.toLocaleString('en-IN')}</td>
                  </tr>` : ''}
                  <tr>
                     <td colspan="4">Shipping</td>
                     <td style="text-align: right; color: green;">Free</td>
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

   const getStatusStyle = (status: string) => {
      switch (status) {
         case 'delivered': return 'bg-success-bg text-success';
         case 'processing': return 'bg-brand-50 text-brand';
         case 'shipped': return 'bg-orange-50 text-orange-600';
         case 'cancelled': return 'bg-neutral-100 text-neutral-400';
         case 'pending': return 'bg-yellow-50 text-yellow-600';
         default: return 'bg-neutral-50 text-neutral-500';
      }
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case 'delivered': return <CheckCircle2 size={18} />;
         case 'processing': return <Clock size={18} />;
         case 'shipped': return <Truck size={18} />;
         case 'pending': return <Clock size={18} />;
         case 'cancelled': return <XCircle size={18} />;
         default: return null;
      }
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('en-IN', {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      });
   };

   const getPaymentStatus = () => {
      if (!order) return { label: 'Unknown', style: 'bg-neutral-100 text-neutral-500' };
      const status = order.paymentInfo?.status || 'pending';
      if (status === 'success' || status === 'paid') return { label: 'Paid', style: 'bg-success-bg text-success' };
      if (status === 'refunded') return { label: 'Refunded', style: 'bg-neutral-100 text-neutral-400' };
      if (status === 'failed') return { label: 'Failed', style: 'bg-error-bg text-error' };
      return { label: 'Pending', style: 'bg-yellow-50 text-yellow-600' };
   };

   // Loading state
   if (loading) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="animate-spin text-brand" size={48} />
         </div>
      );
   }

   // Error state
   if (error || !order) {
      return (
         <div className="flex flex-col items-center justify-center h-96 text-center">
            <AlertCircle size={48} className="text-error mb-4" />
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Order Not Found</h2>
            <p className="text-neutral-500 mb-6">{error || 'Unable to load order details'}</p>
            <Link to="/dashboard/orders">
               <Button variant="outline">Back to Orders</Button>
            </Link>
         </div>
      );
   }

   const subtotal = order.totalAmount || 0;
   const discount = order.couponApplied ? (subtotal - order.finalAmount) : 0;
   const total = order.finalAmount || 0;
   const payment = getPaymentStatus();

   return (
      <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-24">
         {/* Top Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <Link to="/dashboard/orders" className="flex items-center gap-2 text-neutral-400 hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest mb-4">
                  <ArrowLeft size={16} /> Back to Orders
               </Link>
               <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Order #{order.orderId}</h1>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                     {getStatusIcon(order.status)}
                     {order.status}
                  </span>
               </div>
               <p className="text-neutral-500 mt-2 font-medium">{formatDate(order.createdAt)}</p>
            </div>
            {/* <div className="flex items-center gap-4">
               <Button
                  variant="outline"
                  size="md"
                  className="bg-white flex items-center gap-3 px-6 py-2.5 h-auto whitespace-nowrap hover:bg-neutral-50 border-neutral-200"
                  onClick={handlePrintInvoice}
               >
                  <Printer size={18} className="flex-shrink-0" />
                  <span>Print Invoice</span>
               </Button>
            </div> */}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-10">

               {/* Items Summary */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 overflow-hidden">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                     <h3 className="text-xl font-bold text-neutral-900">Order Items</h3>
                     <span className="text-sm font-bold text-neutral-400">{order.items?.length || 0} Products</span>
                  </div>

                  <div className="space-y-8">
                     {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-6">
                           <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                              {item.productImage ? (
                                 <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center">
                                    <Package size={24} className="text-neutral-300" />
                                 </div>
                              )}
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-neutral-900 text-lg leading-tight">{item.productName || 'Product'}</h4>
                              <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest mt-2">
                                 <span>{item.weight || 'N/A'}</span>
                                 <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
                                 <span>Qty: {item.quantity}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-bold text-neutral-900 text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                              <p className="text-xs text-neutral-400 font-medium">₹{item.price.toLocaleString('en-IN')} / unit</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-10 pt-10 border-t border-neutral-50 space-y-4">
                     <div className="flex justify-between text-neutral-600 font-medium">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                     </div>
                     {discount > 0 && (
                        <div className="flex justify-between text-success font-medium">
                           <span>Discount {order.couponApplied?.code ? `(${order.couponApplied.code})` : ''}</span>
                           <span>-₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                     )}
                     <div className="flex justify-between text-neutral-600 font-medium">
                        <span>Shipping</span>
                        <span className="text-success">Free</span>
                     </div>
                     <div className="flex justify-between text-neutral-900 text-2xl font-bold pt-4">
                        <span>Total Amount</span>
                        <span className="text-brand">₹{total.toLocaleString('en-IN')}</span>
                     </div>
                  </div>
               </div>


               {/* Order Status & Actions */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10">
                  <h3 className="text-xl font-bold text-neutral-900 mb-8">Update Status</h3>
                  <div className="flex flex-wrap gap-3">
                     {[
                        { key: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
                        { key: 'processing', label: 'Processing', icon: Package, color: 'brand' },
                        { key: 'shipped', label: 'Shipped', icon: Truck, color: 'orange' },
                        { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'green' },
                        { key: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' },
                     ].map(({ key, label, icon: Icon, color }) => {
                        const isActive = order.status === key;
                        const colorStyles: Record<string, string> = {
                           yellow: isActive ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-yellow-500/20' : '',
                           brand: isActive ? 'border-brand bg-brand-50 text-brand shadow-brand/20' : '',
                           orange: isActive ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-orange-500/20' : '',
                           green: isActive ? 'border-success bg-success-bg text-success shadow-success/20' : '',
                           red: isActive ? 'border-error bg-error-bg text-error shadow-error/20' : '',
                        };

                        return (
                           <button
                              key={key}
                              disabled={isUpdating || isActive}
                              onClick={() => openConfirmModal(key, label)}
                              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-bold transition-all text-sm ${isActive
                                 ? `${colorStyles[color]} shadow-lg cursor-default`
                                 : 'border-neutral-100 bg-neutral-50 text-neutral-400 hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-600 cursor-pointer'
                                 } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                           >
                              {isUpdating && confirmModal.status === key ? (
                                 <Loader2 className="animate-spin" size={16} />
                              ) : (
                                 <Icon size={16} />
                              )}
                              <span className="capitalize">{label}</span>
                           </button>
                        );
                     })}
                  </div>

                  <div className="mt-8 p-5 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="text-brand" size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-neutral-900 text-sm">Status Update Info</h4>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                           Click any status button to change the order status. A confirmation will be shown before the update.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-10">

               {/* Customer Details Card */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand/20">
                        {order.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                     </div>
                     <div>
                        <h3 className="font-bold text-neutral-900 text-lg leading-tight">{order.user?.name || 'Unknown'}</h3>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">Customer</p>
                     </div>
                  </div>

                  <div className="space-y-6 mb-8">
                     {order.user?.email && (
                        <div className="flex items-center gap-4 group cursor-pointer">
                           <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                              <Mail size={18} />
                           </div>
                           <span className="text-sm font-bold text-neutral-600 truncate">{order.user.email}</span>
                        </div>
                     )}
                     {order.user?.phone && (
                        <div className="flex items-center gap-4 group cursor-pointer">
                           <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                              <Phone size={18} />
                           </div>
                           <span className="text-sm font-bold text-neutral-600">{order.user.phone}</span>
                        </div>
                     )}
                  </div>
               </div>

               {/* Shipping Info Card */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-3">
                     <MapPin size={20} className="text-brand" /> Shipping Info
                  </h3>

                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Delivery Address</p>
                        <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                           {order.shippingAddress?.street || 'N/A'}<br />
                           {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                           {order.shippingAddress?.zip}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Payment Info Card */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-3">
                     <CreditCard size={20} className="text-brand" /> Payment Details
                  </h3>

                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${payment.style}`}>
                           {payment.label}
                        </span>
                     </div>
                     {order.paymentInfo?.razorpayPaymentId && (
                        <div>
                           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Payment ID</p>
                           <code className="text-xs font-bold text-brand bg-brand-50 px-2 py-1 rounded block truncate">
                              {order.paymentInfo.razorpayPaymentId}
                           </code>
                        </div>
                     )}
                     {order.paymentInfo?.razorpayOrderId && (
                        <div>
                           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Order ID</p>
                           <code className="text-xs font-bold text-neutral-600 bg-neutral-50 px-2 py-1 rounded block truncate">
                              {order.paymentInfo.razorpayOrderId}
                           </code>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>


         {/* Confirmation Modal */}
         {confirmModal.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
               <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                        <AlertCircle className="text-orange-600" size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-neutral-900">Confirm Status Change</h3>
                        <p className="text-sm text-neutral-500">This action will update the order</p>
                     </div>
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-4 mb-6">
                     <p className="text-sm text-neutral-700">
                        You are about to change the order status from{' '}
                        <span className="font-bold text-neutral-900 capitalize">{order.status}</span> to{' '}
                        <span className="font-bold text-brand capitalize">{confirmModal.label}</span>.
                     </p>
                     {confirmModal.status === 'cancelled' && (
                        <p className="text-sm text-error mt-2 font-medium">
                           ⚠️ Warning: Cancelling an order cannot be easily undone.
                        </p>
                     )}
                  </div>

                  <div className="flex gap-3">
                     <button
                        onClick={() => setConfirmModal({ open: false, status: '', label: '' })}
                        className="flex-1 px-6 py-3 rounded-2xl border-2 border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleStatusChange}
                        disabled={isUpdating}
                        className={`flex-1 px-6 py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 ${confirmModal.status === 'cancelled'
                           ? 'bg-error text-white hover:bg-red-700'
                           : 'bg-brand text-white hover:bg-brand-dark'
                           }`}
                     >
                        {isUpdating ? (
                           <Loader2 className="animate-spin" size={18} />
                        ) : (
                           <>Confirm Update</>
                        )}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
