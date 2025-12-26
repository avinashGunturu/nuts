import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Plus, Minus, Star, ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, weight: string) => void;
  isHighlighted?: boolean;
}

const WEIGHT_OPTIONS = ['250g', '500g', '1kg', '2kg'];

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isHighlighted = false }) => {
  const [selectedWeight, setSelectedWeight] = useState(product.weight || '500g');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use product images if available, otherwise fallback to main image
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.id]);

  const getGrams = (w: string) => {
    const num = parseFloat(w);
    if (w.toLowerCase().includes('kg')) return num * 1000;
    if (w.toLowerCase().includes('g')) return num;
    return 0;
  };

  const currentPrice = Math.round((product.price / getGrams(product.weight)) * getGrams(selectedWeight));

  const handleAddToCart = () => {
    if (isAdded) return;
    
    onAddToCart(product, quantity, selectedWeight);
    setIsAdded(true);
    
    // Reset button state after 1.5 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  return (
    <div className={`group flex flex-col h-full bg-white rounded-3xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-overlay ${isHighlighted ? 'border-brand shadow-glow' : 'border-neutral-100 hover:border-neutral-200'}`}>
      
      {/* Image Container & Slider */}
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-t-3xl bg-neutral-50 group/image">
         {/* Badges */}
         {product.isNew && (
            <span className="absolute top-4 left-4 z-20 bg-neutral-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              New
            </span>
         )}
         
         <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/50">
            <Star size={12} className="text-warning fill-warning" />
            <span className="text-xs font-bold text-neutral-900">{product.rating}</span>
         </div>

         {/* Navigation Arrows (Only if multiple images) */}
         {galleryImages.length > 1 && (
           <>
             <button 
               onClick={prevImage}
               className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur hover:bg-white text-neutral-800 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300 shadow-sm transform hover:scale-110"
               aria-label="Previous Image"
             >
               <ChevronLeft size={18} />
             </button>
             <button 
               onClick={nextImage}
               className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur hover:bg-white text-neutral-800 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300 shadow-sm transform hover:scale-110"
               aria-label="Next Image"
             >
               <ChevronRight size={18} />
             </button>
             
             {/* Pagination Dots */}
             <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {galleryImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                      idx === currentImageIndex ? 'w-4 bg-brand' : 'w-1.5 bg-white/80'
                    }`} 
                  />
                ))}
             </div>
           </>
         )}

         <Link to={`/product/${product.id}`} className="block w-full h-full relative">
            {galleryImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${product.name} - View ${idx + 1}`}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 absolute inset-0 ${
                  idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                loading="lazy"
              />
            ))}
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />
         </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
         
         {/* Title & Category */}
         <div className="mb-4">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{product.category}</p>
            <Link to={`/product/${product.id}`}>
               <h3 className="text-xl font-bold text-neutral-900 group-hover:text-brand transition-colors line-clamp-1 leading-tight">
                  {product.name}
               </h3>
            </Link>
         </div>

         {/* Price & Controls Container */}
         <div className="mt-auto space-y-4">
            {/* Price Display */}
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-bold text-neutral-900">₹{currentPrice.toLocaleString('en-IN')}</span>
               <span className="text-sm text-neutral-500 font-medium">/ {selectedWeight}</span>
            </div>

            {/* Weight Selector */}
            <div className="grid grid-cols-4 gap-1 bg-neutral-100/50 p-1.5 rounded-xl border border-neutral-100">
               {WEIGHT_OPTIONS.map((w) => (
                 <button
                   key={w}
                   onClick={(e) => { e.preventDefault(); setSelectedWeight(w); }}
                   className={`text-xs font-bold py-2 rounded-lg transition-all duration-200 ${
                     selectedWeight === w 
                       ? 'bg-neutral-900 text-white shadow-md transform scale-100' 
                       : 'text-neutral-500 hover:text-neutral-900 hover:bg-white hover:shadow-sm'
                   }`}
                   aria-label={`Select ${w} weight`}
                 >
                   {w}
                 </button>
               ))}
            </div>

            {/* Actions Row */}
            <div className="flex items-center gap-3">
               {/* Quantity */}
               <div className="flex items-center bg-white border-2 border-neutral-100 rounded-xl h-12 px-1 w-[90px] flex-shrink-0 justify-between focus-within:border-neutral-300 transition-colors">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-base font-bold text-neutral-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
               </div>

               {/* Add Button */}
               <button 
                 onClick={handleAddToCart}
                 disabled={isAdded}
                 className={`flex-1 h-12 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 group/btn ${
                    isAdded 
                    ? 'bg-success text-white shadow-success/30 cursor-default' 
                    : 'bg-brand hover:bg-brand-dark text-white hover:shadow-brand/40'
                 }`}
               >
                 {isAdded ? (
                    <>
                        <Check size={20} className="animate-bounce" />
                        Added
                    </>
                 ) : (
                    <>
                        <ShoppingBag size={20} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                        Add
                    </>
                 )}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
