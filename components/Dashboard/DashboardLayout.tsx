
import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Search, Calendar } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top of the dashboard main area whenever the sub-route changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="h-screen bg-neutral-50 flex overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-neutral-100 flex items-center justify-between px-10 shrink-0 z-40">
          <div className="flex items-center gap-8 flex-1">
             <div className="relative w-full max-w-md group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search orders, customers, products..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm font-medium"
                />
             </div>
             
             <div className="hidden lg:flex items-center gap-2 text-neutral-400 font-bold text-xs uppercase tracking-widest">
                <Calendar size={14} />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="flex items-center gap-3 hover:bg-neutral-50 p-2 rounded-2xl transition-colors">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold text-neutral-900 leading-none">Rajesh Verma</p>
                   <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Founder</p>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-100 shadow-sm bg-neutral-100">
                   <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150" alt="Profile" className="w-full h-full object-cover" />
                </div>
             </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main 
          ref={mainContentRef}
          className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA] scroll-smooth"
        >
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
