
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
   Search,
   Filter,
   Eye,
   ChevronLeft,
   ChevronRight,
   User,

   Download,
   CheckCircle2,
   XCircle,
   MoreVertical,
   Mail,
   Phone
} from 'lucide-react';
import { Button } from '../../components/Button';
import { API_CONFIG } from '../../config';



export const AdminCustomers: React.FC = () => {
   const [customers, setCustomers] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('All');
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalCustomers, setTotalCustomers] = useState(0);

   // Helper to get token from Cookies (priority) or localStorage
   const getToken = () => {
      // Check cookies first (same as transactionService)
      const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
      if (match) return match[2];

      // Fallback to localStorage
      const localToken = localStorage.getItem('token');
      if (localToken && localToken !== 'null' && localToken !== 'undefined') return localToken;

      const tokenMatch = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      if (tokenMatch) return tokenMatch[2];

      return null;
   };

   const token = getToken();

   // Ideally useAuth hook, but I'll use direct token for now to match pattern or use a service.
   // Actually, let's write the fetch logic directly here for simplicity as requested.

   const fetchCustomers = async () => {
      try {
         setLoading(true);

         const payload: any = {
            page: page,
            limit: 10,
            search: searchTerm,
         };

         if (statusFilter !== 'All') {
            payload.status = statusFilter;
         }

         const authToken = getToken(); // Get fresh token

         const res = await fetch(`${API_CONFIG.BASE_URL}/admin/customers`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
         });

         const data = await res.json();

         if (data.success) {
            setCustomers(data.data.customers);
            setTotalPages(data.data.pagination.pages);
            setTotalCustomers(data.data.pagination.total);
         }
      } catch (error) {
         console.error("Failed to fetch customers", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         fetchCustomers();
      }, 500); // Debounce search
      return () => clearTimeout(timeoutId);
   }, [searchTerm, statusFilter, page]);

   const statuses = ['All', 'Active', 'Inactive'];

   const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
         setPage(newPage);
      }
   };

   return (
      <div className="space-y-8 animate-fade-in">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Customers</h1>
               <p className="text-neutral-500 mt-2 font-medium">Manage and view your registered customer base.</p>
            </div>
            {/* <div className="flex gap-3">
               <Button variant="outline" size="sm" className="bg-white gap-2">
                  <Download size={18} /> Export List
               </Button>
            </div> */}
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
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
               />
            </div>
            <div className="flex gap-3">
               <div className="bg-neutral-100 p-1 rounded-2xl flex gap-1">
                  {statuses.map(status => (
                     <button
                        key={status}
                        onClick={() => { setStatusFilter(status); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === status
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
                     {loading ? (
                        <tr>
                           <td colSpan={6} className="px-10 py-12 text-center text-neutral-500">
                              Loading customers...
                           </td>
                        </tr>
                     ) : customers.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-10 py-12 text-center text-neutral-500">
                              No customers found matching your criteria.
                           </td>
                        </tr>
                     ) : (
                        customers.map((cust) => (
                           <tr key={cust._id} className="hover:bg-neutral-50/50 transition-colors group">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand flex items-center justify-center font-bold text-sm">
                                       {cust.name[0]}
                                    </div>
                                    <div>
                                       <span className="text-sm font-bold text-neutral-900 block">{cust.name}</span>
                                       <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ID: {cust._id.slice(-6)}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-6">
                                 <div className="flex flex-col gap-1">
                                    {cust.email && (
                                       <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                          <Mail size={12} className="text-neutral-400" /> {cust.email}
                                       </div>
                                    )}
                                    {cust.phone && (
                                       <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                          <Phone size={12} className="text-neutral-400" /> {cust.phone}
                                       </div>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-6">
                                 <span className="text-sm text-neutral-500 font-medium">{new Date(cust.joined).toLocaleDateString()}</span>
                              </td>
                              <td className="px-6 py-6">
                                 <span className="text-sm font-bold text-neutral-900">{cust.orders}</span>
                              </td>
                              <td className="px-6 py-6">
                                 <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${cust.status === 'Active' ? 'bg-success-bg text-success' : 'bg-neutral-100 text-neutral-400'
                                    }`}>
                                    {cust.status}
                                 </span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <Link to={`/dashboard/customers/${cust._id}`}>
                                    <button className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-400 hover:text-brand hover:bg-brand-50 flex items-center justify-center transition-all">
                                       <Eye size={18} />
                                    </button>
                                 </Link>
                              </td>
                           </tr>
                        )))}
                  </tbody>
               </table>
            </div>

            {/* Pagination */}
            <div className="px-10 py-8 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
               <p className="text-sm text-neutral-500 font-medium">
                  Showing <span className="text-neutral-900 font-bold">{customers.length > 0 ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, totalCustomers)}</span> of <span className="text-neutral-900 font-bold">{totalCustomers}</span> customers
               </p>
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => handlePageChange(page - 1)}
                     disabled={page === 1}
                     className={`p-2 rounded-xl border border-neutral-200 bg-white transition-colors ${page === 1 ? 'text-neutral-300' : 'text-neutral-400 hover:text-brand'}`}
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-neutral-600">Page {page} of {totalPages}</span>
                  <button
                     onClick={() => handlePageChange(page + 1)}
                     disabled={page === totalPages}
                     className={`p-2 rounded-xl border border-neutral-200 bg-white transition-colors ${page === totalPages ? 'text-neutral-300' : 'text-neutral-400 hover:text-brand'}`}
                  >
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};
