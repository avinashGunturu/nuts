import React from 'react';
import { Button } from './Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-white overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-brand-50/40 rounded-full blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-brand-100/20 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-dark mb-8">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-[0.15em] font-sans">New Harvest 2024</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-[100px] font-bold text-neutral-900 leading-[0.9] tracking-tight mb-8">
            Simply <br />
            <span className="text-brand">Royal.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-500 mb-10 max-w-lg leading-relaxed font-light">
            Experience the crunch of W320 Grade Cashews and premium dry fruits. Sourced ethically from the Konkan coast, delivered fresh to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link to="/shop">
              <Button size="lg" className="shadow-2xl shadow-brand/20 w-full sm:w-auto rounded-2xl group">
                Shop Bestsellers <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-8 text-sm text-neutral-500 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand" />
              <span>Grade A Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand" />
              <span>Direct from Farm</span>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="flex-1 relative w-full flex items-center justify-center animate-fade-in delay-200">
          <div className="relative w-full max-w-[550px] aspect-[4/5] md:aspect-[4/5.2] rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-neutral-50 border-[6px] border-white group">
             <img 
               src="https://images.unsplash.com/photo-1596328330761-46820572d421?q=80&w=2000&auto=format&fit=crop"
               alt="Premium Cashews" 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
             />
             
             {/* Featured Item Card */}
             <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-overlay flex items-center justify-between transition-all duration-500 group-hover:bottom-10">
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-[0.2em] mb-1">Featured</p>
                  <p className="text-neutral-900 font-bold text-lg">Royal W320 Cashews</p>
                </div>
                <div className="bg-brand text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-brand/20">
                  ₹849
                </div>
             </div>
          </div>

          {/* Floating Element - Quality badge */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-full shadow-overlay flex flex-col items-center justify-center p-4 text-center border-4 border-brand-50 animate-pulse-slow hidden lg:flex">
             <div className="text-brand font-black text-2xl leading-none">#1</div>
             <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">Quality Choice</div>
          </div>
        </div>

      </div>
    </section>
  );
};