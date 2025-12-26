
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  ArrowDownUp, 
  Download,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Button } from '../../components/Button';

const ORDERS_DATA = [
  { id: 'KC-77291', customer: 'Aarav Patel', date: 'May 12, 2024', total: 2450, status: 'Processing', payment: 'Paid' },
  { id: 'KC-77290', customer: 'Meera Reddy', date: 'May 11, 2024', total: 3700, status: 'Delivered', payment: 'Paid' },
  { id: 'KC-77289', customer: 'Rohan Kapoor', date: 'May 11, 2024', total: 899, status: 'Shipped', payment: 'Unpaid' },
  { id: 'KC-77288', customer: 'Priya Sharma', date: 'May 10, 2024', total: 1598, status: 'Delivered', payment: 'Paid' },
  { id: 'KC-77287', customer: 'Vikram Singh', date: 'May 10, 2024', total: 549, status: 'Processing', payment: 'Paid' },
  { id: 'KC-77286', customer: 'Ananya Das', date: 'May 09, 2024', total: 1197, status: 'Cancelled', payment: 'Refunded' },
  { id: 'KC-77285', customer: 'Suresh Menon', date: 'May 09, 2024', total: 4250, status: 'Delivered', payment: 'Paid' },
  { id: 'KC-77284', customer: 'Neha Gupta', date: 'May 08, 2024', total: 949, status: 'Shipped', payment: 'Paid' },
];

export const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Orders');

  const filteredOrders = ORDERS_DATA.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-success-bg text-success';
      case 'Processing': return 'bg-brand-50 text-brand';
      case 'Shipped': return 'bg-orange-50 text-orange-600';
      case 'Cancelled': return 'bg-neutral-100 text-neutral-400';
      default: return 'bg-neutral-50 text-neutral-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Delivered': return <CheckCircle2 size={12} />;
      case 'Processing': return <Clock size={12} />;
      case 'Shipped': return <Truck size={12} />;
      case 'Cancelled': return <XCircle size={12} />;
      default: return null;
    }
  };

  const STATS_SUMMARY = [
    { label: 'Pending', count: 12, icon: Clock, color: 'text-brand', description: 'Awaiting processing' },
    { label: 'Shipping', count: 8, icon: Truck, color: 'text-orange-600', description: 'Currently in transit' },
    { label: 'Completed', count: 142, icon: CheckCircle2, color: 'text-success', description: 'Successfully delivered' },
    { label: 'Issues', count: 3, icon: AlertCircle, color: 'text-error', description: 'Cancelled or payment failed' },
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
              placeholder="Search by Order ID, Customer..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex gap-3">
            <div className="bg-neutral-100 p-1 rounded-2xl flex gap-1">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Order ID</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Customer</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Total Amount</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Payment</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-50">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                       <td className="px-10 py-6">
                          <span className="text-sm font-bold text-neutral-900 group-hover:text-brand transition-colors">#{order.id}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm font-bold text-neutral-700">{order.customer}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm text-neutral-500 font-medium">{order.date}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm font-bold text-neutral-900">₹{order.total.toLocaleString('en-IN')}</span>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${order.payment === 'Paid' ? 'bg-success' : 'bg-error'}`}></div>
                             <span className="text-xs font-bold text-neutral-600">{order.payment}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center w-fit gap-1.5 ${getStatusStyle(order.status)}`}>
                             {getStatusIcon(order.status)}
                             {order.status}
                          </span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <Link to={`/dashboard/orders/${order.id}`}>
                             <button className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-400 hover:text-brand hover:bg-brand-50 flex items-center justify-center transition-all">
                                <Eye size={18} />
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
               Showing <span className="text-neutral-900 font-bold">1 to {filteredOrders.length}</span> of <span className="text-neutral-900 font-bold">{ORDERS_DATA.length}</span> entries
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
    </div>
  );
};
