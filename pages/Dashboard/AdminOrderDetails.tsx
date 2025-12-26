import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Package,
  CreditCard,
  MessageCircle,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/Button';

// Mock detailed data
const ORDER_DETAILS = {
  id: 'KC-77291',
  date: 'May 12, 2024 at 10:45 AM',
  status: 'Processing',
  payment: {
    method: 'Razorpay (UPI)',
    status: 'Paid',
    transactionId: 'pay_N9y1Lp5M9a1'
  },
  customer: {
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '+91 98765 43210',
    avatar: 'AP'
  },
  shipping: {
    address: '42, Blue Diamond Residency, Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    method: 'Express Delivery (2-3 Days)'
  },
  items: [
    { id: '1', name: 'Royal W320 Cashews', price: 1698, weight: '1kg', qty: 2, image: 'https://images.unsplash.com/photo-1596328330761-46820572d421?q=80&w=200' },
    { id: '2', name: 'Kashmiri Mamra Almonds', price: 752, weight: '500g', qty: 1, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d90?q=80&w=200' }
  ],
  timeline: [
    { status: 'Order Placed', time: 'May 12, 10:45 AM', desc: 'Order received via secure checkout.', current: false },
    { status: 'Payment Verified', time: 'May 12, 11:00 AM', desc: 'Confirmed via Razorpay API.', current: false },
    { status: 'Processing', time: 'May 12, 11:30 AM', desc: 'Order items being packed and sealed.', current: true },
  ]
};

export const AdminOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(ORDER_DETAILS.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const subtotal = ORDER_DETAILS.items.reduce((acc, item) => acc + item.price, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const handleStatusChange = (newStatus: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      setCurrentStatus(newStatus);
      setIsUpdating(false);
    }, 800);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Delivered': return <CheckCircle2 size={18} />;
      case 'Processing': return <Clock size={18} />;
      case 'Shipped': return <Truck size={18} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <Link to="/dashboard/orders" className="flex items-center gap-2 text-neutral-400 hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Back to Orders
           </Link>
           <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Order #{id}</h1>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 bg-brand-50 text-brand`}>
                 {getStatusIcon(currentStatus)}
                 {currentStatus}
              </span>
           </div>
           <p className="text-neutral-500 mt-2 font-medium">{ORDER_DETAILS.date}</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" className="bg-white gap-2">
             <Printer size={18} /> Print Invoice
           </Button>
           <Button variant="black" size="md" className="gap-2">
              <MessageCircle size={18} /> Message Customer
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-10">
            
            {/* Items Summary */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 overflow-hidden">
               <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                  <h3 className="text-xl font-bold text-neutral-900">Order Items</h3>
                  <span className="text-sm font-bold text-neutral-400">{ORDER_DETAILS.items.length} Products</span>
               </div>
               
               <div className="space-y-8">
                  {ORDER_DETAILS.items.map(item => (
                    <div key={item.id} className="flex items-center gap-6">
                       <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-neutral-900 text-lg leading-tight">{item.name}</h4>
                          <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest mt-2">
                             <span>{item.weight}</span>
                             <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
                             <span>Qty: {item.qty}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-bold text-neutral-900 text-lg">₹{item.price.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-neutral-400 font-medium">₹{(item.price / item.qty).toLocaleString('en-IN')} / unit</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-10 pt-10 border-t border-neutral-50 space-y-4">
                  <div className="flex justify-between text-neutral-600 font-medium">
                     <span>Subtotal</span>
                     <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 font-medium">
                     <span>Shipping (Express)</span>
                     <span className="text-success">Free</span>
                  </div>
                  <div className="flex justify-between text-neutral-900 text-2xl font-bold pt-4">
                     <span>Total Amount</span>
                     <span className="text-brand">₹{total.toLocaleString('en-IN')}</span>
                  </div>
               </div>
            </div>

            {/* Order Status & Actions */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10">
               <h3 className="text-xl font-bold text-neutral-900 mb-8">Update Status</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(status)}
                      className={`px-4 py-4 rounded-2xl border-2 font-bold transition-all text-sm uppercase tracking-wider ${
                        currentStatus === status 
                        ? 'border-brand bg-brand-50 text-brand shadow-sm shadow-brand/10' 
                        : 'border-neutral-50 bg-neutral-50 text-neutral-400 hover:border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
               </div>
               
               <div className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-start gap-4">
                  <AlertCircle className="text-orange-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-orange-900 text-sm">Action Required</h4>
                    <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                      Updating the status to "Shipped" will notify the customer. Tracking details from Razorpay-linked logistics can be added here.
                    </p>
                  </div>
               </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10">
               <h3 className="text-xl font-bold text-neutral-900 mb-10">Activity Timeline</h3>
               <div className="space-y-12">
                  {ORDER_DETAILS.timeline.map((step, idx) => (
                    <div key={idx} className="flex gap-6 relative group">
                       {idx !== ORDER_DETAILS.timeline.length - 1 && (
                         <div className="absolute left-[13px] top-8 bottom-[-48px] w-0.5 bg-neutral-100"></div>
                       )}
                       
                       <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                         step.current ? 'bg-brand text-white shadow-glow' : 'bg-neutral-100 text-neutral-400'
                       }`}>
                          {step.current ? <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> : <div className="w-2 h-2 rounded-full bg-neutral-300"></div>}
                       </div>
                       
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className={`font-bold transition-colors ${step.current ? 'text-neutral-900' : 'text-neutral-500'}`}>{step.status}</h4>
                             <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{step.time}</span>
                          </div>
                          <p className={`text-sm leading-relaxed ${step.current ? 'text-neutral-600' : 'text-neutral-400 font-light'}`}>
                             {step.desc}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar Column */}
         <div className="space-y-10">
            
            {/* Customer Details Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand/20">
                     {ORDER_DETAILS.customer.avatar}
                  </div>
                  <div>
                     <h3 className="font-bold text-neutral-900 text-lg leading-tight">{ORDER_DETAILS.customer.name}</h3>
                     <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">Customer Profile</p>
                  </div>
               </div>
               
               <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4 group cursor-pointer">
                     <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                        <Mail size={18} />
                     </div>
                     <span className="text-sm font-bold text-neutral-600 truncate">{ORDER_DETAILS.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                     <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                        <Phone size={18} />
                     </div>
                     <span className="text-sm font-bold text-neutral-600">{ORDER_DETAILS.customer.phone}</span>
                  </div>
               </div>

               <div className="pt-8 border-t border-neutral-50">
                  <button className="w-full py-4 rounded-2xl bg-neutral-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-brand hover:shadow-glow transition-all">
                     View All Orders
                  </button>
               </div>
            </div>

            {/* Shipping Info Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
               <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <MapPin size={20} className="text-brand" /> Shipping Info
               </h3>
               
               <div className="space-y-6">
                  <div>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Delivery Address</p>
                     <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                        {ORDER_DETAILS.shipping.address}<br/>
                        {ORDER_DETAILS.shipping.city}, {ORDER_DETAILS.shipping.state}<br/>
                        {ORDER_DETAILS.shipping.pincode}
                     </p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Carrier & Method</p>
                     <p className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                        <Truck size={16} className="text-brand" /> {ORDER_DETAILS.shipping.method}
                     </p>
                  </div>
               </div>
            </div>

            {/* Payment Info Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
               <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <CreditCard size={20} className="text-brand" /> Payment Details
               </h3>
               
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</p>
                     <span className="px-3 py-1 bg-success-bg text-success rounded-full text-[10px] font-bold uppercase tracking-widest border border-success/10">
                        {ORDER_DETAILS.payment.status}
                     </span>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Provider</p>
                     <div className="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-3" />
                        <span className="text-sm font-bold text-neutral-900">({ORDER_DETAILS.payment.method.split(' ')[1]})</span>
                     </div>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Razorpay ID</p>
                     <code className="text-xs font-bold text-brand bg-brand-50 px-2 py-1 rounded block truncate">
                        {ORDER_DETAILS.payment.transactionId}
                     </code>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};