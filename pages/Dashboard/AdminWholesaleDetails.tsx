
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Calendar,
  MessageCircle,
  MoreVertical,
  Briefcase,
  CheckCircle2,
  XCircle,
  Hash,
  Info
} from 'lucide-react';
import { Button } from '../../components/Button';

// Mock Detail Data
const LEAD_DETAILS = {
  id: 'B2B-1001',
  company: 'The Oberoi Group',
  type: 'Hospitality / Hotels',
  gstNumber: '27AAACT0000A1Z5',
  contact: 'Vikram Sethi',
  email: 'procurement@oberoi.com',
  phone: '+91 98210 55443',
  status: 'Pending',
  date: 'May 12, 2024 at 02:30 PM',
  requirement: 'Monthly Supply Contract',
  quantity: '200kg per month (Grade W320)',
  message: "We are interested in a regular supply of high-grade cashews for our premium properties across India. Quality and consistent size uniformity are critical for our brand standards. Please send over your wholesale price list for quantities above 100kg."
};

export const AdminWholesaleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState(LEAD_DETAILS.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNote, setInternalNote] = useState('');

  const handleAction = (newStatus: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      setStatus(newStatus);
      setIsUpdating(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <Link to="/dashboard/wholesale-requests" className="flex items-center gap-2 text-neutral-400 hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Back to Leads
           </Link>
           <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Lead #{id || LEAD_DETAILS.id}</h1>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${
                status === 'Approved' ? 'bg-success-bg text-success border-success/10' :
                status === 'Rejected' ? 'bg-error-bg text-error border-error/10' :
                'bg-brand-50 text-brand border-brand/10'
              }`}>
                 {status}
              </span>
           </div>
           <p className="text-neutral-500 mt-2 font-medium">Received on {LEAD_DETAILS.date}</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" className="bg-white gap-2">
             <Briefcase size={18} /> Send Quote
           </Button>
           <Button variant="black" size="md" className="gap-2">
              <MessageCircle size={18} /> Contact Client
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
         
         {/* Main Details */}
         <div className="md:col-span-8 space-y-10">
            
            {/* Business Info Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10">
               <h3 className="text-xl font-bold text-neutral-900 mb-10 flex items-center gap-3">
                  <Building2 size={24} className="text-brand" /> Business Information
               </h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Company Name</p>
                     <p className="text-xl font-bold text-neutral-800">{LEAD_DETAILS.company}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Business Type</p>
                     <p className="text-xl font-bold text-neutral-800">{LEAD_DETAILS.type}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">GST Number</p>
                     <div className="flex items-center gap-2">
                        <code className="text-sm font-bold text-brand bg-brand-50 px-2 py-1 rounded">{LEAD_DETAILS.gstNumber}</code>
                        <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center" title="Valid GSTIN">
                           <ShieldCheck size={12} />
                        </div>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Member Status</p>
                     <p className="text-sm font-bold text-neutral-500 italic">Not Yet Registered</p>
                  </div>
               </div>
            </div>

            {/* Requirement Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10">
               <h3 className="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                  <Hash size={24} className="text-brand" /> Inquiry Details
               </h3>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                  <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100">
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Requirement</p>
                     <p className="font-bold text-neutral-900">{LEAD_DETAILS.requirement}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100">
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Requested Volume</p>
                     <p className="font-bold text-neutral-900">{LEAD_DETAILS.quantity}</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Message Body</p>
                  <div className="bg-neutral-50/50 p-8 rounded-3xl border border-neutral-100 italic text-neutral-700 leading-relaxed font-light">
                     "{LEAD_DETAILS.message}"
                  </div>
               </div>
            </div>

            {/* Decision Actions */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10">
               <h3 className="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                  <Info size={24} className="text-brand" /> Take Action
               </h3>
               
               <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Button 
                    variant="primary" 
                    className="flex-1 py-5 gap-3" 
                    isLoading={isUpdating}
                    disabled={status === 'Approved'}
                    onClick={() => handleAction('Approved')}
                  >
                     <CheckCircle2 size={20} /> Approve Partnership
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 py-5 gap-3 text-error border-error/20 hover:bg-error-bg hover:border-error" 
                    isLoading={isUpdating}
                    disabled={status === 'Rejected'}
                    onClick={() => handleAction('Rejected')}
                  >
                     <XCircle size={20} /> Reject Request
                  </Button>
               </div>

               <div className="space-y-4 pt-10 border-t border-neutral-50">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Internal Review Notes (Only visible to Admin)</label>
                  <textarea 
                    rows={4}
                    className="w-full px-6 py-4 rounded-3xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm font-medium"
                    placeholder="Add notes about pricing discussed, sample requests, or verification steps..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-widest">Save Notes Only</Button>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Column */}
         <div className="md:col-span-4 space-y-10">
            
            {/* Contact Person Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
               <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-brand-50 text-brand flex items-center justify-center font-bold text-2xl shadow-xl mb-4 border-4 border-white">
                     {LEAD_DETAILS.contact[0]}
                  </div>
                  <h3 className="font-bold text-neutral-900 text-xl leading-tight">{LEAD_DETAILS.contact}</h3>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">Lead Representative</p>
               </div>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                        <Mail size={18} />
                     </div>
                     <span className="text-sm font-bold text-neutral-600 truncate">{LEAD_DETAILS.email}</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                        <Phone size={18} />
                     </div>
                     <span className="text-sm font-bold text-neutral-600">{LEAD_DETAILS.phone}</span>
                  </div>
               </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-neutral-900 rounded-[40px] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Calendar size={18} className="text-brand-light" /> Request Timeline
               </h4>
               
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-1.5 shadow-glow"></div>
                     <div>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Inquiry Created</p>
                        <p className="text-sm font-bold">{LEAD_DETAILS.date.split(' at ')[0]}</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-neutral-700 mt-1.5"></div>
                     <div>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">GST Verification</p>
                        <p className="text-sm font-bold text-success">Automated Success</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-neutral-700 mt-1.5"></div>
                     <div>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Last Activity</p>
                        <p className="text-sm font-bold text-neutral-300">Awaiting Admin Response</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
};
