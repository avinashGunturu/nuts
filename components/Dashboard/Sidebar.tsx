
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Box, 
  LogOut,
  ChevronRight,
  CreditCard,
  MessageSquare,
  Briefcase
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: ShoppingBag, label: 'Orders', path: '/dashboard/orders' },
  { icon: CreditCard, label: 'Transactions', path: '/dashboard/transactions' },
  { icon: Box, label: 'Products', path: '/dashboard/products' },
  { icon: Users, label: 'Customers', path: '/dashboard/customers' },
  { icon: Briefcase, label: 'Wholesale', path: '/dashboard/wholesale-requests' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/contact-requests' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-72 bg-white border-r border-neutral-100 h-screen flex flex-col sticky top-0">
      {/* Sidebar Header */}
      <div className="p-8 pb-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand/20 group-hover:rotate-6 transition-transform">
            KC
          </div>
          <span className="text-2xl font-bold tracking-tight text-neutral-900">Admin.</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && (item.path !== '/dashboard' || location.pathname === '/dashboard');
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive ? 'text-white' : 'text-neutral-400 group-hover:text-brand'} />
                <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      {/* Account Actions Section */}
      <div className="px-4 py-8 space-y-1 border-t border-neutral-50">
        <p className="px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4">Session</p>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-error hover:bg-error-bg transition-all duration-300 group">
          <LogOut size={20} />
          <span className="font-bold text-sm uppercase tracking-wider">Sign Out</span>
        </button>
      </div>

      {/* User Mini Profile */}
      <div className="p-6 mt-auto">
        <div className="bg-neutral-50 rounded-3xl p-4 flex items-center gap-3 border border-neutral-100">
          <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900 truncate">Admin User</p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
