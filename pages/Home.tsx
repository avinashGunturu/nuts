import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { MarqueeBanner } from '../components/MarqueeBanner';
import { ProductCard } from '../components/ProductCard';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { productService } from '../services/productService';
import { Truck, ShieldCheck, MapPin, Leaf, ArrowRight, Loader2, Award, Store, Users, Globe, Building2, UtensilsCrossed, Package, CheckCircle2, Gem, Grid3X3, Sparkles, Sprout } from 'lucide-react';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getPublicProducts();
        // data.products contains the array of products
        setProducts(data.products || data || []);
      } catch (error) {
        console.error('[Home] Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Hero />

      {/* Features / Value Props */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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
      {/* Why Choose KC NUTS? - Premium Compact Design */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-50/50 to-transparent -z-10"></div>

        <div className="container mx-auto px-6 md:px-12">
          {/* Header - Left aligned for premium feel */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
            <div className="max-w-lg">
              <span className="text-brand font-semibold tracking-wider uppercase text-xs mb-2 block">Our Promise</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">Why Choose KC NUTS?</h2>
            </div>
            <p className="text-neutral-500 max-w-md lg:text-right text-sm md:text-base leading-relaxed">
              Factory-processed cashews with complete traceability, strict quality control, and direct supply chain.
            </p>
          </div>

          {/* Features - Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {[
              { num: "01", title: "Direct Sourcing", desc: "From trusted farms", icon: Leaf },
              { num: "02", title: "In-House Processing", desc: "Quality assured grading", icon: ShieldCheck },
              { num: "03", title: "No Middlemen", desc: "Consistent supply chain", icon: Award },
              { num: "04", title: "Hygienic Packing", desc: "Moisture controlled", icon: Package },
              { num: "05", title: "Pan-India Reach", desc: "Traders to institutions", icon: MapPin },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative p-5 lg:p-6 rounded-2xl bg-neutral-50/80 hover:bg-brand hover:shadow-lg hover:shadow-brand/20 transition-all duration-500 cursor-default"
              >
                {/* Number accent */}
                <span className="absolute top-3 right-3 text-[10px] font-bold text-neutral-300 group-hover:text-white/40 transition-colors">
                  {item.num}
                </span>

                {/* Icon with light circular background */}
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <item.icon size={22} className="text-brand group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>

                <h3 className="text-sm lg:text-base font-bold text-neutral-900 group-hover:text-white mb-1 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs lg:text-sm text-neutral-500 group-hover:text-white/80 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section id="shop" className="py-24 bg-neutral-50/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
            <div>
              <span className="text-brand font-semibold tracking-wider uppercase text-xs mb-2 block">Selected for You</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">Best Sellers</h2>
            </div>
            <Link to="/shop" className="hidden md:inline-block">
              <Button variant="outline" className="rounded-full px-8">
                View All Products
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 size={48} className="animate-spin text-brand" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {products.slice(0, 3).map(product => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-500">
              <p>No products available at the moment.</p>
            </div>
          )}

          <div className="mt-16 text-center md:hidden">
            <Link to="/shop">
              <Button variant="outline" className="w-full">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Products Section - Modern Compact Design */}
      <section className="py-16 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <span className="text-brand font-bold tracking-widest uppercase text-xs mb-2 block">Premium Selection</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">Our Products</h2>
            </div>
            <p className="text-neutral-500 max-w-md text-sm md:text-base">
              From whole kernels to value-added varieties — the complete cashew range
            </p>
          </div>

          {/* Product Categories - Horizontal Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {/* Whole Cashew Kernels - Featured */}
            <div className="bg-brand-50/50 border border-brand/20 rounded-2xl p-6 hover:shadow-lg hover:shadow-brand/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center">
                  <Gem size={20} className="text-brand" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Whole Cashew Kernels</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["W180", "W210", "W240", "W320", "W400"].map((grade, i) => (
                  <span key={i} className="px-4 py-1.5 bg-white rounded-full text-sm font-semibold text-brand border border-brand/20 hover:bg-brand hover:text-white transition-colors cursor-default">
                    {grade}
                  </span>
                ))}
              </div>
            </div>

            {/* Broken Cashews */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-neutral-200/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center">
                  <Grid3X3 size={20} className="text-brand" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Broken Cashews</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Cashew Splits", "Cashew Pieces"].map((item, i) => (
                  <span key={i} className="px-4 py-1.5 bg-neutral-50 rounded-full text-sm font-medium text-neutral-700 border border-neutral-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Value-Added */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-neutral-200/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center">
                  <Sparkles size={20} className="text-brand" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Value-Added</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Flavoured Cashews", "Selected SKUs"].map((item, i) => (
                  <span key={i} className="px-4 py-1.5 bg-neutral-50 rounded-full text-sm font-medium text-neutral-700 border border-neutral-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Raw & By-Products Combined */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-neutral-200/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center">
                  <Sprout size={20} className="text-brand" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Raw & By-Products</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Raw Cashew Nuts", "Cashew Nut Shell", "Cashew Husk"].map((item, i) => (
                  <span key={i} className="px-4 py-1.5 bg-neutral-50 rounded-full text-sm font-medium text-neutral-700 border border-neutral-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Packaging Info - Compact Inline */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-900 rounded-2xl px-6 py-5">
            <div className="flex items-center gap-3 text-white">
              <Package size={22} />
              <span className="font-semibold">Available Packaging:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["250g", "500g", "1kg", "3kg", "10kg", "20kg"].map((size, idx) => (
                <span key={idx} className="px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium text-white border border-white/20 hover:bg-white/20 transition-colors">
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Serving Every Market - Premium Bento Layout */}
      <section className="py-20 bg-neutral-900 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          {/* Header with asymmetric layout */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="text-brand-light font-medium tracking-wider uppercase text-xs mb-3 block">Who We Serve</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand">Every Market</span>
              </h2>
            </div>
            <p className="text-neutral-400 max-w-sm lg:text-right">
              From home kitchens to international exports, we supply cashews at every scale.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">

            {/* Retail - Standard Card */}
            <div className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center">
                  <Store size={22} className="text-brand-light" />
                </div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">B2C</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Retail Customers</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Premium quality cashews for households. Available in convenient pack sizes from 250g to 1kg.</p>
            </div>

            {/* Wholesale - Featured Card (Larger) */}
            <div className="group relative md:row-span-2 bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border border-brand/20 rounded-2xl p-8 hover:border-brand/40 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -z-10"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-brand/20 flex items-center justify-center">
                  <Building2 size={26} className="text-brand-light" />
                </div>
                <span className="px-3 py-1 rounded-full bg-brand/20 text-brand-light text-xs font-semibold">Popular</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Wholesale & Traders</h3>
              <p className="text-neutral-300 leading-relaxed mb-6">Bulk supplies for distributors, supermarkets, and retail chains. Consistent quality, competitive pricing, and reliable supply chain.</p>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-light" />
                  <span>10kg & 20kg bulk packs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-light" />
                  <span>Custom branding available</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-light" />
                  <span>Credit terms for regulars</span>
                </li>
              </ul>
            </div>

            {/* HoReCa */}
            <div className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                  <UtensilsCrossed size={22} className="text-amber-400" />
                </div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">B2B</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">HoReCa</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Trusted by hotels, restaurants, and caterers. Consistent grade for consistent dishes.</p>
            </div>

            {/* Export */}
            <div className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
                  <Globe size={22} className="text-emerald-400" />
                </div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">International</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Export Buyers</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Meeting international food safety standards. Export-ready documentation and packaging.</p>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/corporate">
              <Button variant="primary" size="md" className="rounded-xl w-full sm:w-auto md:px-8 md:py-4 md:text-lg">
                Request Bulk Quote <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
            <Link to="/contact" className="text-neutral-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
              Or talk to our team <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Brand Story - KC NUTS Story */}
      <section className="relative min-h-[75vh] flex items-center bg-neutral-900 overflow-hidden">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1563292769-4e05b684851a?q=80&w=2500&auto=format&fit=crop')",
          }}
        >
          {/* Overlays for readability */}
          <div className="absolute inset-0 bg-neutral-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-8 animate-fade-in-up">
              <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <span className="text-white font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-light animate-pulse"></span>
                  Our Story
                </span>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white animate-fade-in-up">
              Processed with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-white">Precision.</span><br />
              Delivered with <span className="font-serif italic font-light text-brand-100">Trust.</span>
            </h2>

            <div className="space-y-6 text-neutral-200 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl animate-fade-in-up delay-100">
              <p>
                At KC NUTS, every cashew kernel passes through our in-house processing facility where quality isn't inspected — it's built in. From raw cashew nuts to perfectly graded kernels, we control every step.
              </p>
              <p>
                No middlemen. No compromises. Just consistent quality that traders, retailers, and institutions trust, batch after batch.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 border-t border-white/10 pt-8 animate-fade-in-up delay-200">
              {[
                { val: "100%", label: "Factory Processed" },
                { val: "FSSAI", label: "Compliant" },
                { val: "Pan-India", label: "Delivery" },
                { val: "10+", label: "Years Experience" },
              ].map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-brand-light transition-colors">{stat.val}</div>
                  <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3">
              <Link to="/about">
                <Button variant="white" size="md" className="group rounded-xl w-full sm:w-auto md:px-8 md:py-4 md:text-lg">
                  Our Journey <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" size="md" className="text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white rounded-xl w-full sm:w-auto md:px-8 md:py-4 md:text-lg">
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
      {/* <section className="py-28 container mx-auto px-6 md:px-12">
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
      </section> */}
    </>
  );
};