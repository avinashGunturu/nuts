import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Adjusted path to ../../context if in components/Dashboard

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

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
            {/* Left side spacer or Date can go here, or just Date */}
            <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs uppercase tracking-widest">
              <Calendar size={14} />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 p-2 rounded-2xl transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-neutral-900 leading-none">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{user?.role || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-100 shadow-sm bg-neutral-100">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
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
