
import React, { useEffect, useState } from 'react';
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
   Plus,
   Loader
} from 'lucide-react';
import { Button } from '../../components/Button';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface DashboardStats {
   stats: {
      totalRevenue: number;
      revenueGrowth: number;
      totalOrders: number;
      ordersGrowth: number;
      totalUsers: number;
      usersGrowth: number;
      avgOrderValue: number;
   };
   salesChart: { _id: string; total: number }[];
   topCategories: { name: string; sales: number }[];
   recentOrders: any[];
}

export const DashboardOverview: React.FC = () => {
   const { user } = useAuth();
   const [data, setData] = useState<DashboardStats | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const response = await axios.get('https://nutsb.onrender.com/api/admin/dashboard/stats', {
               withCredentials: true
            });
            if (response.data.success) {
               setData(response.data.data);
            }
         } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast.error('Failed to load dashboard stats');
         } finally {
            setLoading(false);
         }
      };

      fetchStats();
   }, []);

   if (loading) {
      return (
         <div className="h-96 flex flex-col items-center justify-center text-neutral-400">
            <Loader className="animate-spin mb-4" size={32} />
            <p>Loading dashboard analytics...</p>
         </div>
      );
   }

   if (!data) return null;

   const STATS = [
      {
         label: 'Total Revenue',
         value: `₹${data.stats.totalRevenue.toLocaleString()}`,
         change: `${data.stats.revenueGrowth > 0 ? '+' : ''}${data.stats.revenueGrowth}%`,
         isPositive: data.stats.revenueGrowth >= 0,
         icon: IndianRupee,
         color: 'text-brand'
      },
      {
         label: 'Total Orders',
         value: data.stats.totalOrders.toLocaleString(),
         change: `${data.stats.ordersGrowth > 0 ? '+' : ''}${data.stats.ordersGrowth}%`,
         isPositive: data.stats.ordersGrowth >= 0,
         icon: ShoppingBag,
         color: 'text-purple-600'
      },
      {
         label: 'Total Users',
         value: data.stats.totalUsers.toLocaleString(),
         change: `${data.stats.usersGrowth > 0 ? '+' : ''}${data.stats.usersGrowth}%`,
         isPositive: data.stats.usersGrowth >= 0,
         icon: Users,
         color: 'text-emerald-600'
      },
      {
         label: 'Avg. Order Value',
         value: `₹${data.stats.avgOrderValue.toLocaleString()}`,
         change: '0%',
         isPositive: true,
         icon: TrendingUp,
         color: 'text-orange-600'
      },
   ];

   // Helper to normalize chart data
   const maxSales = Math.max(...data.salesChart.map(d => d.total), 1);
   const chartPoints = data.salesChart.map((d, i) => {
      const x = (i / (data.salesChart.length - 1 || 1)) * 1000;
      const y = 250 - (d.total / maxSales) * 200; // Scale to fit height
      return `${x},${y}`;
   }).join(' ');
   const chartPath = `M0,250 ${chartPoints ? 'L' + chartPoints : ''} V250 H0 Z`;
   const linePath = chartPoints ? `M${chartPoints.split(' ')[0]} L${chartPoints.split(' ').slice(1).join(' L')}` : '';

   return (
      <div className="space-y-10 animate-fade-in pb-10">

         {/* Welcome Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="min-w-0">
               <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">Dashboard Overview</h1>
               <p className="text-neutral-500 mt-2 font-medium">Welcome back, {user?.name.split(' ')[0]}! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
               {/* <Button variant="outline" size="sm" className="bg-white whitespace-nowrap">Download Reports</Button> */}
               <Link to="/dashboard/products/add">
                  <Button variant="black" size="md" className="flex items-center gap-2 shadow-xl shadow-neutral-900/10">
                     <Plus size={20} /> Add Product
                  </Button>
               </Link>
            </div>
         </div>

         {/* Stats Grid */}
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
                  </select>
               </div>

               <div className="h-72 w-full relative pt-4 overflow-hidden">
                  {data.salesChart.length > 0 ? (
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
                           d={chartPath}
                           fill="url(#chartGradient)"
                        />
                        <path
                           d={linePath}
                           fill="none"
                           stroke="#2563EB"
                           strokeWidth="3"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  ) : (
                     <div className="h-full flex items-center justify-center text-neutral-300 font-bold">No sales data available</div>
                  )}
               </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8 flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-neutral-900">Top Categories</h3>
                  <button className="text-neutral-400 hover:text-neutral-900 transition-colors"><MoreVertical size={20} /></button>
               </div>

               <div className="space-y-6 flex-1">
                  {data.topCategories.length > 0 ? data.topCategories.map((cat, index) => {
                     const colors = ['bg-brand', 'bg-purple-600', 'bg-emerald-600', 'bg-orange-600'];
                     const color = colors[index % colors.length];
                     const maxVal = Math.max(...data.topCategories.map(c => c.sales));

                     return (
                        <div key={cat.name} className="space-y-2">
                           <div className="flex justify-between text-sm font-bold">
                              <span className="text-neutral-900 capitalize">{cat.name}</span>
                              <span className="text-neutral-400">{cat.sales} units</span>
                           </div>
                           <div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
                              <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${(cat.sales / maxVal) * 100}%` }}></div>
                           </div>
                        </div>
                     );
                  }) : (
                     <p className="text-center text-neutral-400 text-sm py-10">No category data yet.</p>
                  )}
               </div>

               <div className="mt-8 p-6 bg-neutral-900 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 rounded-full blur-2xl"></div>
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                     <TrendingUp size={16} className="text-brand-light" />
                     <span className="text-xs font-bold text-white uppercase tracking-widest">Growth Insight</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed relative z-10">
                     {data.stats.usersGrowth > 0
                        ? `New users up by <span class="text-success font-bold">+${data.stats.usersGrowth}%</span>. Strong customer acquisition.`
                        : 'User growth is steady. Focus on retention campaigns.'}
                  </p>
               </div>
            </div>
         </div>

         {/* Latest Orders Section - New Addition */}
         <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-neutral-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
               <div>
                  <h3 className="text-2xl font-bold text-neutral-900">Latest Orders</h3>
                  <p className="text-neutral-400 text-sm mt-1">Quick view of the most recent activity</p>
               </div>
               <Link to="/dashboard/orders">
                  <Button variant="ghost" size="sm" className="text-brand font-bold uppercase tracking-widest">View All</Button>
               </Link>
            </div>

            <div className="overflow-x-auto min-w-full">
               <table className="w-full text-left min-w-[800px]">
                  <thead>
                     <tr className="bg-neutral-50/50">
                        <th className="px-10 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Order ID</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Customer</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Amount</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-10 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                     {data.recentOrders.slice(0, 5).length > 0 ? data.recentOrders.slice(0, 5).map((order) => (
                        <tr key={`latest-${order._id}`} className="hover:bg-neutral-50/50 transition-colors">
                           <td className="px-10 py-5 font-bold text-neutral-900 text-xs text-brand font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-brand-50 text-brand flex items-center justify-center text-xs font-bold uppercase">
                                    {order.user?.name?.[0] || 'U'}
                                 </div>
                                 <span className="text-sm font-bold text-neutral-700">{order.user?.name || 'Unknown User'}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-sm text-neutral-500 font-medium whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString()}
                           </td>
                           <td className="px-6 py-5 text-sm font-bold text-neutral-900">₹{order.finalAmount}</td>
                           <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'bg-success-bg text-success' :
                                 order.status === 'processing' ? 'bg-brand-50 text-brand' :
                                    'bg-orange-50 text-orange-600'
                                 }`}>
                                 {order.status}
                              </span>
                           </td>
                           <td className="px-10 py-5 text-right">
                              <Link to={`/dashboard/orders/${order._id}`}>
                                 <button className="text-neutral-300 hover:text-brand transition-all transform hover:scale-110 p-2"><ExternalLink size={18} /></button>
                              </Link>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={6} className="px-10 py-8 text-center text-neutral-400 text-sm">No recent orders found.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
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
                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Amount</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-10 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                     {data.recentOrders.length > 0 ? data.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors">
                           <td className="px-10 py-5 font-bold text-neutral-900 text-xs text-brand font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-brand-50 text-brand flex items-center justify-center text-xs font-bold uppercase">
                                    {order.user?.name?.[0] || 'U'}
                                 </div>
                                 <span className="text-sm font-bold text-neutral-700">{order.user?.name || 'Unknown User'}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-sm text-neutral-500 font-medium whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString()}
                           </td>
                           <td className="px-6 py-5 text-sm font-bold text-neutral-900">₹{order.finalAmount}</td>
                           <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'bg-success-bg text-success' :
                                 order.status === 'processing' ? 'bg-brand-50 text-brand' :
                                    'bg-orange-50 text-orange-600'
                                 }`}>
                                 {order.status}
                              </span>
                           </td>
                           <td className="px-10 py-5 text-right">
                              <Link to={`/dashboard/orders/${order._id}`}>
                                 <button className="text-neutral-300 hover:text-brand transition-all transform hover:scale-110 p-2"><ExternalLink size={18} /></button>
                              </Link>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={6} className="px-10 py-8 text-center text-neutral-400 text-sm">No recent orders found.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
