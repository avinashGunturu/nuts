import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
   Search,
   Eye,
   ChevronLeft,
   ChevronRight,
   ShoppingBag,
   Download,
   Clock,
   CheckCircle2,
   Truck,
   AlertCircle,
   XCircle,
   Loader2,
   Package,
   ExternalLink
} from 'lucide-react';
import { Button } from '../../components/Button';
import { orderService, Order } from '../../services/orderService';

export const AdminOrders: React.FC = () => {
   const [orders, setOrders] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   // Filters
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('');
   const [page, setPage] = useState(1);
   const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 20 });

   // Stats
   const [stats, setStats] = useState({
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
   });

   const statuses = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
   const statusLabels: Record<string, string> = {
      '': 'All Orders',
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
   };

   // Fetch orders
   const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
         const response = await orderService.getAllOrders({
            page,
            limit: 20,
            status: statusFilter || undefined,
            orderId: searchTerm || undefined
         });
         setOrders(response.orders);
         setPagination(response.pagination);

         // Calculate stats from first page (or we could add a stats endpoint)
         if (page === 1 && !statusFilter && !searchTerm) {
            const newStats = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
            response.orders.forEach((order: any) => {
               if (newStats[order.status as keyof typeof newStats] !== undefined) {
                  newStats[order.status as keyof typeof newStats]++;
               }
            });
            setStats(newStats);
         }
      } catch (err: any) {
         setError(err.message || 'Failed to load orders');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchOrders();
   }, [page, statusFilter]);

   // Debounced search
   useEffect(() => {
      const timer = setTimeout(() => {
         if (page === 1) {
            fetchOrders();
         } else {
            setPage(1);
         }
      }, 500);
      return () => clearTimeout(timer);
   }, [searchTerm]);

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
         case 'delivered': return <CheckCircle2 size={12} />;
         case 'processing': return <Clock size={12} />;
         case 'shipped': return <Truck size={12} />;
         case 'cancelled': return <XCircle size={12} />;
         case 'pending': return <Clock size={12} />;
         default: return null;
      }
   };

   const getPaymentStatus = (order: any) => {
      const status = order.paymentInfo?.status || 'pending';
      if (status === 'success' || status === 'paid') return { label: 'Paid', color: 'bg-success' };
      if (status === 'refunded') return { label: 'Refunded', color: 'bg-neutral-400' };
      if (status === 'failed') return { label: 'Failed', color: 'bg-error' };
      return { label: 'Pending', color: 'bg-yellow-500' };
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
         month: 'short',
         day: 'numeric',
         year: 'numeric'
      });
   };

   const STATS_SUMMARY = [
      { label: 'Pending', count: stats.pending, icon: Clock, color: 'text-yellow-600', description: 'Awaiting processing' },
      { label: 'Processing', count: stats.processing, icon: Package, color: 'text-brand', description: 'Being prepared' },
      { label: 'Shipped', count: stats.shipped, icon: Truck, color: 'text-orange-600', description: 'In transit' },
      { label: 'Delivered', count: stats.delivered, icon: CheckCircle2, color: 'text-success', description: 'Successfully delivered' },
   ];

   return (
      <div className="space-y-8 animate-fade-in">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Orders Management</h1>
               <p className="text-neutral-500 mt-2 font-medium">Track and manage customer orders across all channels.</p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" size="sm" className="bg-white gap-2">
                  <Download size={18} /> Export CSV
               </Button>
            </div>
         </div>

         {/* Stats Summary Bar */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS_SUMMARY.map(stat => (
               <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between group transition-all hover:shadow-md">
                  <div>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                     <h4 className="text-2xl font-bold text-neutral-900">{stat.count}</h4>
                     <p className="text-[10px] text-neutral-400 mt-1 font-medium">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-neutral-50 ${stat.color}`}>
                     <stat.icon size={24} />
                  </div>
               </div>
            ))}
         </div>

         {/* Filters Bar */}
         <div className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
               <input
                  type="text"
                  placeholder="Search by Order ID..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
               <div className="bg-neutral-100 p-1 rounded-2xl flex gap-1">
                  {statuses.map(status => (
                     <button
                        key={status}
                        onClick={() => { setStatusFilter(status); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === status
                           ? 'bg-white text-neutral-900 shadow-sm'
                           : 'text-neutral-500 hover:text-neutral-900'
                           }`}
                     >
                        {statusLabels[status]}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Table Container */}
         <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            {loading ? (
               <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="animate-spin text-brand" size={40} />
               </div>
            ) : error ? (
               <div className="flex-1 flex items-center justify-center text-error">
                  <AlertCircle size={20} className="mr-2" /> {error}
               </div>
            ) : orders.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 py-20">
                  <ShoppingBag size={48} className="mb-4 opacity-50" />
                  <p className="font-bold">No orders found</p>
                  <p className="text-sm">Try adjusting your filters</p>
               </div>
            ) : (
               <>
                  <div className="overflow-x-auto flex-1">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-neutral-50/50">
                              <th className="px-10 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Order ID</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Customer</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Total Amount</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Payment</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                              <th className="px-10 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                           {orders.map((order) => {
                              const payment = getPaymentStatus(order);
                              return (
                                 <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-10 py-5">
                                       <span className="text-xs font-bold text-brand font-mono group-hover:text-brand-dark transition-colors">#{order.orderId || order._id.slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand flex items-center justify-center text-xs font-bold uppercase">
                                             {order.user?.name?.[0] || 'U'}
                                          </div>
                                          <span className="text-sm font-bold text-neutral-700">{order.user?.name || 'Unknown'}</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-5">
                                       <span className="text-sm text-neutral-500 font-medium whitespace-nowrap">{formatDate(order.createdAt)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                       <span className="text-sm font-bold text-neutral-900">₹{order.finalAmount?.toLocaleString('en-IN') || 0}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                       <div className="flex items-center gap-2">
                                          <div className={`w-1.5 h-1.5 rounded-full ${payment.color}`}></div>
                                          <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">{payment.label}</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-5">
                                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center w-fit gap-1.5 ${getStatusStyle(order.status)}`}>
                                          {getStatusIcon(order.status)}
                                          {order.status}
                                       </span>
                                    </td>
                                    <td className="px-10 py-5 text-right">
                                       <Link to={`/dashboard/orders/${order.orderId || order._id}`}>
                                          <button className="text-neutral-300 hover:text-brand transition-all transform hover:scale-110 p-2">
                                             <ExternalLink size={18} />
                                          </button>
                                       </Link>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-10 py-6 border-t border-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto">
                     <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                        Showing <span className="text-neutral-900">{((page - 1) * pagination.limit) + 1}-{Math.min(page * pagination.limit, pagination.total)}</span> of <span className="text-neutral-900">{pagination.total}</span>
                     </p>
                     <div className="flex items-center gap-2">
                        <button
                           onClick={() => setPage(p => Math.max(1, p - 1))}
                           disabled={page === 1}
                           className="w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-400 hover:text-brand hover:border-brand transition-all disabled:opacity-30 flex items-center justify-center"
                        >
                           <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-bold text-neutral-900 min-w-[60px] text-center">
                           Page {page} / {pagination.pages || 1}
                        </span>
                        <button
                           onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                           disabled={page >= pagination.pages}
                           className="w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-400 hover:text-brand hover:border-brand transition-all disabled:opacity-30 flex items-center justify-center"
                        >
                           <ChevronRight size={16} />
                        </button>
                     </div>
                  </div>
               </>
            )}
         </div>
      </div>
   );
};
