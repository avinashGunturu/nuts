import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { SlidersHorizontal, Check, RotateCcw, Search, ChevronDown, ArrowDownUp, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { productService } from '../services/productService';
import { Product } from '../types';

const CATEGORIES = ['All', 'Cashews', 'Almonds', 'Pistachios', 'Walnuts', 'Dried Fruit'];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' }
];

export const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  // Fetch products from API with caching
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getPublicProducts();
        setProducts(data || []);
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter by category
  let filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  // Apply Sorting
  if (sortBy === 'price_low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const handleReset = () => {
    setActiveCategory('All');
    setSortBy('recommended');
    setIsSortOpen(false);
  };

  const handleRetry = () => {
    productService.invalidateProductCache();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-neutral-50/30 pt-36 md:pt-48 pb-24">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header Section - Two Columns */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">

          {/* Left Column: Title & Description */}
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4 tracking-tight">Shop All</h1>
            <p className="text-neutral-500 text-lg font-light leading-relaxed">
              Premium grade cashew kernels, factory-processed for consistent quality.
            </p>
          </div>

          {/* Right Column: Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Categories Pill Group */}
            <div className="bg-neutral-100 p-1.5 rounded-full flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === cat
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
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-brand/20 font-bold text-sm transition-all whitespace-nowrap ${isSortOpen || sortBy !== 'recommended'
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
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${sortBy === option.id
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
            <p className="text-neutral-500 text-lg">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h3>
            <p className="text-neutral-500 text-lg mb-8">{error}</p>
            <Button onClick={handleRetry} variant="outline">Try Again</Button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-500 text-lg mb-8">Try adjusting your filters or category.</p>
            <Button onClick={handleReset} variant="outline">Clear all filters</Button>
          </div>
        )}

        {/* Our Cashew Range - Only show for All or Cashews category */}
        {!loading && !error && (activeCategory === 'All' || activeCategory === 'Cashews') && (
          <div className="mt-16 p-6 md:p-8 bg-white rounded-3xl border border-neutral-100 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Our Cashew Range</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Whole Cashews */}
              <div>
                <h3 className="font-bold text-brand mb-3">Whole Cashews</h3>
                <ul className="space-y-2 text-neutral-600 text-sm">
                  <li>• W180 – Premium Jumbo</li>
                  <li>• W210 – Large Size</li>
                  <li>• W240 – Export Grade</li>
                  <li>• W320 – Most Popular Grade</li>
                  <li>• W400 – Standard Grade</li>
                </ul>
              </div>

              {/* Broken Cashews */}
              <div>
                <h3 className="font-bold text-brand mb-3">Broken Cashews</h3>
                <ul className="space-y-2 text-neutral-600 text-sm">
                  <li>• Splits</li>
                  <li>• Pieces</li>
                </ul>
              </div>

              {/* Packaging */}
              <div>
                <h3 className="font-bold text-brand mb-3">Packaging Options</h3>
                <p className="text-neutral-600 text-sm">100g, 200g, 250g, 500g, 1kg, 3kg, 10kg, 20kg</p>
                <p className="text-neutral-500 text-xs mt-2 italic">Custom packing available for bulk orders</p>
              </div>

              {/* Storage Info */}
              <div>
                <h3 className="font-bold text-brand mb-3">Storage Info</h3>
                <p className="text-neutral-600 text-sm">Shelf Life: Up to 12 months</p>
                <p className="text-neutral-600 text-sm mt-1">Store in a cool, dry place away from sunlight</p>
              </div>
            </div>

            {/* Bulk CTA */}
            <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-neutral-500 text-sm">👉 For bulk pricing, please contact us on WhatsApp.</p>
              <a
                href="https://wa.me/919440829165?text=Hi%2C%20I%27m%20interested%20in%20bulk%20cashew%20pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full font-bold text-sm hover:bg-green-700 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};