import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { Star, Truck, ShieldCheck, Leaf, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const WEIGHT_OPTIONS = ['250g', '500g', '1kg', '2kg'];

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = PRODUCTS.find(p => p.id === id);

  // Initialize weight once product is found
  if (product && selectedWeight === '') {
    setSelectedWeight(product.weight);
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col pt-32">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  // Gallery Logic
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  // Helper calculation
  const getGrams = (w: string) => {
    const num = parseFloat(w);
    if (w.toLowerCase().includes('kg')) return num * 1000;
    if (w.toLowerCase().includes('g')) return num;
    return 0;
  };

  const currentWeight = selectedWeight || product.weight;
  const currentPrice = Math.round((product.price / getGrams(product.weight)) * getGrams(currentWeight));

  const handleAddToCart = () => {
    addToCart(product, quantity, currentWeight);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, currentWeight);
    openCart();
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 md:pt-40">
      <div className="container mx-auto px-6 md:px-12">
        <Link to="/shop" className="inline-flex items-center text-neutral-500 hover:text-brand mb-8 transition-colors text-lg font-medium">
           <ArrowLeft size={24} className="mr-2" /> Back to Shop
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="flex-1 min-w-0">
             <div className="relative group">
                <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm relative">
                    <img 
                      src={galleryImages[currentImageIndex]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-all duration-500" 
                      loading="lazy"
                    />
                    
                    {product.isNew && (
                      <div className="absolute top-8 left-8 bg-neutral-900 text-white px-5 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl z-10">
                        New Arrival
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {galleryImages.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur hover:bg-white text-neutral-900 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur hover:bg-white text-neutral-900 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                </div>
             </div>

             {/* Thumbnails */}
             {galleryImages.length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-4 no-scrollbar snap-x">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 snap-start ${
                        currentImageIndex === idx 
                          ? 'border-brand shadow-lg scale-105 ring-2 ring-brand/20' 
                          : 'border-transparent opacity-60 hover:opacity-100 bg-neutral-50'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`View ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
             )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col pt-4">
             <div className="mb-4 text-brand font-bold uppercase tracking-wider text-base">{product.category}</div>
             <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">{product.name}</h1>
             
             <div className="flex items-center gap-4 mb-10">
               <div className="flex items-center gap-2 bg-neutral-100 px-4 py-1.5 rounded-full">
                 <Star size={18} className="text-brand fill-brand" />
                 <span className="font-bold text-neutral-900 text-lg">{product.rating}</span>
                 <span className="text-neutral-500 text-base">(120 reviews)</span>
               </div>
               <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full"></span>
               <span className="text-green-600 font-medium text-base">In Stock</span>
             </div>

             <div className="text-4xl font-bold text-neutral-900 mb-10">
               ₹{currentPrice.toLocaleString('en-IN')}
               <span className="text-xl text-neutral-400 font-normal ml-2">/ {currentWeight}</span>
             </div>

             <p className="text-xl text-neutral-600 leading-relaxed mb-12 font-light">
               {product.description} Sourced from the best farms, processed with care, and packed to retain maximum freshness. Perfect for snacking, cooking, or gifting.
             </p>

             {/* Controls */}
             <div className="bg-neutral-50 p-8 rounded-3xl mb-12 border border-neutral-100">
               <div className="flex flex-col md:flex-row gap-8 mb-8">
                 {/* Weight Selector */}
                 <div className="flex-1">
                   <label className="block text-base font-bold text-neutral-900 mb-3">Pack Size</label>
                   <div className="flex gap-3">
                     {WEIGHT_OPTIONS.map((w) => (
                        <button
                          key={w}
                          onClick={() => setSelectedWeight(w)}
                          className={`flex-1 py-3 px-4 rounded-xl text-base font-bold border transition-all ${
                            currentWeight === w 
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg' 
                              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          {w}
                        </button>
                     ))}
                   </div>
                 </div>

                 {/* Quantity */}
                 <div>
                    <label className="block text-base font-bold text-neutral-900 mb-3">Quantity</label>
                    <div className="flex items-center bg-white border border-neutral-200 rounded-xl p-1 h-[50px]">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900"
                      >
                        <Plus size={20} />
                      </button>
                   </div>
                 </div>
               </div>

               <div className="flex gap-4">
                 <Button size="lg" className="flex-1 py-5 text-lg" onClick={handleAddToCart}>
                   Add to Cart
                 </Button>
                 <Button size="lg" variant="black" className="flex-1 py-5 text-lg" onClick={handleBuyNow}>
                   Buy Now
                 </Button>
               </div>
             </div>

             {/* USPs */}
             <div className="grid grid-cols-2 gap-8 border-t border-neutral-100 pt-8">
                {[
                  { icon: Truck, text: "Free Delivery over ₹999" },
                  { icon: ShieldCheck, text: "Quality Certified" },
                  { icon: Leaf, text: "100% Natural" },
                  { icon: Star, text: "Premium Grade" }
                ].map((usp, i) => (
                  <div key={i} className="flex items-center gap-4 text-neutral-600">
                    <usp.icon size={24} className="text-brand" strokeWidth={1.5} />
                    <span className="text-base font-medium">{usp.text}</span>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};