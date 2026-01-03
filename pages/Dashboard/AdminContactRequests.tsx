import React, { useState, useEffect, useCallback } from 'react';
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
   Download,
   Reply,
   User
} from 'lucide-react';
import { Button } from '../../components/Button';
import {
   fetchContactRequests,
   updateContactStatus,
   ContactRequestItem,
   ContactListResponse
} from '../../services/contactService';

export const AdminContactRequests: React.FC = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Resolved'>('All');
   const [selectedRequest, setSelectedRequest] = useState<ContactRequestItem | null>(null);
   const [requests, setRequests] = useState<ContactRequestItem[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalItems, setTotalItems] = useState(0);
   const [error, setError] = useState('');

   const loadRequests = useCallback(async () => {
      setIsLoading(true);
      setError('');
      try {
         const apiStatus = statusFilter === 'All' ? undefined : statusFilter.toLowerCase();
         const response = await fetchContactRequests({
            page,
            limit: 10,
            status: apiStatus as string,
            search: searchTerm,
            sortBy: 'createdAt',
            sortOrder: 'desc'
         });

         setRequests(response.data.requests);
         setTotalPages(response.data.pagination.pages);
         setTotalItems(response.data.pagination.total);
      } catch (err) {
         console.error(err);
         setError('Failed to load contact requests');
      } finally {
         setIsLoading(false);
      }
   }, [page, searchTerm, statusFilter]);

   useEffect(() => {
      const timer = setTimeout(() => {
         loadRequests();
      }, 500);
      return () => clearTimeout(timer);
   }, [loadRequests]);

   useEffect(() => {
      setPage(1);
   }, [searchTerm, statusFilter]);

   const handleResolve = async (id: string) => {
      try {
         setRequests(prev => prev.map(req =>
            req._id === id ? { ...req, status: 'resolved' } : req
         ));
         if (selectedRequest?._id === id) {
            setSelectedRequest(prev => prev ? { ...prev, status: 'resolved' } : null);
         }
         await updateContactStatus(id, 'resolved');
      } catch (err) {
         console.error('Failed to update status:', err);
         setError('Failed to update status');
         loadRequests();
      }
   };

   const statuses = ['All', 'New', 'Resolved'] as const;

   return (
      <div className="space-y-6 animate-fade-in pb-10">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Contact Requests</h1>
               <p className="text-neutral-500 mt-1 font-medium text-sm">Manage inquiries and support requests.</p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" size="sm" className="bg-white gap-2">
                  <Download size={16} /> Export
               </Button>
            </div>
         </div>

         {/* Filters Bar */}
         <div className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
               <input
                  type="text"
                  placeholder="Search by Name, Email, Topic..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex gap-3 items-center">
               <div className="bg-neutral-100 p-1 rounded-xl flex gap-1">
                  {statuses.map(status => (
                     <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === status
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

         {/* Error Message */}
         {error && (
            <div className="p-4 bg-error/10 text-error rounded-2xl text-center">
               {error}
            </div>
         )}

         {/* Table Container */}
         <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '450px' }}>
            {isLoading ? (
               <div className="flex flex-col items-center justify-center p-20 text-neutral-400 flex-1">
                  <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-medium">Loading requests...</p>
               </div>
            ) : requests.length === 0 ? (
               <div className="p-20 text-center text-neutral-400 flex-1 flex items-center justify-center">No requests found.</div>
            ) : (
               <div className="flex flex-col flex-1">
                  <div className="overflow-x-auto flex-1">
                     <table className="w-full text-left table-fixed">
                        <thead>
                           <tr className="bg-neutral-50/50 border-b border-neutral-100">
                              <th className="w-[22%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Customer Info</th>
                              <th className="w-[15%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Topic</th>
                              <th className="w-[30%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Message Preview</th>
                              <th className="w-[13%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date Rec.</th>
                              <th className="w-[12%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                              <th className="w-[8%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                           {requests.map((req) => (
                              <tr key={req._id} className="hover:bg-neutral-50/50 transition-colors group">
                                 <td className="px-3 py-3">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                       <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                          <User size={16} />
                                       </div>
                                       <div className="min-w-0 flex-1">
                                          <span className="text-sm font-bold text-neutral-900 block truncate">{req.name}</span>
                                          <span className="text-[10px] text-neutral-400 font-medium block truncate" title={req.email}>{req.email}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-3 py-3">
                                    <span className="px-2 py-1 bg-neutral-100 rounded-md text-[10px] font-bold uppercase tracking-wider text-neutral-500 inline-block truncate max-w-full">
                                       {req.topic}
                                    </span>
                                 </td>
                                 <td className="px-3 py-3">
                                    <p className="text-xs text-neutral-600 truncate" title={req.message}>{req.message}</p>
                                 </td>
                                 <td className="px-3 py-3 text-xs text-neutral-500 font-bold whitespace-nowrap">
                                    {new Date(req.createdAt).toLocaleDateString('en-GB')}
                                 </td>
                                 <td className="px-3 py-3">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block ${req.status === 'resolved' ? 'bg-green-50 text-green-600' :
                                          req.status === 'new' ? 'bg-blue-50 text-blue-600' :
                                             'bg-neutral-100 text-neutral-500'
                                       }`}>
                                       {req.status}
                                    </span>
                                 </td>
                                 <td className="px-3 py-3 text-center">
                                    <button
                                       onClick={() => setSelectedRequest(req)}
                                       className="w-7 h-7 rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:text-blue-600 hover:border-blue-100 flex items-center justify-center transition-all mx-auto"
                                    >
                                       <Eye size={14} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Table Footer - Pagination & Total Records */}
                  <div className="px-6 py-4 border-t border-neutral-100 flex justify-between items-center">
                     <p className="text-sm text-neutral-500">
                        Showing <span className="font-semibold text-neutral-800">{requests.length}</span> of <span className="font-semibold text-neutral-800">{totalItems}</span> messages
                     </p>
                     <div className="flex items-center gap-2">
                        <button
                           disabled={page === 1}
                           onClick={() => setPage(p => Math.max(1, p - 1))}
                           className="w-8 h-8 rounded-lg border border-neutral-200 bg-white text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                           <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm text-neutral-600 px-2">
                           Page <span className="font-semibold text-neutral-800">{page}</span> of <span className="font-semibold text-neutral-800">{Math.max(1, totalPages)}</span>
                        </span>
                        <button
                           disabled={page === totalPages}
                           onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                           className="w-8 h-8 rounded-lg border border-neutral-200 bg-white text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                           <ChevronRight size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Detail Modal */}
         {selectedRequest && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
               <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md animate-fade-in" onClick={() => setSelectedRequest(null)}></div>
               <div className="bg-white rounded-t-[32px] sm:rounded-[40px] w-full max-w-2xl relative z-10 shadow-overlay animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col">
                  <div className="bg-neutral-900 p-6 md:p-10 text-white flex justify-between items-start shrink-0">
                     <div className="pr-8">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
                              <MessageSquare size={20} />
                           </div>
                           <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Request #{selectedRequest._id.slice(-6)}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight break-words">{selectedRequest.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-4">
                           <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                              <Mail size={14} className="text-brand-light shrink-0" /> <span className="break-all">{selectedRequest.email}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                              <Phone size={14} className="text-brand-light shrink-0" /> {selectedRequest.phone}
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setSelectedRequest(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all shrink-0">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="p-6 md:p-10 space-y-6 md:space-y-10 overflow-y-auto">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 border-b border-neutral-100 pb-6 sm:pb-10">
                        <div>
                           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Topic</p>
                           <p className="text-sm font-bold text-neutral-900">{selectedRequest.topic}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Received On</p>
                           <p className="text-sm font-bold text-neutral-900">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                        </div>
                     </div>

                     <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Message Content</p>
                        <div className="bg-neutral-50 p-6 md:p-8 rounded-3xl border border-neutral-100">
                           <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light italic break-words">
                              "{selectedRequest.message}"
                           </p>
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        {selectedRequest.status === 'new' ? (
                           <Button
                              onClick={() => handleResolve(selectedRequest._id)}
                              className="flex-1 gap-2 py-4 justify-center"
                           >
                              <CheckCircle2 size={18} /> Mark as Resolved
                           </Button>
                        ) : (
                           <div className="flex-1 flex items-center justify-center gap-2 py-4 bg-success-bg text-success font-bold rounded-full border border-success/10">
                              <CheckCircle2 size={20} /> Resolved & Completed
                           </div>
                        )}
                        <Button variant="outline" className="flex-1 gap-2 py-4 border-neutral-200 justify-center">
                           <Reply size={18} /> Reply via Email
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
