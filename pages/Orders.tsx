import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { ShoppingBag, Package, Truck, CheckCircle2, ChevronRight, ArrowRight, ExternalLink, Clock, MapPin } from 'lucide-react';
import { Button } from '../components/Button';

const MOCK_ORDERS = [
  {
    id: 'KC-77291',
    date: '12 May 2024',
    total: 2450,
    status: 'Delivered',
    address: 'Worli, Mumbai',
    items: [
      { name: 'Royal W320 Cashews', weight: '1kg', qty: 2, image: 'https://images.unsplash.com/photo-1596328330761-46820572d421?q=80&w=200' },
      { name: 'Kashmiri Mamra Almonds', weight: '500g', qty: 1, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d90?q=80&w=200' }
    ]
  },
  {
    id: 'KC-77104',
    date: '28 Apr 2024',
    total: 899,
    status: 'Delivered',
    address: 'Andheri East, Mumbai',
    items: [
      { name: 'Premium Walnut Kernels', weight: '400g', qty: 1, image: 'https://images.unsplash.com/photo-1563538448-b3d4b0051e5e?q=80&w=200' }
    ]
  },
  {
    id: 'KC-76882',
    date: '15 Mar 2024',
    total: 1200,
    status: 'Processing',
    address: 'Worli, Mumbai',
    items: [
      { name: 'Salted Roasted Pistachios', weight: '400g', qty: 2, image: 'https://images.unsplash.com/photo-1600189020840-e9918c25268d?q=80&w=200' }
    ]
  }
];

export const Orders: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-neutral-50 pt-36 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
             <div>
                <span className="text-brand font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Order History</span>
                <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight">Recent Orders</h1>
                <p className="text-neutral-500 mt-4 text-lg font-light">Showing orders for <span className="text-neutral-900 font-bold">{user?.name}</span></p>
             </div>
             <Link to="/shop">
                <Button variant="outline" size="md" className="shadow-sm">Continue Shopping</Button>
             </Link>
          </div>

          <div className="space-y-10">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="bg-white rounded-[40px] border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                
                {/* Order Header */}
                <div className="bg-neutral-50/50 px-10 py-8 border-b border-neutral-100 flex flex-col md:flex-row justify-between gap-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                     <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Order Placed</p>
                        <p className="font-bold text-neutral-900 flex items-center gap-2"><Clock size={14} className="text-neutral-400" /> {order.date}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Total Amount</p>
                        <p className="font-bold text-brand text-lg">₹{order.total.toLocaleString('en-IN')}</p>
                     </div>
                     <div className="hidden sm:block">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Ship To</p>
                        <p className="font-bold text-neutral-900 flex items-center gap-2"><MapPin size={14} className="text-neutral-400" /> {order.address}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-none border-neutral-200">
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">ID: {order.id}</p>
                        <button className="text-xs font-bold text-brand hover:underline flex items-center gap-1.5 ml-auto">
                          <ExternalLink size={12} /> View Details
                        </button>
                     </div>
                     <div className="h-10 w-px bg-neutral-200 mx-2 hidden md:block"></div>
                     <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-neutral-200 text-sm font-bold shadow-sm hover:border-brand transition-colors">
                        Invoice
                     </button>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-10">
                   {/* Status Banner */}
                   <div className="flex items-center gap-3 mb-10">
                      {order.status === 'Delivered' ? (
                        <div className="flex items-center gap-3 bg-success-bg px-5 py-2.5 rounded-full text-success border border-success/10">
                          <CheckCircle2 size={20} className="fill-success text-white" />
                          <span className="font-bold uppercase tracking-widest text-xs">Delivered successfully</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 bg-brand-50 px-5 py-2.5 rounded-full text-brand border border-brand/10">
                          <div className="relative">
                            <Truck size={20} />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-ping"></div>
                          </div>
                          <span className="font-bold uppercase tracking-widest text-xs">Processing • Arriving Friday</span>
                        </div>
                      )}
                      <div className="h-px flex-1 bg-neutral-100"></div>
                   </div>

                   <div className="space-y-8">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-center gap-8 border-b border-neutral-50 pb-8 last:border-none last:pb-0">
                           <div className="flex items-center gap-8 flex-1">
                              <div className="w-28 h-28 rounded-3xl bg-neutral-50 border border-neutral-100 overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-all duration-500">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-2xl font-bold text-neutral-900 mb-2">{item.name}</h4>
                                 <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                                    <span className="px-3 py-1 bg-neutral-100 rounded-lg font-bold">{item.weight}</span>
                                    <span className="px-3 py-1 bg-neutral-100 rounded-lg font-bold">Qty: {item.qty}</span>
                                 </div>
                                 <div className="flex gap-6 mt-6">
                                    <button className="text-sm font-bold text-brand hover:underline flex items-center gap-2">Write Review</button>
                                    <button className="text-sm font-bold text-brand hover:underline flex items-center gap-2">Buy Again</button>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col gap-3 w-full sm:w-auto min-w-[180px]">
                              <Button variant="black" size="sm" className="w-full h-12 shadow-lg hover:shadow-neutral-900/20">Track Package</Button>
                              <Button variant="outline" size="sm" className="w-full h-12 bg-transparent">Return Item</Button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>

          {MOCK_ORDERS.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[40px] border border-neutral-100 shadow-xl shadow-neutral-100/30">
               <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8 text-neutral-200">
                  <ShoppingBag size={48} />
               </div>
               <h3 className="text-3xl font-bold text-neutral-900 mb-3">No orders found</h3>
               <p className="text-neutral-500 mb-12 text-lg font-light">You haven't placed any harvest requests with us yet.</p>
               <Link to="/shop">
                  <Button size="lg" className="px-10">Start Your Journey</Button>
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};