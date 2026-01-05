import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
   ArrowLeft,
   Mail,
   Phone,
   MapPin,
   ShieldCheck,
   Calendar,
   User as UserIcon,
   CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/Button';
import { API_CONFIG } from '../../config';

export const AdminCustomerDetails: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const [customer, setCustomer] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   // Helper to get token
   const getToken = () => {
      const localToken = localStorage.getItem('token');
      if (localToken && localToken !== 'null' && localToken !== 'undefined') return localToken;

      const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
      if (match) return match[2];

      const tokenMatch = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      if (tokenMatch) return tokenMatch[2];

      return null;
   };

   useEffect(() => {
      const controller = new AbortController();
      const { signal } = controller;

      const fetchCustomerDetails = async () => {
         try {
            setLoading(true);
            const token = getToken();

            const res = await fetch(`${API_CONFIG.BASE_URL}/admin/customers/${id}`, {
               signal,
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            });

            const data = await res.json();

            if (data.success) {
               setCustomer(data.data);
            } else {
               setError(data.message || 'Failed to fetch customer details');
            }
         } catch (err: any) {
            if (err.name !== 'AbortError') {
               setError('An error occurred while fetching details');
            }
         } finally {
            if (!signal.aborted) {
               setLoading(false);
            }
         }
      };

      if (id) {
         fetchCustomerDetails();
      }

      return () => {
         controller.abort();
      };
   }, [id]);

   if (loading) return <div className="flex justify-center items-center h-screen">Loading details...</div>;
   if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
   if (!customer) return <div className="text-center mt-10">Customer not found</div>;

   return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-24">
         {/* Breadcrumb Navigation */}
         <div className="flex items-center justify-between">
            <Link
               to="/dashboard/customers"
               className="flex items-center gap-2 text-neutral-500 hover:text-brand transition-colors font-bold text-xs uppercase tracking-[0.2em] group"
            >
               <div className="p-1.5 rounded-lg bg-white border border-neutral-100 group-hover:border-brand/30 transition-colors">
                  <ArrowLeft size={14} />
               </div>
               Back to Directory
            </Link>
         </div>

         {/* Main Container */}
         <div className="bg-white rounded-[40px] border border-neutral-100 shadow-overlay overflow-hidden">
            {/* Modern Profile Header */}
            <div className="bg-neutral-900 p-12 md:p-16 text-white relative">
               {/* Sophisticated Abstract Decorations */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-brand-light/5 rounded-full blur-[80px] pointer-events-none"></div>

               <div className="flex flex-col md:flex-row items-center md:items-center gap-10 relative z-10">
                  {/* Profile Avatar with sophisticated border */}
                  <div className="relative group">
                     <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-light to-brand rounded-[2.8rem] blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                     <div className="w-36 h-36 rounded-[2.5rem] bg-brand text-white flex items-center justify-center font-bold text-5xl shadow-2xl relative border-4 border-white/5">
                        {customer.avatar || customer.name[0]}
                     </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                     <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{customer.name}</h1>
                        <span className={`inline-flex items-center px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] w-fit mx-auto md:mx-0 shadow-lg ${customer.status === 'Active' ? 'bg-success text-white shadow-success/20' : 'bg-neutral-500 text-white'}`}>
                           {customer.status}
                        </span>
                     </div>

                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-neutral-400">
                        <span className="text-sm font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                           Customer ID: {customer.id ? customer.id.slice(-6).toUpperCase() : 'N/A'}
                        </span>
                        <span className="w-1.5 h-1.5 bg-neutral-700 rounded-full"></span>
                        <div className="flex items-center gap-2 text-brand-light font-bold text-xs uppercase tracking-wider">
                           <CheckCircle2 size={16} /> Verified KCnuts Account
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Details Content Section */}
            <div className="p-10 md:p-16 bg-white">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                  {/* Left Column: Personal Data */}
                  <div className="lg:col-span-7 space-y-12">
                     <div>
                        <div className="flex items-center gap-3 mb-10">
                           <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand">
                              <UserIcon size={20} />
                           </div>
                           <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-[0.2em]">Profile Information</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-16">
                           <div className="space-y-2">
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                 <Mail size={14} className="text-neutral-300" /> Email
                              </p>
                              <p className="text-xl font-bold text-neutral-800 break-all">{customer.email || 'N/A'}</p>
                           </div>

                           <div className="space-y-2">
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                 <Phone size={14} className="text-neutral-300" /> Phone
                              </p>
                              <p className="text-xl font-bold text-neutral-800">{customer.phone || 'N/A'}</p>
                           </div>

                           <div className="space-y-2">
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                 <Calendar size={14} className="text-neutral-300" /> Member Since
                              </p>
                              <p className="text-xl font-bold text-neutral-800">{new Date(customer.joined).toLocaleDateString()}</p>
                           </div>
                        </div>
                     </div>

                     {/* Note / Bio Section */}
                     <div className="bg-neutral-50 p-10 rounded-[3rem] border border-neutral-100 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-6">Internal Profile Note</p>
                        <p className="text-xl text-neutral-600 leading-relaxed font-light italic relative z-10">
                           "{customer.bio || 'No notes available for this customer.'}"
                        </p>
                     </div>
                  </div>

                  {/* Right Column: Address Data */}
                  <div className="lg:col-span-5">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-[0.2em] flex items-center gap-3">
                           <MapPin size={20} className="text-brand" /> Delivery Addresses
                        </h3>
                        {customer.addresses && customer.addresses.length > 0 && (
                           <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                              {customer.addresses.length}
                           </span>
                        )}
                     </div>

                     {customer.addresses && customer.addresses.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
                           {customer.addresses.map((addr: any, index: number) => (
                              <div
                                 key={addr._id || index}
                                 className={`bg-neutral-50 p-5 rounded-2xl border ${addr.isDefault ? 'border-brand/30 bg-brand-50/30' : 'border-neutral-100'} hover:border-brand/20 transition-colors`}
                              >
                                 {/* Header Row */}
                                 <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 bg-white px-2 py-0.5 rounded capitalize border border-neutral-100">
                                          {addr.type || 'Home'}
                                       </span>
                                       {addr.isDefault && (
                                          <span className="text-[9px] font-bold text-brand bg-brand-50 px-2 py-0.5 rounded-full border border-brand/10">
                                             Default
                                          </span>
                                       )}
                                    </div>
                                 </div>

                                 {/* Street - Main */}
                                 <p className="text-base font-bold text-neutral-800 mb-2 leading-snug">
                                    {addr.street}
                                 </p>

                                 {/* Inline Location Details */}
                                 <p className="text-sm text-neutral-500">
                                    {addr.city}, {addr.state} - <span className="font-semibold text-neutral-700">{addr.zip}</span>
                                 </p>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="p-8 rounded-2xl border-2 border-dashed border-neutral-200 text-center text-neutral-400 text-sm">
                           No addresses saved.
                        </div>
                     )}
                  </div>

               </div>
            </div>
         </div>
      </div>
   );
};
