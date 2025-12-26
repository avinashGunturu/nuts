
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight, 
  ArrowDownUp, 
  Download,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Building2,
  User
} from 'lucide-react';
import { Button } from '../../components/Button';

const WHOLESALE_DATA = [
  { id: 'B2B-1001', company: 'The Oberoi Group', type: 'Hospitality', contact: 'Vikram Sethi', email: 'procurement@oberoi.com', qty: '200kg/mo', date: 'May 12, 2024', status: 'Pending' },
  { id: 'B2B-1002', company: 'Reliance Retail', type: 'Supermarket', contact: 'Shweta J.', email: 'shweta@ril.com', qty: '500kg', date: 'May 11, 2024', status: 'Approved' },
  { id: 'B2B-1003', company: 'Blue Tokai', type: 'Cafe Chain', contact: 'Rahul Bose', email: 'rahul@bluetokai.com', qty: '50kg/mo', date: 'May 10, 2024', status: 'Rejected' },
  { id: 'B2B-1004', company: 'Le 15 Patisserie', type: 'Bakery', contact: 'Pooja Dhingra', email: 'orders@le15.com', qty: '100kg/mo', date: 'May 09, 2024', status: 'Approved' },
  { id: 'B2B-1005', company: 'Taj Hotels', type: 'Hospitality', contact: 'Arun M.', email: 'a.mehra@ihcl.com', qty: '150kg/mo', date: 'May 08, 2024', status: 'Pending' },
];

export const AdminWholesaleRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredData = WHOLESALE_DATA.filter(item => {
    const matchesSearch = item.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Wholesale Inquiries</h1>
           <p className="text-neutral-500 mt-2 font-medium">Review and manage B2B partnership requests and bulk quotes.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" size="sm" className="bg-white gap-2">
             <Download size={18} /> Export Leads
           </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'New Requests', count: 14, icon: Clock, color: 'text-brand' },
          { label: 'Approved Partners', count: 82, icon: CheckCircle2, color: 'text-success' },
          { label: 'Avg. Lead Quality', count: 'High', icon: Briefcase, color: 'text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-bold text-neutral-900">{stat.count}</h4>
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
              placeholder="Search by Company, Contact, ID..."
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
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Company / Entity</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Primary Contact</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Est. Qty</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date Rec.</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Review</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-50">
                  {filteredData.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-50/50 transition-colors group">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center">
                                <Building2 size={20} />
                             </div>
                             <div>
                                <span className="text-sm font-bold text-neutral-900 block">{lead.company}</span>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{lead.type}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div>
                            <span className="text-sm font-bold text-neutral-700 block">{lead.contact}</span>
                            <span className="text-xs text-neutral-400 font-medium">{lead.email}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className="text-sm font-bold text-neutral-900">{lead.qty}</span>
                       </td>
                       <td className="px-6 py-6 text-sm text-neutral-500 font-medium">
                          {lead.date}
                       </td>
                       <td className="px-6 py-6">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${
                            lead.status === 'Approved' ? 'bg-success-bg text-success' : 
                            lead.status === 'Rejected' ? 'bg-error-bg text-error' : 
                            'bg-brand-50 text-brand'
                          }`}>
                             {lead.status}
                          </span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <Link to={`/dashboard/wholesale-requests/${lead.id}`}>
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
               Showing <span className="text-neutral-900 font-bold">1 to {filteredData.length}</span> of <span className="text-neutral-900 font-bold">{WHOLESALE_DATA.length}</span> entries
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
