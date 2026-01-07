import React from 'react';
import { Button } from './Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center bg-white overflow-hidden pt-32 pb-12 md:pt-44 md:pb-16">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-brand-50/40 rounded-full blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-brand-100/20 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-10 lg:gap-16">

        {/* Left Content */}
        <div className="w-full flex-1 flex flex-col items-start z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-dark mb-5">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-[0.15em] font-sans">KC NUTS</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.05] tracking-tight mb-4">
            Crafted Cashews.<br />
            <span className="text-brand">Consistent Quality.</span><br />
            <span className="text-neutral-700">Trusted Supply.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-500 mb-6 max-w-lg leading-relaxed font-light">
            Premium cashew kernels from our own processing facility. Strict quality control, consistent grading, and pan-India supply for retail, wholesale, and export.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/shop">
              <Button size="lg" className="shadow-xl shadow-brand/20 w-full sm:w-auto rounded-xl min-w-[160px] group">
                Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
            <Link to="/corporate">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl min-w-[160px]">
                Bulk Orders
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand" />
              <span>Factory Processed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand" />
              <span>Uniform Grades</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand" />
              <span>Bulk & Retail</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand" />
              <span>Pan-India</span>
            </div>
          </div>
        </div>

        {/* Right Visual - Compact */}
        <div className="flex-1 relative w-full flex items-center justify-center animate-fade-in delay-200">
          <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 border-4 border-white group">
            <img
              src="https://storage.googleapis.com/kcnuts-assets/kcnuts.jpeg"
              alt="Premium Cashews"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Featured Item Card */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between transition-all duration-500 group-hover:bottom-5">
              <div>
                <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-[0.15em] mb-0.5">Premium Selection</p>
                <p className="text-neutral-900 font-bold text-base">KC NUTS Cashews</p>
              </div>
              <div className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Grade A
              </div>
            </div>
          </div>

          {/* Floating Element - Quality badge */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full shadow-lg flex flex-col items-center justify-center p-3 text-center border-4 border-brand-50 hidden lg:flex">
            <div className="text-brand font-black text-xl leading-none">#1</div>
            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight mt-1">Quality Choice</div>
          </div>
        </div>

      </div>
    </section>
  );
};