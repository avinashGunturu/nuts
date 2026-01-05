import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
   Search,
   CreditCard,
   ExternalLink,
   Download,
   ChevronLeft,
   ChevronRight,
   ArrowUpRight,
   ArrowDownRight,
   CheckCircle2,
   Clock,
   AlertCircle,
   XCircle,
   ArrowDownUp,
   ShieldCheck,
   Loader2
} from 'lucide-react';
import { Button } from '../../components/Button';
import { getTransactions, getTransactionStats, Transaction, TransactionStats } from '../../services/transactionService';

export const AdminTransactions: React.FC = () => {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [stats, setStats] = useState<TransactionStats | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   // Filters
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [page, setPage] = useState(1);
   const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 20 });

   const statuses = ['all', 'success', 'initiated', 'failed', 'refunded'];

   // Fetch transactions
   const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
         const response = await getTransactions({
            page,
            limit: 20,
            status: statusFilter,
            search: searchTerm || undefined,
            sortBy: 'createdAt',
            sortOrder: 'desc'
         });
         setTransactions(response.transactions);
         setPagination(response.pagination);
      } catch (err: any) {
         setError(err.message || 'Failed to load transactions');
      } finally {
         setLoading(false);
      }
   };

   // Fetch stats
   const fetchStats = async () => {
      try {
         const statsData = await getTransactionStats();
         setStats(statsData);
      } catch (err) {
         console.error('Failed to load stats:', err);
      }
   };

   useEffect(() => {
      fetchTransactions();
   }, [page, statusFilter]);

   useEffect(() => {
      fetchStats();
   }, []);

   // Debounced search
   useEffect(() => {
      const timer = setTimeout(() => {
         if (page === 1) {
            fetchTransactions();
         } else {
            setPage(1);
         }
      }, 500);
      return () => clearTimeout(timer);
   }, [searchTerm]);

   const getStatusStyle = (status: string) => {
      switch (status) {
         case 'success': return 'bg-success-bg text-success';
         case 'initiated': return 'bg-brand-50 text-brand';
         case 'failed': return 'bg-error-bg text-error';
         case 'refunded': return 'bg-neutral-100 text-neutral-400';
         default: return 'bg-neutral-50 text-neutral-500';
      }
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case 'success': return <CheckCircle2 size={12} />;
         case 'initiated': return <Clock size={12} />;
         case 'failed': return <XCircle size={12} />;
         case 'refunded': return <AlertCircle size={12} />;
         default: return null;
      }
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      });
   };

   return (
      <div className="space-y-8 animate-fade-in">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Payment Transactions</h1>
               </div>
               <p className="text-neutral-500 font-medium">Monitor your revenue flow and Razorpay settlement history.</p>
            </div>
            {/* <div className="flex gap-3">
               <Button variant="outline" size="sm" className="bg-white gap-2">
                  <Download size={18} /> Export Settlement
               </Button>
            </div> */}
         </div>

         {/* Stats Summary */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
               {
                  label: 'Settled Amount',
                  value: stats ? `₹${(stats.last7Days.success.amount || 0).toLocaleString('en-IN')}` : '—',
                  icon: ArrowUpRight,
                  color: 'text-success',
                  sub: 'Last 7 days'
               },
               {
                  label: 'Pending Payments',
                  value: stats ? `₹${(stats.allTime.initiated.amount || 0).toLocaleString('en-IN')}` : '—',
                  icon: Clock,
                  color: 'text-brand',
                  sub: 'Awaiting confirmation'
               },
               {
                  label: 'Refunds Processed',
                  value: stats ? `₹${(stats.allTime.refunded.amount || 0).toLocaleString('en-IN')}` : '—',
                  icon: ArrowDownRight,
                  color: 'text-neutral-400',
                  sub: 'Direct to customer'
               },
            ].map(stat => (
               <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                     <h4 className="text-2xl font-bold text-neutral-900">{stat.value}</h4>
                     <p className="text-[10px] text-neutral-400 mt-1 font-medium">{stat.sub}</p>
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
                  placeholder="Search Payment ID, Order ID..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex gap-3">
               <div className="bg-neutral-100 p-1 rounded-2xl flex gap-1 overflow-x-auto no-scrollbar">
                  {statuses.map(status => (
                     <button
                        key={status}
                        onClick={() => { setStatusFilter(status); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap capitalize ${statusFilter === status
                           ? 'bg-white text-neutral-900 shadow-sm'
                           : 'text-neutral-500 hover:text-neutral-900'
                           }`}
                     >
                        {status}
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
            ) : transactions.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 py-20">
                  <CreditCard size={48} className="mb-4 opacity-50" />
                  <p className="font-bold">No transactions found</p>
                  <p className="text-sm">Try adjusting your filters</p>
               </div>
            ) : (
               <>
                  <div className="overflow-x-auto flex-1 no-scrollbar">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-neutral-50/50">
                              <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Payment ID</th>
                              <th className="px-4 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Order ID</th>
                              <th className="px-4 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Customer</th>
                              <th className="px-4 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Amount</th>
                              <th className="px-4 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Gateway</th>
                              <th className="px-4 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                              <th className="px-4 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Order</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                           {transactions.map((txn) => (
                              <tr key={txn._id} className="hover:bg-neutral-50/50 transition-colors group">
                                 <td className="px-6 py-5">
                                    <code className="text-[11px] font-bold text-brand bg-brand-50 px-2 py-1 rounded-lg">
                                       {txn.paymentId}
                                    </code>
                                 </td>
                                 <td className="px-4 py-5">
                                    <span className="text-xs font-bold text-neutral-700 break-all">
                                       {txn.orderDetails?.orderId || txn.orderId || '—'}
                                    </span>
                                 </td>
                                 <td className="px-4 py-5">
                                    <span className="text-sm font-bold text-neutral-700">
                                       {txn.customer?.name || 'Unknown'}
                                    </span>
                                 </td>
                                 <td className="px-4 py-5">
                                    <span className="text-sm font-bold text-neutral-900">
                                       {txn.currency === 'INR' ? '₹' : txn.currency}{txn.amount.toLocaleString('en-IN')}
                                    </span>
                                 </td>
                                 <td className="px-4 py-5">
                                    <div className="flex items-center gap-2">
                                       <CreditCard size={14} className="text-neutral-400" />
                                       <span className="text-xs font-bold text-neutral-500 capitalize">{txn.gateway}</span>
                                    </div>
                                 </td>
                                 <td className="px-4 py-5">
                                    <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">
                                       {formatDate(txn.createdAt)}
                                    </span>
                                 </td>
                                 <td className="px-4 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center w-fit gap-1.5 ${getStatusStyle(txn.status)}`}>
                                       {getStatusIcon(txn.status)}
                                       {txn.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-5 text-right">
                                    {txn.orderDetails?.orderId ? (
                                       <Link to={`/dashboard/orders/${txn.orderDetails.orderId}`}>
                                          <button className="text-neutral-300 hover:text-brand transition-all transform hover:scale-110 p-2" title="View Linked Order">
                                             <ExternalLink size={18} />
                                          </button>
                                       </Link>
                                    ) : (
                                       <span className="text-neutral-300">—</span>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-10 py-8 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto">
                     <p className="text-sm text-neutral-500 font-medium">
                        Showing <span className="text-neutral-900 font-bold">{((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)}</span> of <span className="text-neutral-900 font-bold">{pagination.total}</span> records
                     </p>
                     <div className="flex items-center gap-4">
                        <button
                           onClick={() => setPage(p => Math.max(1, p - 1))}
                           disabled={page === 1}
                           className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-brand transition-colors disabled:opacity-50"
                        >
                           <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-bold text-neutral-700">
                           Page {page} of {pagination.pages || 1}
                        </span>
                        <button
                           onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                           disabled={page >= pagination.pages}
                           className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-brand transition-colors disabled:opacity-50"
                        >
                           <ChevronRight size={20} />
                        </button>
                     </div>
                  </div>
               </>
            )}
         </div>

         <div className="p-8 bg-neutral-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-brand-light">
                  <ShieldCheck size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-bold">Razorpay Integration Active</h4>
                  <p className="text-neutral-400 text-sm mt-1">All payments are being routed through your production Razorpay account. Settlements are daily.</p>
               </div>
            </div>
            <Button variant="white" size="sm">Go to Razorpay Dashboard <ExternalLink size={14} className="ml-2" /></Button>
         </div>
      </div>
   );
};