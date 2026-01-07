import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-border pt-12 pb-6">
      <div className="container mx-auto px-6 md:px-12">
        {/* Main Footer Grid - All columns in one row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 mb-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-bold text-sm">KC</div>
              <span className="text-lg tracking-tight font-bold text-brand-dark">KCnuts.</span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed mb-4 max-w-xs">
              Premium dry fruits from Indian farms to your home.
            </p>
            <div className="flex gap-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-brand hover:text-white transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-4 text-sm">Shop</h4>
            <ul className="space-y-2">
              {[
                { name: 'All Products', path: '/shop' },
                { name: 'Best Sellers', path: '/shop' },
                { name: 'Wholesale', path: '/corporate' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-neutral-500 hover:text-brand transition-colors text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-neutral-500 hover:text-brand transition-colors text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-4 text-sm">Policies</h4>
            <ul className="space-y-2">
              {[
                { name: 'Privacy', path: '/privacy-policy' },
                { name: 'Terms', path: '/terms-conditions' },
                { name: 'Refunds', path: '/refund-policy' },
                { name: 'Shipping', path: '/shipping-policy' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-neutral-500 hover:text-brand transition-colors text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-4 text-sm">Contact</h4>
            <div className="space-y-2">
              <a href="tel:+919440829165" className="text-neutral-500 hover:text-brand transition-colors text-sm block">
                +91 94408 29165
              </a>
              <a href="mailto:Mahindracashewproducts@gmail.com" className="text-neutral-500 hover:text-brand transition-colors text-sm block break-all">
                Mahindracashewproducts@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-neutral-200 gap-2">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} KC NUTS (Mahindra Cashew Products). Made with ❤️ in India.
          </p>
          <p className="text-xs text-neutral-400">
            Srikakulam, Andhra Pradesh
          </p>
        </div>
      </div>
    </footer>
  );
};