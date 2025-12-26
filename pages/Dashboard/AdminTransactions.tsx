import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/Button';

const TRANSACTIONS_DATA = [
  { id: 'pay_N9y1Lp5M9a1', orderId: 'KC-77291', customer: 'Aarav Patel', date: 'May 12, 2024', amount: 2450, method: 'Razorpay - UPI', status: 'Success' },
  { id: 'pay_N9x2Kp4R8b2', orderId: 'KC-77290', customer: 'Meera Reddy', date: 'May 11, 2024', amount: 3700, method: 'Razorpay - Card', status: 'Success' },
  { id: 'pay_N9w3Jm3S7c3', orderId: 'KC-77289', customer: 'Rohan Kapoor', date: 'May 11, 2024', amount: 899, method: 'Razorpay - UPI', status: 'Pending' },
  { id: 'pay_N9v4In2T6d4', orderId: 'KC-77288', customer: 'Priya Sharma', date: 'May 10, 2024', amount: 1598, method: 'Razorpay - Net Banking', status: 'Success' },
  { id: 'pay_N9u5Ho1U5e5', orderId: 'KC-77287', customer: 'Vikram Singh', date: 'May 10, 2024', amount: 549, method: 'Razorpay - Wallet', status: 'Failed' },
  { id: 'pay_N9t6Gp0V4f6', orderId: 'KC-77286', customer: 'Ananya Das', date: 'May 09, 2024', amount: 1197, method: 'Razorpay - Refund', status: 'Refunded' },
  { id: 'pay_N9s7Fq9W3g7', orderId: 'KC-77285', customer: 'Suresh Menon', date: 'May 09, 2024', amount: 4250, method: 'Razorpay - Card', status: 'Success' },
  { id: 'pay_N9r8Er8X2h8', orderId: 'KC-77284', customer: 'Neha Gupta', date: 'May 08, 2024', amount: 949, method: 'Razorpay - UPI', status: 'Success' },
];

export const AdminTransactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTransactions = TRANSACTIONS_DATA.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          txn.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          txn.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'Success', 'Pending', 'Failed', 'Refunded'];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Success': return 'bg-success-bg text-success';
      case 'Pending': return 'bg-brand-50 text-brand';
      case 'Failed': return 'bg-error-bg text-error';
      case 'Refunded': return 'bg-neutral-100 text-neutral-400';
      default: return 'bg-neutral-50 text-neutral-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Success': return <CheckCircle2 size={12} />;
      case 'Pending': return <Clock size={12} />;
      case 'Failed': return <XCircle size={12} />;
      case 'Refunded': return <AlertCircle size={12} />;
      default: return null;
    }
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
        <div className="flex gap-3">
           <Button variant="outline" size="sm" className="bg-white gap-2">
             <Download size={18} /> Export Settlement
           </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Settled Amount', value: '₹8,42,100', icon: ArrowUpRight, color: 'text-success', sub: 'Last 7 days' },
          { label: 'Pending Payouts', value: '₹42,500', icon: Clock, color: 'text-brand', sub: 'T+2 cycle' },
          { label: 'Refunds Processed', value: '₹12,890', icon: ArrowDownRight, color: 'text-neutral-400', sub: 'Direct to customer' },
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
              placeholder="Search Razorpay Payment ID, Order ID..."
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
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === status 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="bg-white gap-2">
               <ArrowDownUp size={16} /> Sort
            </Button>
         </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-neutral-50/50">
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Razorpay Payment ID</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Order ID</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Customer</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Amount</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Method</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Order</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-50">
                  {filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-neutral-50/50 transition-colors group">
                       <td className="px-10 py-6">
                          <div className="flex flex-col">
                             <code className="text-[11px] font-bold text-brand bg-brand-50 px-2 py-1 rounded-lg w-fit">
                                {txn.id}
                             </code>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm font-bold text-neutral-900">#{txn.orderId}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm font-bold text-neutral-700">{txn.customer}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm font-bold text-neutral-900">₹{txn.amount.toLocaleString('en-IN')}</span>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                             <CreditCard size={14} className="text-neutral-400" />
                             <span className="text-xs font-bold text-neutral-500 whitespace-nowrap">{txn.method}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm text-neutral-500 font-medium whitespace-nowrap">{txn.date}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center w-fit gap-1.5 ${getStatusStyle(txn.status)}`}>
                             {getStatusIcon(txn.status)}
                             {txn.status}
                          </span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <Link to={`/dashboard/orders/${txn.orderId}`}>
                             <button className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-400 hover:text-brand hover:bg-brand-50 flex items-center justify-center transition-all" title="View Linked Order">
                                <ExternalLink size={18} />
                             </button>
                          </Link>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         <div className="px-10 py-8 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm text-neutral-500 font-medium">
               Showing <span className="text-neutral-900 font-bold">1 to {filteredTransactions.length}</span> of <span className="text-neutral-900 font-bold">{TRANSACTIONS_DATA.length}</span> records
            </p>
            <div className="flex items-center gap-4">
               <button className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-brand transition-colors">
                  <ChevronLeft size={20} />
               </button>
               <button className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-brand transition-colors">
                  <ChevronRight size={20} />
               </button>
            </div>
         </div>
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