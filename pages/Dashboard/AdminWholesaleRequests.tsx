
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
   const [inquiries, setInquiries] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Filters
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('All');
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalCount, setTotalCount] = useState(0);

   const fetchData = async () => {
      setLoading(true);
      try {
         const payload = {
            page,
            limit: 10,
            search: searchTerm,
            status: statusFilter === 'All' ? undefined : statusFilter,
            sortOrder: 'desc' as const
         };
         const response = await import('../../services/wholesaleService').then(m => m.fetchWholesaleInquiries(payload));
         setInquiries(response.data.inquiries);
         setTotalPages(response.data.pagination.pages);
         setTotalCount(response.data.pagination.total);
         setError(null);
      } catch (err: any) {
         setError(err.message || 'Failed to load data');
      } finally {
         setLoading(false);
      }
   };

   React.useEffect(() => {
      const timer = setTimeout(() => {
         fetchData();
      }, 500); // Debounce search
      return () => clearTimeout(timer);
   }, [searchTerm, statusFilter, page]);

   const statuses = ['All', 'new', 'resolved'];

   return (
      <div className="space-y-6 animate-fade-in pb-10">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Wholesale Inquiries</h1>
               <p className="text-neutral-500 mt-1 font-medium text-sm">Review and manage B2B partnership requests.</p>
            </div>
            {/* <div className="flex gap-3">
               <Button variant="outline" size="sm" className="bg-white gap-2">
                  <Download size={16} /> Export
               </Button>
            </div> */}
         </div>

         {/* Filters Bar */}
         <div className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
               <input
                  type="text"
                  placeholder="Search by Company, Contact, Email..."
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
                        {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                     </button>
                  ))}
               </div>
               {/* Removed Sort Button as requested */}
            </div>
         </div>

         {/* Table Container */}
         <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '450px' }}>
            {loading ? (
               <div className="flex flex-col items-center justify-center p-20 text-neutral-400">
                  <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-medium">Loading inquiries...</p>
               </div>
            ) : error ? (
               <div className="p-20 text-center text-error font-medium">{error}</div>
            ) : inquiries.length === 0 ? (
               <div className="p-20 text-center text-neutral-400">No inquiries found.</div>
            ) : (
               <div className="flex flex-col flex-1">
                  <div className="overflow-x-auto flex-1">
                     <table className="w-full text-left table-fixed">
                        <thead>
                           <tr className="bg-neutral-50/50 border-b border-neutral-100">
                              <th className="w-[22%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Company / Entity</th>
                              <th className="w-[18%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Primary Contact</th>
                              <th className="w-[30%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Requirements</th>
                              <th className="w-[12%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date Rec.</th>
                              <th className="w-[10%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                              <th className="w-[8%] px-3 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                           {inquiries.map((lead) => (
                              <tr key={lead._id} className="hover:bg-neutral-50/50 transition-colors group">
                                 <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                          <Building2 size={18} />
                                       </div>
                                       <div className="min-w-0">
                                          <span className="text-sm font-bold text-neutral-900 block truncate">{lead.companyName}</span>
                                          {lead.gstNumber && <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block truncate max-w-[150px]">GST: {lead.gstNumber}</span>}
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-4 py-3">
                                    <div className="min-w-0">
                                       <span className="text-sm font-bold text-neutral-700 block truncate">{lead.name}</span>
                                       <span className="text-xs text-neutral-400 font-medium truncate block max-w-[180px]" title={lead.email}>{lead.email}</span>
                                    </div>
                                 </td>
                                 <td className="px-4 py-3">
                                    <p className="text-xs text-neutral-600 truncate" title={lead.requirements}>{lead.requirements}</p>
                                 </td>
                                 <td className="px-4 py-3 text-xs text-neutral-500 font-bold whitespace-nowrap">
                                    {new Date(lead.createdAt).toLocaleDateString('en-GB')}
                                 </td>
                                 <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block ${lead.status === 'resolved' ? 'bg-green-50 text-green-600' :
                                       lead.status === 'new' ? 'bg-blue-50 text-blue-600' :
                                          'bg-neutral-100 text-neutral-500'
                                       }`}>
                                       {lead.status}
                                    </span>
                                 </td>
                                 <td className="px-4 py-3 text-right">
                                    <Link to={`/dashboard/wholesale-requests/${lead._id}`}>
                                       <button className="w-7 h-7 rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:text-blue-600 hover:border-blue-100 flex items-center justify-center transition-all">
                                          <Eye size={14} />
                                       </button>
                                    </Link>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Table Footer - Pagination & Total Records */}
                  <div className="px-6 py-4 border-t border-neutral-100 flex justify-between items-center">
                     <p className="text-sm text-neutral-500">
                        Showing <span className="font-semibold text-neutral-800">{inquiries.length}</span> of <span className="font-semibold text-neutral-800">{totalCount}</span> messages
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
                           Page <span className="font-semibold text-neutral-800">{page}</span> of <span className="font-semibold text-neutral-800">{totalPages}</span>
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
      </div>
   );
};
