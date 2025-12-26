import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, ArrowRight, TrendingUp, User, LogOut, Package, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../constants';

interface HeaderProps {
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const { openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset state on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
    setSearchQuery('');
  }, [location]);

  // Lock body scroll when overlays are open
  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen, isMobileMenuOpen]);

  const isHome = location.pathname === '/';
  
  // Header styles based on state
  const headerBgClass = isScrolled || !isHome || isMobileMenuOpen 
    ? 'bg-white/95 backdrop-blur-xl border-neutral-100 shadow-sm py-4' 
    : 'bg-transparent border-transparent py-7';
  
  const textColorClass = 'text-neutral-900';
  const navHoverClass = 'hover:text-brand';

  // Search Logic
  const searchResults = searchQuery.trim().length > 0 
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const popularSearches = ['Cashews', 'Almonds', 'Pistachios', 'Healthy Snacks'];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${headerBgClass}`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 z-50 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 bg-brand text-white group-hover:bg-brand-dark group-hover:rotate-6 text-xl shadow-lg shadow-brand/20">
              KC
            </div>
            <span className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors ${textColorClass}`}>
              KCnuts.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {[
              { name: 'Shop', path: '/shop' },
              { name: 'About', path: '/about' },
              { name: 'Wholesale', path: '/corporate' },
              { name: 'Contact', path: '/contact' }
            ].map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-sm lg:text-base font-bold uppercase tracking-widest transition-colors ${textColorClass} ${navHoverClass}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-5">
             <button 
               onClick={() => setIsSearchOpen(true)}
               className={`p-2 transition-all hover:scale-110 ${textColorClass} hover:text-brand`}
               aria-label="Search"
             >
              <Search size={24} />
             </button>

             {/* User Account */}
             <div className="relative">
                {isAuthenticated ? (
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-2 p-1 rounded-full border border-neutral-200 hover:border-brand transition-all ${isUserMenuOpen ? 'bg-brand text-white' : 'bg-white text-neutral-900'}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${isUserMenuOpen ? 'bg-white text-brand' : 'bg-brand text-white shadow-md'}`}>
                      {user?.name?.[0]}
                    </div>
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    className={`p-2 transition-all hover:scale-110 ${textColorClass} hover:text-brand`}
                    aria-label="Account"
                  >
                    <User size={24} />
                  </Link>
                )}

                {/* User Dropdown */}
                {isUserMenuOpen && isAuthenticated && (
                  <div className="absolute top-[calc(100%+16px)] right-0 w-72 bg-white rounded-3xl shadow-overlay border border-neutral-100 p-3 animate-fade-in origin-top-right z-50">
                    <div className="px-5 py-5 border-b border-neutral-50 mb-2">
                      <p className="text-sm font-bold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-xs text-neutral-400 truncate mt-1">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-brand transition-all">
                        <Package size={18} /> Order History
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-brand transition-all">
                        <Settings size={18} /> User Settings
                      </Link>
                      <div className="pt-2 mt-2 border-t border-neutral-50">
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-error hover:bg-error-bg transition-all"
                        >
                          <LogOut size={18} /> Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
             </div>
             
             <button 
               onClick={openCart}
               className={`relative p-2 transition-all hover:scale-110 ${textColorClass} hover:text-brand`}
               aria-label="Cart"
             >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Toggle */}
            <button 
              className={`md:hidden z-50 p-2 transition-colors ${textColorClass}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-white z-40 flex flex-col pt-32 px-8 animate-fade-in">
              <nav className="flex flex-col gap-6">
                 {[
                   { name: 'Shop', path: '/shop' },
                   { name: 'About', path: '/about' },
                   { name: 'Wholesale', path: '/corporate' },
                   { name: 'Contact', path: '/contact' }
                 ].map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-bold text-neutral-900 tracking-tight"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-6 mt-6 border-t border-neutral-100 flex flex-col gap-6">
                  {isAuthenticated ? (
                    <>
                      <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-brand tracking-tight">Your Orders</Link>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-brand tracking-tight">Profile Settings</Link>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-brand tracking-tight">Sign In / Join</Link>
                  )}
                </div>
              </nav>
              <div className="mt-auto mb-12 pt-8">
                 <button onClick={() => { setIsMobileMenuOpen(false); openCart(); }} className="flex items-center justify-between w-full bg-brand text-white p-6 rounded-[2rem] shadow-xl shadow-brand/20">
                  <span className="text-lg font-bold">Open Cart</span>
                  <div className="flex items-center gap-3">
                     <ShoppingBag size={24} />
                     <span className="font-bold">({cartCount})</span>
                  </div>
                 </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white/98 backdrop-blur-xl z-[100] flex flex-col animate-fade-in">
          <div className="border-b border-neutral-100 bg-white shadow-sm">
            <div className="container mx-auto px-6 md:px-12 h-28 flex items-center gap-6">
               <Search className="text-neutral-400 flex-shrink-0" size={36} />
               <input 
                 autoFocus
                 type="text"
                 placeholder="What are you looking for?"
                 className="flex-1 text-2xl md:text-4xl font-medium outline-none placeholder:text-neutral-300 text-neutral-900 bg-transparent h-full"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <button 
                 onClick={() => setIsSearchOpen(false)}
                 className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all duration-300 hover:rotate-90 flex-shrink-0"
               >
                 <X size={32} />
               </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-neutral-50/50 p-6 md:p-16">
             <div className="container mx-auto max-w-5xl">
                {searchQuery.trim().length === 0 && (
                   <div className="mt-8">
                      <p className="text-sm font-bold text-neutral-400 uppercase tracking-[0.2em] mb-8">Quick Search</p>
                      <div className="flex flex-wrap gap-4">
                        {popularSearches.map(term => (
                          <button 
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="flex items-center gap-3 px-8 py-4 bg-white rounded-full border border-neutral-200 text-neutral-700 font-bold hover:border-brand hover:text-brand hover:shadow-overlay transition-all"
                          >
                            <TrendingUp size={18} className="text-brand" />
                            {term}
                          </button>
                        ))}
                      </div>
                   </div>
                )}

                {searchQuery.trim().length > 0 && (
                   <div className="space-y-6">
                      {searchResults.length > 0 ? (
                        <>
                           <p className="text-lg text-neutral-500 mb-8 font-light">Found <span className="font-bold text-neutral-900">{searchResults.length}</span> results for your query</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {searchResults.map(product => (
                                 <Link 
                                   key={product.id} 
                                   to={`/product/${product.id}`}
                                   onClick={() => setIsSearchOpen(false)}
                                   className="flex items-center p-5 bg-white rounded-3xl border border-neutral-100 hover:border-brand hover:shadow-overlay transition-all group animate-fade-in-up"
                                 >
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-neutral-50 flex-shrink-0 border border-neutral-100">
                                       <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="ml-8 flex-1">
                                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{product.category}</p>
                                       <h4 className="text-xl font-bold text-neutral-900 group-hover:text-brand transition-colors line-clamp-1">{product.name}</h4>
                                       <div className="flex items-center gap-4 mt-3">
                                          <span className="text-brand font-black text-xl">₹{product.price}</span>
                                          <span className="text-sm text-neutral-400 font-medium">/ {product.weight}</span>
                                       </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand group-hover:text-white transition-all transform group-hover:translate-x-2 shadow-sm">
                                       <ArrowRight size={24} />
                                    </div>
                                 </Link>
                              ))}
                           </div>
                        </>
                      ) : (
                         <div className="text-center py-24">
                            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8 text-neutral-300">
                              <Search size={48} />
                            </div>
                            <h3 className="text-3xl font-bold text-neutral-900 mb-3 tracking-tight">Nothing found</h3>
                            <p className="text-neutral-500 text-xl font-light">We couldn't find any harvest matching "{searchQuery}".<br/>Try searching for almonds, cashews, or pistachios.</p>
                         </div>
                      )}
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </>
  );
};