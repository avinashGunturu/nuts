import React, { useState } from 'react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { SlidersHorizontal, Check, RotateCcw, Search, ChevronDown, ArrowDownUp } from 'lucide-react';
import { Button } from '../components/Button';

const CATEGORIES = ['All', 'Cashews', 'Almonds', 'Pistachios', 'Walnuts', 'Dried Fruit'];

const SORT_OPTIONS = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'price_low', label: 'Price: Low to High' },
    { id: 'price_high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Top Rated' }
];

export const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  // Filter by category
  let filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  // Apply Sorting
  if (sortBy === 'price_low') {
      filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
      filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
      filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const handleReset = () => {
    setActiveCategory('All');
    setSortBy('recommended');
    setIsSortOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50/30 pt-36 md:pt-48 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section - Two Columns */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-16">
             
             {/* Left Column: Title & Description */}
             <div className="max-w-2xl">
                 <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight">Shop All</h1>
                 <p className="text-neutral-500 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                   Explore our complete collection of premium, grade-A dry fruits and nuts sourced from the finest origins.
                 </p>
             </div>

             {/* Right Column: Filters (Aligned Right) */}
             <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                 {/* Categories Pill Group */}
                 <div className="bg-neutral-100 p-1.5 rounded-full flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
                     {CATEGORIES.map(cat => (
                       <button
                         key={cat}
                         onClick={() => setActiveCategory(cat)}
                         className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                           activeCategory === cat 
                             ? 'bg-neutral-900 text-white shadow-md' 
                             : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'
                         }`}
                       >
                         {cat}
                       </button>
                     ))}
                 </div>

                 {/* Sort Dropdown */}
                 <div className="relative z-30 flex-shrink-0">
                     <button 
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-brand/20 font-bold text-sm transition-all whitespace-nowrap ${
                            isSortOpen || sortBy !== 'recommended'
                            ? 'bg-brand-50 text-brand border-brand shadow-sm'
                            : 'bg-white text-brand hover:bg-brand-50 hover:border-brand'
                        }`}
                     >
                        <ArrowDownUp size={16} />
                        <span>Sort</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                     </button>

                     {/* Dropdown Menu */}
                     {isSortOpen && (
                         <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white rounded-2xl shadow-overlay border border-neutral-100 p-2 animate-fade-in origin-top-right z-50">
                             <div className="px-3 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider flex justify-between items-center">
                                <span>Sort By</span>
                                {(sortBy !== 'recommended') && (
                                    <button onClick={() => { setSortBy('recommended'); setIsSortOpen(false); }} className="text-brand hover:underline flex items-center gap-1">
                                        <RotateCcw size={10} /> Reset
                                    </button>
                                )}
                             </div>
                             <div className="space-y-1">
                                {SORT_OPTIONS.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                                            sortBy === option.id 
                                            ? 'bg-brand-50 text-brand' 
                                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                        }`}
                                    >
                                        {option.label}
                                        {sortBy === option.id && <Check size={16} />}
                                    </button>
                                ))}
                             </div>
                         </div>
                     )}
                 </div>
             </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
               <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-500 text-lg mb-8">Try adjusting your filters or category.</p>
            <Button onClick={handleReset} variant="outline">Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};