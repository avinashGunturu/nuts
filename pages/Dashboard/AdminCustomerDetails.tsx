
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calendar,
  ChevronRight,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/Button';

// Mock Customer Data
const CUSTOMER_DETAILS = {
  id: 'CUST-101',
  name: 'Aarav Patel',
  email: 'aarav.patel@example.com',
  phone: '+91 98765 43210',
  status: 'Active',
  joined: 'Jan 12, 2024',
  avatar: 'AP',
  bio: 'A regular customer from Mumbai. Prefers premium cashews and often buys for gifting purposes.',
  address: {
    label: 'Home',
    street: '42, Blue Diamond Residency, Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018'
  }
};

export const AdminCustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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
                   {CUSTOMER_DETAILS.avatar}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                 <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{CUSTOMER_DETAILS.name}</h1>
                    <span className="inline-flex items-center px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-success text-white w-fit mx-auto md:mx-0 shadow-lg shadow-success/20">
                       {CUSTOMER_DETAILS.status}
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-neutral-400">
                    <span className="text-sm font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      Customer ID: {id || CUSTOMER_DETAILS.id}
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
                          <p className="text-xl font-bold text-neutral-800 break-all">{CUSTOMER_DETAILS.email}</p>
                       </div>
                       
                       <div className="space-y-2">
                          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                             <Phone size={14} className="text-neutral-300" /> Phone
                          </p>
                          <p className="text-xl font-bold text-neutral-800">{CUSTOMER_DETAILS.phone}</p>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={14} className="text-neutral-300" /> Member Since
                          </p>
                          <p className="text-xl font-bold text-neutral-800">{CUSTOMER_DETAILS.joined}</p>
                       </div>
                    </div>
                 </div>

                 {/* Note / Bio Section */}
                 <div className="bg-neutral-50 p-10 rounded-[3rem] border border-neutral-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-6">Internal Profile Note</p>
                    <p className="text-xl text-neutral-600 leading-relaxed font-light italic relative z-10">
                       "{CUSTOMER_DETAILS.bio}"
                    </p>
                 </div>
              </div>

              {/* Right Column: Address Data */}
              <div className="lg:col-span-5 space-y-10">
                 <div>
                    <div className="flex items-center justify-between mb-10">
                       <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-[0.2em] flex items-center gap-3">
                          <MapPin size={20} className="text-brand" /> Delivery Address
                       </h3>
                       <span className="text-[10px] font-bold text-brand bg-brand-50 px-4 py-1.5 rounded-full border border-brand/10">Default</span>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border-2 border-neutral-100 shadow-sm space-y-10 hover:border-brand/20 transition-colors">
                       <div className="space-y-2">
                          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Street & Locality</p>
                          <p className="text-2xl font-bold text-neutral-800 leading-tight">
                             {CUSTOMER_DETAILS.address.street}
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">City</p>
                             <p className="text-lg font-bold text-neutral-700">{CUSTOMER_DETAILS.address.city}</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">State</p>
                             <p className="text-lg font-bold text-neutral-700">{CUSTOMER_DETAILS.address.state}</p>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-neutral-100 flex justify-between items-center">
                          <div className="space-y-2">
                             <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Pincode</p>
                             <p className="text-lg font-bold text-neutral-700">{CUSTOMER_DETAILS.address.pincode}</p>
                          </div>
                          <div className="text-right space-y-2">
                             <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Country</p>
                             <p className="text-lg font-bold text-neutral-700">India</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <Button variant="outline" className="w-full h-16 rounded-[2rem] border-neutral-200 hover:bg-neutral-50 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group transition-all">
                    Manage Saved Addresses <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                 </Button>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};
