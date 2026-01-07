import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Calendar, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Scroll to top of the dashboard main area whenever the sub-route changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="h-screen bg-neutral-50 flex overflow-hidden">
      {/* Desktop Sidebar (hidden on mobile via its own class) */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={true}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 lg:h-24 bg-white border-b border-neutral-100 flex items-center justify-between px-4 sm:px-6 lg:px-10 shrink-0 z-30">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            {/* Hamburger Menu (mobile only) */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-neutral-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <Calendar size={14} className="hidden sm:block" />
              <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span className="sm:hidden">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-2xl transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-neutral-900 leading-none">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{user?.role || 'Admin'}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-neutral-100 shadow-sm bg-neutral-100">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin User')}&background=random`} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-[#FAFAFA] scroll-smooth"
        >
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

