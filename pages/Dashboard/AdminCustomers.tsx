
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  ArrowDownUp, 
  Download,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '../../components/Button';

const CUSTOMERS_DATA = [
  { id: 'CUST-101', name: 'Aarav Patel', email: 'aarav.patel@example.com', phone: '+91 98765 43210', status: 'Active', joined: 'Jan 12, 2024', orders: 12 },
  { id: 'CUST-102', name: 'Meera Reddy', email: 'meera.reddy@example.com', phone: '+91 98765 43211', status: 'Active', joined: 'Feb 05, 2024', orders: 8 },
  { id: 'CUST-103', name: 'Rohan Kapoor', email: 'rohan.k@example.com', phone: '+91 98765 43212', status: 'Inactive', joined: 'Mar 15, 2024', orders: 2 },
  { id: 'CUST-104', name: 'Priya Sharma', email: 'priya.s@example.com', phone: '+91 98765 43213', status: 'Active', joined: 'Mar 20, 2024', orders: 15 },
  { id: 'CUST-105', name: 'Vikram Singh', email: 'vikram.v@example.com', phone: '+91 98765 43214', status: 'Active', joined: 'Apr 02, 2024', orders: 5 },
  { id: 'CUST-106', name: 'Ananya Das', email: 'ananya.d@example.com', phone: '+91 98765 43215', status: 'Active', joined: 'Apr 10, 2024', orders: 9 },
  { id: 'CUST-107', name: 'Suresh Menon', email: 'suresh.m@example.com', phone: '+91 98765 43216', status: 'Inactive', joined: 'May 01, 2024', orders: 0 },
  { id: 'CUST-108', name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 98765 43217', status: 'Active', joined: 'May 08, 2024', orders: 4 },
];

export const AdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCustomers = CUSTOMERS_DATA.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cust.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || cust.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'Active', 'Inactive'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Customers</h1>
           <p className="text-neutral-500 mt-2 font-medium">Manage and view your registered customer base.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" size="sm" className="bg-white gap-2">
             <Download size={18} /> Export List
           </Button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', count: 8420, icon: User, color: 'text-brand' },
          { label: 'Active Users', count: 7120, icon: CheckCircle2, color: 'text-success' },
          { label: 'New This Month', count: 420, icon: ChevronRight, color: 'text-purple-600' },
          { label: 'Deactivated', count: 124, icon: XCircle, color: 'text-error' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-bold text-neutral-900">{stat.count.toLocaleString()}</h4>
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
              placeholder="Search by Name, Email, ID..."
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
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Customer Name</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Contact</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Join Date</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Orders</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-50">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-neutral-50/50 transition-colors group">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-brand-50 text-brand flex items-center justify-center font-bold text-sm">
                                {cust.name[0]}
                             </div>
                             <div>
                                <span className="text-sm font-bold text-neutral-900 block">{cust.name}</span>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{cust.id}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                <Mail size={12} className="text-neutral-400" /> {cust.email}
                             </div>
                             <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                <Phone size={12} className="text-neutral-400" /> {cust.phone}
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm text-neutral-500 font-medium">{cust.joined}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm font-bold text-neutral-900">{cust.orders}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${
                            cust.status === 'Active' ? 'bg-success-bg text-success' : 'bg-neutral-100 text-neutral-400'
                          }`}>
                             {cust.status}
                          </span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <Link to={`/dashboard/customers/${cust.id}`}>
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
               Showing <span className="text-neutral-900 font-bold">1 to {filteredCustomers.length}</span> of <span className="text-neutral-900 font-bold">{CUSTOMERS_DATA.length}</span> customers
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
