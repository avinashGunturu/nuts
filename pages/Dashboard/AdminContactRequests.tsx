
import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  X, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Filter,
  Trash2,
  Reply
} from 'lucide-react';
import { Button } from '../../components/Button';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  date: string;
  status: 'New' | 'Resolved';
}

const MOCK_REQUESTS: ContactRequest[] = [
  { id: 'REQ-501', name: 'Arjun Mehra', email: 'arjun.m@example.com', phone: '+91 98210 12345', type: 'Order Status', message: 'Hi, I ordered some cashews 3 days ago but haven\'t received tracking details yet. Order ID is KC-77295.', date: 'May 12, 2024 • 10:15 AM', status: 'New' },
  { id: 'REQ-502', name: 'Sara Khan', email: 'sara.k@gmail.com', phone: '+91 99887 76655', type: 'General Inquiry', message: 'Do you deliver to overseas locations like Dubai? We are looking for bulk gifting options for Eid.', date: 'May 11, 2024 • 04:30 PM', status: 'Resolved' },
  { id: 'REQ-503', name: 'Vikram Batra', email: 'v.batra@company.in', phone: '+91 98765 00011', type: 'Product Feedback', message: 'The quality of the Mamra almonds is phenomenal. Just wanted to share my appreciation with the team!', date: 'May 11, 2024 • 11:20 AM', status: 'New' },
  { id: 'REQ-504', name: 'Pooja Hegde', email: 'pooja.h@yahoo.com', phone: '+91 77665 54433', type: 'Returns', message: 'Received the wrong weight for my pistachio order. I ordered 1kg but received 2 packs of 250g.', date: 'May 10, 2024 • 09:00 AM', status: 'New' },
  { id: 'REQ-505', name: 'Deepak Rao', email: 'd.rao@live.com', phone: '+91 91234 56789', type: 'General Inquiry', message: 'Are your cashews roasted in oil or dry roasted? Looking for low-fat options.', date: 'May 09, 2024 • 02:45 PM', status: 'Resolved' },
];

export const AdminContactRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Resolved'>('All');
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [requests, setRequests] = useState<ContactRequest[]>(MOCK_REQUESTS);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleResolve = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Resolved' } : req
    ));
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: 'Resolved' } : null);
    }
  };

  const handleDelete = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Customer Messages</h1>
           <p className="text-neutral-500 mt-2 font-medium">Manage inquiries and support requests from the Contact page.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-neutral-100 p-1.5 rounded-2xl flex items-center gap-1">
              {(['All', 'New', 'Resolved'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === status 
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

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Customer, Email, ID..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <Button variant="outline" size="sm" className="bg-white gap-2">
            <Filter size={16} /> Advanced Filters
         </Button>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-neutral-50/50">
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Customer Info</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Inquiry Type</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Preview</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date Received</th>
                     <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-50">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-neutral-50/50 transition-colors group">
                       <td className="px-10 py-6">
                          <div>
                             <span className="text-sm font-bold text-neutral-900 block">{req.name}</span>
                             <span className="text-xs text-neutral-500 font-medium">{req.email}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className="px-3 py-1.5 bg-neutral-100 rounded-lg text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                             {req.type}
                          </span>
                       </td>
                       <td className="px-6 py-6 max-w-xs">
                          <p className="text-sm text-neutral-600 line-clamp-1 font-medium italic">
                             "{req.message}"
                          </p>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-tight">
                             <Clock size={12} /> {req.date.split('•')[0]}
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                             req.status === 'New' ? 'bg-brand-50 text-brand' : 'bg-success-bg text-success'
                          }`}>
                             {req.status}
                          </span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <button 
                            onClick={() => setSelectedRequest(req)}
                            className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-400 hover:text-brand hover:bg-brand-50 flex items-center justify-center transition-all"
                          >
                             <Eye size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         <div className="px-10 py-8 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm text-neutral-500 font-medium">
               Showing <span className="text-neutral-900 font-bold">{filteredRequests.length}</span> of <span className="text-neutral-900 font-bold">{requests.length}</span> messages
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

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md animate-fade-in" onClick={() => setSelectedRequest(null)}></div>
           <div className="bg-white rounded-[40px] w-full max-w-2xl relative z-10 shadow-overlay animate-fade-in-up overflow-hidden">
              <div className="bg-neutral-900 p-10 text-white flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center">
                          <MessageSquare size={20} />
                       </div>
                       <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Request #{selectedRequest.id}</span>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight">{selectedRequest.name}</h3>
                    <div className="flex items-center gap-6 mt-4">
                       <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                          <Mail size={14} className="text-brand-light" /> {selectedRequest.email}
                       </div>
                       <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                          <Phone size={14} className="text-brand-light" /> {selectedRequest.phone}
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedRequest(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-10 space-y-10">
                 <div className="grid grid-cols-2 gap-10 border-b border-neutral-100 pb-10">
                    <div>
                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Topic</p>
                       <p className="text-sm font-bold text-neutral-900">{selectedRequest.type}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Received On</p>
                       <p className="text-sm font-bold text-neutral-900">{selectedRequest.date}</p>
                    </div>
                 </div>

                 <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Message Content</p>
                    <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                       <p className="text-lg text-neutral-700 leading-relaxed font-light italic">
                          "{selectedRequest.message}"
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    {selectedRequest.status === 'New' ? (
                       <Button 
                         onClick={() => handleResolve(selectedRequest.id)}
                         className="flex-1 gap-2 py-4"
                       >
                          <CheckCircle2 size={18} /> Mark as Resolved
                       </Button>
                    ) : (
                       <div className="flex-1 flex items-center justify-center gap-2 py-4 bg-success-bg text-success font-bold rounded-full border border-success/10">
                          <CheckCircle2 size={20} /> Resolved & Completed
                       </div>
                    )}
                    <Button variant="outline" className="flex-1 gap-2 py-4 border-neutral-200">
                       <Reply size={18} /> Reply via Email
                    </Button>
                    <button 
                      onClick={() => handleDelete(selectedRequest.id)}
                      className="w-14 h-14 rounded-2xl bg-error-bg text-error flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-sm"
                      title="Delete Request"
                    >
                       <Trash2 size={20} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
