import React from 'react';
import { Leaf, Award, Heart } from 'lucide-react';

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
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 mb-6">
                <span className="w-2 h-2 rounded-full bg-brand"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Est. 2010</span>
             </div>
             <h1 className="text-6xl md:text-8xl font-bold text-neutral-900 mb-8 leading-[0.95] tracking-tight">
               Cultivating <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-vivid">Goodness.</span>
             </h1>
             <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl leading-relaxed font-light">
               We are on a mission to bridge the gap between India's finest orchards and your daily nutrition, one crunch at a time.
             </p>
           </div>
        </div>
      </section>

      {/* Visual Collage */}
      <section className="pb-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
             {/* Main Image */}
             <div className="md:col-span-8 h-[400px] md:h-full rounded-[40px] overflow-hidden relative group shadow-2xl shadow-neutral-100">
                <img 
                  src="https://images.unsplash.com/photo-1525458607106-25f053530869?q=80&w=2000&auto=format&fit=crop" 
                  alt="Premium Cashews" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                   <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">The Harvest</p>
                   <p className="text-3xl font-bold">Ratnagiri, Maharashtra</p>
                </div>
             </div>
             
             {/* Side Column */}
             <div className="md:col-span-4 flex flex-col gap-6 h-full">
                <div className="flex-1 h-[300px] md:h-auto rounded-[40px] overflow-hidden relative group shadow-xl shadow-neutral-100">
                   <img 
                     src="https://images.unsplash.com/photo-1508061253366-f7da158b6d90?q=80&w=800&auto=format&fit=crop" 
                     alt="Sorting Process" 
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                   />
                </div>
                <div className="flex-1 bg-neutral-900 rounded-[40px] p-10 flex flex-col justify-center items-center text-center shadow-xl shadow-neutral-200 relative overflow-hidden">
                   <div className="absolute inset-0 bg-brand opacity-10 blur-xl scale-150"></div>
                   <div className="relative z-10">
                      <div className="text-6xl font-bold text-white mb-2">1M+</div>
                      <div className="text-neutral-400 font-medium uppercase tracking-widest text-sm">Happy Families Served</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-neutral-50/50">
        <div className="container mx-auto px-6 md:px-12">
           <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 tracking-tight">Our Core Values</h2>
             <p className="text-lg text-neutral-500 leading-relaxed">We believe in transparency, quality, and community. These aren't just words; they are the pillars of our existence and the promise we make to you.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Leaf, 
                  title: "Ethically Sourced", 
                  desc: "We work directly with local farmers, ensuring fair trade prices and supporting sustainable farming practices that protect our soil." 
                },
                { 
                  icon: Award, 
                  title: "Premium Grade", 
                  desc: "Only the top 5% of the harvest makes it to your box. Our nuts are rigorously tested for size, taste, moisture, and crunch." 
                },
                { 
                  icon: Heart, 
                  title: "Customer First", 
                  desc: "We don't just sell nuts; we build relationships. From packaging to delivery, your satisfaction is our absolute obsession." 
                }
              ].map((val, i) => (
                <div key={i} className="bg-white p-10 rounded-[32px] border border-neutral-100 shadow-sm hover:shadow-overlay transition-all duration-300 hover:-translate-y-1 group">
                   <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand mb-8 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                     <val.icon size={32} strokeWidth={1.5} />
                   </div>
                   <h3 className="text-2xl font-bold text-neutral-900 mb-4">{val.title}</h3>
                   <p className="text-neutral-500 leading-relaxed">{val.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Story Sections */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 space-y-32">
           {/* Section 1 */}
           <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
              <div className="flex-1 w-full relative group">
                 <div className="absolute top-4 left-4 w-full h-full border-2 border-brand-100 rounded-[40px] -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000" 
                   alt="The Beginning" 
                   className="w-full rounded-[40px] shadow-2xl"
                 />
              </div>
              <div className="flex-1">
                 <span className="text-brand font-bold uppercase tracking-widest text-xs mb-2 block">Our Origins</span>
                 <h2 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900">From Ratnagiri to the World</h2>
                 <div className="space-y-6 text-lg text-neutral-600 font-light leading-relaxed">
                   <p>It started in 2010 with a single orchard in the coastal town of Ratnagiri. Our founder noticed that the best quality produce often left the country, leaving locals with second-grade options.</p>
                   <p>KCnuts was born to change this narrative. We wanted to bring the "Export Quality" experience to every Indian household. Today, we bridge the gap between hard-working farmers and health-conscious families.</p>
                 </div>
              </div>
           </div>

           {/* Section 2 */}
           <div className="flex flex-col md:flex-row-reverse items-center gap-16 md:gap-24">
              <div className="flex-1 w-full relative group">
                 <div className="absolute top-4 right-4 w-full h-full border-2 border-neutral-200 rounded-[40px] -z-10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:translate-y-2"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1627916538053-9a3b2b80f84a?q=80&w=1000" 
                   alt="Innovation" 
                   className="w-full rounded-[40px] shadow-2xl"
                 />
              </div>
              <div className="flex-1">
                 <span className="text-brand font-bold uppercase tracking-widest text-xs mb-2 block">Our Method</span>
                 <h2 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900">Innovation meets Tradition</h2>
                 <div className="space-y-6 text-lg text-neutral-600 font-light leading-relaxed">
                   <p>While we respect traditional farming methods, we embrace modern processing. Our facility uses advanced optical sorting to ensure every nut is uniform in size and color.</p>
                   <p>We've also pioneered nitrogen-flushed packaging that keeps our products fresh for months without a single preservative, retaining the natural oils and crunch you love.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Global Impact / Stats */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
         {/* Abstract BG */}
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
         
         <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Making a Difference</h2>
               <p className="text-neutral-400 max-w-2xl mx-auto">Every packet you buy supports a sustainable ecosystem of farmers, processors, and nature.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
               {[
                  { val: "14+", label: "Years of Trust" },
                  { val: "50k+", label: "Trees Planted" },
                  { val: "100%", label: "Plastic Neutral" },
                  { val: "20k", label: "Pincodes Served" }
               ].map((s, i) => (
                 <div key={i} className="flex flex-col items-center group">
                    <div className="text-5xl md:text-6xl font-bold text-brand-light mb-4 group-hover:scale-110 transition-transform duration-300">{s.val}</div>
                    <div className="text-neutral-400 font-medium tracking-widest uppercase text-xs border-t border-white/10 pt-4 w-24">{s.label}</div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Team / Founder Quote */}
      <section className="py-24 bg-brand-50">
        <div className="container mx-auto px-6 md:px-12 text-center">
           <div className="max-w-4xl mx-auto bg-white p-12 md:p-16 rounded-[40px] shadow-xl relative">
              <div className="text-brand opacity-20 absolute top-8 left-8">
                 <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01699V12.9996H12.017V8.9996H9.01699V5H5.01699V8.9996H2.01699V18C2.01699 19.6569 3.36014 21 5.01699 21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16.017V12.9996H19.017V8.9996H16.017V5H12.017V8.9996H9.01699V18C9.01699 19.6569 10.3601 21 12.017 21H21.017Z" /></svg>
              </div>
              <p className="text-2xl md:text-3xl font-light text-neutral-800 italic leading-relaxed mb-8 relative z-10">
                "Our goal isn't to be the biggest dry fruit company in India. It is to be the most trusted one. When you see the KCnuts logo, you should know exactly what you're getting: purity, love, and tradition."
              </p>
              <div className="flex items-center justify-center gap-4">
                 <div className="w-12 h-12 bg-neutral-200 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150" alt="Founder" />
                 </div>
                 <div className="text-left">
                    <div className="font-bold text-neutral-900">Rajesh Verma</div>
                    <div className="text-sm text-neutral-500">Founder & CEO</div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};