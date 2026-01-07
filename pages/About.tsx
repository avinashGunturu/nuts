import React from 'react';
import { Factory, Award, Shield, Handshake, Target, CheckCircle2, Package, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const About: React.FC = () => {
   return (
      <div className="min-h-screen bg-white">
         {/* Hero Section */}
         <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-brand/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-warning/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
               <div className="max-w-4xl animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand mb-6">
                     <Factory size={14} />
                     <span className="text-xs font-bold uppercase tracking-wider">Mahindra Cashew Products</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-8 leading-[0.95] tracking-tight">
                     About <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-vivid">KC NUTS</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-neutral-500 max-w-3xl leading-relaxed font-light">
                     KC NUTS is a brand from <strong className="text-neutral-700">Mahindra Cashew Products</strong>, engaged in processing and supplying premium quality cashew kernels.
                  </p>
               </div>
            </div>
         </section>

         {/* What Makes Us Different */}
         <section className="py-20 bg-neutral-50/50">
            <div className="container mx-auto px-6 md:px-12">
               <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                  {/* Left: Content */}
                  <div className="flex-1">
                     <span className="text-brand font-bold uppercase tracking-widest text-xs mb-3 block">What Makes Us Different</span>
                     <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">Factory-Processed, Not Trading-Based</h2>
                     <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                        Unlike trading-based brands, we focus on factory-processed cashews, ensuring <strong>uniform grading</strong>, <strong>controlled moisture levels</strong>, and <strong>hygienic handling</strong> at every stage.
                     </p>
                     <p className="text-lg text-neutral-600 leading-relaxed">
                        With experience in raw cashew sourcing, processing, and bulk distribution, KC NUTS is built to serve domestic and international markets.
                     </p>
                  </div>

                  {/* Right: Image */}
                  <div className="flex-1 w-full">
                     <div className="rounded-3xl overflow-hidden shadow-2xl">
                        <img
                           src="https://storage.googleapis.com/kcnuts-assets/factory_outlet.jpeg"
                           alt="Cashew Processing"
                           className="w-full h-[400px] object-cover"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Our Operations Emphasize */}
         <section className="py-24 bg-white">
            <div className="container mx-auto px-6 md:px-12">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">Our Operations Emphasize</h2>
                  <p className="text-neutral-500 text-lg">Core principles that drive everything we do.</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                     {
                        icon: CheckCircle2,
                        title: "Quality Consistency",
                        desc: "Every batch meets the same high standards through rigorous quality control.",
                        color: "bg-green-50 text-green-600"
                     },
                     {
                        icon: Shield,
                        title: "Food Safety",
                        desc: "Hygienic processing environment with strict safety protocols at every stage.",
                        color: "bg-blue-50 text-blue-600"
                     },
                     {
                        icon: Package,
                        title: "Reliable Supply",
                        desc: "Consistent availability and timely dispatch for all order sizes.",
                        color: "bg-purple-50 text-purple-600"
                     },
                     {
                        icon: Handshake,
                        title: "Long-term Relationships",
                        desc: "We build partnerships, not just transactions, with our buyers.",
                        color: "bg-orange-50 text-orange-600"
                     }
                  ].map((val, i) => (
                     <div key={i} className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className={`w-14 h-14 ${val.color} rounded-xl flex items-center justify-center mb-6`}>
                           <val.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-3">{val.title}</h3>
                        <p className="text-neutral-500 leading-relaxed">{val.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Vision Section */}
         <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
            {/* Abstract BG */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
               <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                     <div className="w-24 h-24 bg-brand/20 rounded-2xl flex items-center justify-center">
                        <Target size={48} className="text-brand-light" />
                     </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                     <span className="text-brand-light font-bold uppercase tracking-widest text-xs mb-3 block">Our Vision</span>
                     <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        To build a trusted Indian cashew brand delivering consistent quality for retail, wholesale, and export markets.
                     </h2>
                     <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">
                        We aim to be the preferred choice for quality-conscious buyers across India and beyond, backed by our commitment to excellence in processing and customer service.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* Markets We Serve */}
         <section className="py-24 bg-white">
            <div className="container mx-auto px-6 md:px-12">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">Markets We Serve</h2>
                  <p className="text-neutral-500 text-lg">From local retailers to international buyers.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                     {
                        icon: Package,
                        title: "Retail",
                        desc: "Premium packaged cashews for supermarkets, grocery stores, and online platforms.",
                     },
                     {
                        icon: Factory,
                        title: "Wholesale",
                        desc: "Bulk supply for traders, sweet manufacturers, HoReCa buyers, and food processors.",
                     },
                     {
                        icon: Globe,
                        title: "Export",
                        desc: "Quality kernels meeting international standards for global buyers.",
                     }
                  ].map((item, i) => (
                     <div key={i} className="bg-brand-50 p-8 rounded-2xl border border-brand-100 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center mx-auto mb-6 text-white">
                           <item.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                        <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                     </div>
                  ))}
               </div>

               {/* CTA */}
               <div className="mt-12 text-center space-x-4">
                  <Link to="/shop">
                     <Button size="lg">Shop Now</Button>
                  </Link>
                  <Link to="/corporate">
                     <Button variant="outline" size="lg">Wholesale Inquiry</Button>
                  </Link>
               </div>
            </div>
         </section>
      </div>
   );
};