
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Button } from '../../components/Button';

const STATS = [
  { 
    label: 'Total Revenue', 
    value: '₹12,45,670', 
    change: '+12.5%', 
    isPositive: true, 
    icon: IndianRupee,
    color: 'text-brand'
  },
  { 
    label: 'Total Orders', 
    value: '1,248', 
    change: '+8.2%', 
    isPositive: true, 
    icon: ShoppingBag,
    color: 'text-purple-600'
  },
  { 
    label: 'Total Users', 
    value: '8,420', 
    change: '+14.1%', 
    isPositive: true, 
    icon: Users,
    color: 'text-emerald-600'
  },
  { 
    label: 'Avg. Order Value', 
    value: '₹1,450', 
    change: '-2.4%', 
    isPositive: false, 
    icon: TrendingUp,
    color: 'text-orange-600'
  },
];

const RECENT_ORDERS = [
  { id: '#KC-77291', customer: 'Aarav Patel', product: 'W320 Cashews', date: '2 min ago', amount: '₹1,698', status: 'Processing' },
  { id: '#KC-77290', customer: 'Meera Reddy', product: 'Mamra Almonds', date: '15 min ago', amount: '₹3,700', status: 'Delivered' },
  { id: '#KC-77289', customer: 'Rohan Kapoor', product: 'Walnut Kernels', date: '1 hour ago', amount: '₹899', status: 'Shipped' },
  { id: '#KC-77288', customer: 'Priya Sharma', product: 'Salted Pistachios', date: '3 hours ago', amount: '₹1,598', status: 'Delivered' },
  { id: '#KC-77287', customer: 'Vikram Singh', product: 'Afghan Anjeer', date: '5 hours ago', amount: '₹549', status: 'Processing' },
  { id: '#KC-77286', customer: 'Ananya Das', product: 'Golden Raisins', date: 'Yesterday', amount: '₹1,197', status: 'Shipped' },
];

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="min-w-0">
           <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">Dashboard Overview</h1>
           <p className="text-neutral-500 mt-2 font-medium">Welcome back, Rajesh! Here's what's happening with KCnuts today.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
           <Button variant="outline" size="sm" className="bg-white whitespace-nowrap">Download Reports</Button>
           <Button variant="black" size="sm" className="flex items-center gap-2 whitespace-nowrap">
             <Plus size={18} /> Add Product
           </Button>
        </div>
      </div>

      {/* Stats Grid - Enhanced to match screenshot style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm hover:shadow-overlay transition-all duration-500">
             {/* Large faint background icon */}
             <div className={`absolute -right-4 -bottom-4 opacity-5 transform rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0 ${stat.color}`}>
                <stat.icon size={120} />
             </div>

             <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-10">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-neutral-50 ${stat.color}`}>
                      <stat.icon size={24} />
                   </div>
                   <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${stat.isPositive ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
                      {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                   </div>
                </div>
                
                <div>
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                   <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">{stat.value}</h3>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Chart Container */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                 <h3 className="text-2xl font-bold text-neutral-900">Revenue Performance</h3>
                 <p className="text-neutral-400 text-sm mt-1">Daily revenue trends over the last 30 days</p>
              </div>
              <select className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-brand/10">
                 <option>Last 30 Days</option>
                 <option>Last 6 Months</option>
                 <option>Last Year</option>
              </select>
           </div>
           
           <div className="h-72 w-full relative pt-4 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 1000 250" preserveAspectRatio="none">
                 <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                       <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                 </defs>
                 {/* Grid Lines */}
                 {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="0" y1={`${i * 25}%`} x2="1000" y2={`${i * 25}%`} stroke="#F8FAFC" strokeWidth="1" />
                 ))}
                 <path 
                    d="M0,200 L100,180 L200,190 L300,140 L400,160 L500,100 L600,120 L700,60 L800,80 L900,40 L1000,50 V250 H0 Z" 
                    fill="url(#chartGradient)" 
                 />
                 <path 
                    d="M0,200 L100,180 L200,190 L300,140 L400,160 L500,100 L600,120 L700,60 L800,80 L900,40 L1000,50" 
                    fill="none" 
                    stroke="#2563EB" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                 />
              </svg>
              
              <div className="flex justify-between mt-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                 <span>01 May</span>
                 <span>10 May</span>
                 <span>20 May</span>
                 <span>30 May</span>
              </div>
           </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8 flex flex-col">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-neutral-900">Top Categories</h3>
              <button className="text-neutral-400 hover:text-neutral-900 transition-colors"><MoreVertical size={20} /></button>
           </div>
           
           <div className="space-y-6 flex-1">
              {[
                { name: 'Cashews', sales: 450, color: 'bg-brand' },
                { name: 'Almonds', sales: 380, color: 'bg-purple-600' },
                { name: 'Walnuts', sales: 210, color: 'bg-emerald-600' },
                { name: 'Dried Figs', sales: 180, color: 'bg-orange-600' }
              ].map(cat => (
                <div key={cat.name} className="space-y-2">
                   <div className="flex justify-between text-sm font-bold">
                      <span className="text-neutral-900">{cat.name}</span>
                      <span className="text-neutral-400">{cat.sales} units</span>
                   </div>
                   <div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full transition-all duration-1000`} style={{ width: `${(cat.sales / 500) * 100}%` }}></div>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-8 p-6 bg-neutral-900 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-3 mb-2 relative z-10">
                 <TrendingUp size={16} className="text-brand-light" />
                 <span className="text-xs font-bold text-white uppercase tracking-widest">Growth Insight</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed relative z-10">
                 Monthly retention rate is up <span className="text-success font-bold">+12%</span>. Recommend pushing subscriptions for top categories.
              </p>
           </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm overflow-hidden">
         <div className="px-10 py-8 border-b border-neutral-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
            <div>
               <h3 className="text-2xl font-bold text-neutral-900">Recent Transactions</h3>
               <p className="text-neutral-400 text-sm mt-1">Live feed of orders processed today</p>
            </div>
            <Link to="/dashboard/orders">
               <Button variant="ghost" size="sm" className="text-brand font-bold uppercase tracking-widest">View History</Button>
            </Link>
         </div>
         
         <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left min-w-[800px]">
               <thead>
                  <tr className="bg-neutral-50/50">
                     <th className="px-10 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Order ID</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Customer</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Product</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Amount</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-50">
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                       <td className="px-10 py-5 font-bold text-neutral-900 text-sm">{order.id}</td>
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-brand-50 text-brand flex items-center justify-center text-xs font-bold">
                                {order.customer[0]}
                             </div>
                             <span className="text-sm font-bold text-neutral-700">{order.customer}</span>
                          </div>
                       </td>
                       <td className="px-6 py-5 text-sm text-neutral-500 font-medium">{order.product}</td>
                       <td className="px-6 py-5 text-sm font-bold text-neutral-900">{order.amount}</td>
                       <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                             order.status === 'Delivered' ? 'bg-success-bg text-success' : 
                             order.status === 'Processing' ? 'bg-brand-50 text-brand' : 
                             'bg-orange-50 text-orange-600'
                          }`}>
                             {order.status}
                          </span>
                       </td>
                       <td className="px-10 py-5 text-right">
                          <button className="text-neutral-300 hover:text-brand transition-all transform hover:scale-110 p-2"><ExternalLink size={18} /></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
