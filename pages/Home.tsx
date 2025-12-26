import React from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { PRODUCTS } from '../constants';
import { Truck, ShieldCheck, MapPin, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { addToCart } = useCart();

  return (
    <>
      <Hero />

      {/* Features / Value Props */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MapPin, title: "Pan-India Delivery", text: "20,000+ pincodes" },
              { icon: ShieldCheck, title: "Quality First", text: "Grade A Certified" },
              { icon: Leaf, title: "Sustainably Sourced", text: "Direct from farms" },
              { icon: Truck, title: "Express Shipping", text: "Free over ₹999" },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-5 p-6 rounded-2xl border border-transparent hover:border-neutral-100 hover:bg-neutral-50 transition-all duration-300">
                <div className="p-4 rounded-full bg-brand-50 text-brand">
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-0.5">{feature.title}</h3>
                  <p className="text-sm text-neutral-500">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section id="shop" className="py-24 bg-neutral-50/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-brand font-bold tracking-widest uppercase text-sm mb-4 block">Selected for You</span>
              <h2 className="text-heading-2 md:text-heading-1 text-neutral-900 tracking-tight">Best Sellers</h2>
            </div>
            <Link to="/shop" className="hidden md:inline-block">
              <Button variant="outline" className="rounded-full px-8">
                View All Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {PRODUCTS.slice(0, 6).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
              />
            ))}
          </div>
           
           <div className="mt-16 text-center md:hidden">
              <Link to="/shop">
                <Button variant="outline" className="w-full">View All Products</Button>
              </Link>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Brand Story (Enhanced) - Immersive Parallax */}
      <section className="relative min-h-[85vh] flex items-center bg-neutral-900 overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=2500&auto=format&fit=crop')",
          }}
        >
           {/* Overlays for readability */}
           <div className="absolute inset-0 bg-neutral-900/50"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-transparent"></div>
           <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 py-24">
          <div className="max-w-3xl">
               <div className="inline-flex items-center gap-3 mb-8 animate-fade-in-up">
                  <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                    <span className="text-white font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-brand-light animate-pulse"></span>
                       Our Ethos
                    </span>
                  </div>
               </div>
               
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1] tracking-tight text-white animate-fade-in-up shadow-sm">
                Rooted in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-white">India.</span><br/>
                Raised for the <span className="font-serif italic font-light text-brand-100">World.</span>
              </h2>
              
              <div className="space-y-8 text-neutral-200 text-xl md:text-2xl font-light leading-relaxed mb-12 max-w-2xl animate-fade-in-up delay-100">
                <p>
                  The finest walnuts don't just grow on trees; they grow in the pristine air of Kashmir. The creamiest cashews aren't made; they are harvested on the sun-kissed coasts of Konkan.
                </p>
                <p>
                  We are the bridge between these ancestral lands and your modern table. Pure, traceable, and undeniably Indian.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-14 border-t border-white/10 pt-10 animate-fade-in-up delay-200">
                 {[
                   { val: "100%", label: "Traceable" },
                   { val: "Grade-A", label: "Certified" },
                   { val: "Ethical", label: "Sourcing" },
                   { val: "20k+", label: "Farmers" },
                 ].map((stat, i) => (
                   <div key={i} className="group cursor-default">
                      <div className="text-3xl font-bold text-white group-hover:text-brand-light transition-colors">{stat.val}</div>
                      <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mt-1">{stat.label}</div>
                   </div>
                 ))}
              </div>

              <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4">
                 <Link to="/about">
                   <Button variant="white" size="lg" className="group border-none min-w-[200px]">
                     Our Journey <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                   </Button>
                 </Link>
                 <Link to="/shop">
                   <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white min-w-[200px]">
                     View Harvest
                   </Button>
                 </Link>
              </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Newsletter */}
      <section className="py-28 container mx-auto px-6 md:px-12">
        <div className="bg-brand rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Join the Inner Circle</h2>
            <p className="text-brand-100 text-xl mb-12 font-light leading-relaxed">
              Get early access to our limited harvest batches, nutritional tips, and exclusive bulk discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-grow px-8 py-4 rounded-full bg-transparent text-white placeholder-brand-100/70 focus:outline-none text-lg"
              />
              <button className="bg-white text-brand-dark px-10 py-4 rounded-full font-bold hover:bg-brand-50 transition-colors shadow-lg text-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};