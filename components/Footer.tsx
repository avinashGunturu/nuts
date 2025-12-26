import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-border pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-bold">KC</div>
              <span className="text-heading-3 tracking-tight font-bold text-brand-dark">KCnuts.</span>
            </div>
            <p className="text-subtext-color text-body max-w-md mb-8">
              Bringing the finest harvest from Indian farms to every Indian home. We source sustainably and deliver quality you can trust.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-dark hover:bg-brand hover:text-white transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-body-bold text-neutral-900 mb-6">Shop</h4>
            <ul className="space-y-4">
              {[
                { name: 'All Products', path: '/shop' },
                { name: 'Best Sellers', path: '/shop' },
                { name: 'Bulk / Wholesale', path: '/corporate' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-subtext-color hover:text-brand transition-colors text-body">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-body-bold text-neutral-900 mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'Our Story', path: '/about' },
                { name: 'Sustainability', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'FAQs', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-subtext-color hover:text-brand transition-colors text-body">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <p className="text-caption text-subtext-color">
              &copy; {new Date().getFullYear()} KCnuts Dry Fruits. Made with love in India.
            </p>
            <span className="hidden md:block text-neutral-300">|</span>
            {/* <Link 
              to="/dashboard" 
              className="text-caption text-neutral-400 hover:text-brand transition-colors flex items-center gap-1 opacity-60 hover:opacity-100"
            >
              <Lock size={12} /> Admin Portal
            </Link> */}
          </div>
          <div className="flex items-center gap-2 text-caption text-subtext-color">
            <Mail size={14} />
            <span>hello@kcnuts.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};