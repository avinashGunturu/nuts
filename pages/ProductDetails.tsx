import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { Star, Truck, ShieldCheck, Leaf, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { productService } from '../services/productService';

const WEIGHT_OPTIONS = ['250g', '500g', '1kg', '2kg'];

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, openCart } = useCart();

  // State
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch product from cache or API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      // Try to get from cache first
      const cachedProduct = productService.getProductFromCache(id);
      if (cachedProduct) {
        setProduct(cachedProduct);
        // Set default weight from first variant
        if (cachedProduct.variants?.[0]?.weight) {
          setSelectedWeight(cachedProduct.variants[0].weight);
        } else if (cachedProduct.weight) {
          setSelectedWeight(cachedProduct.weight);
        }
        setLoading(false);
        return;
      }

      // Fallback to API
      try {
        const result = await productService.getProduct(id);
        if (result.success && result.data) {
          setProduct(result.data);
          if (result.data.variants?.[0]?.weight) {
            setSelectedWeight(result.data.variants[0].weight);
          } else if (result.data.weight) {
            setSelectedWeight(result.data.weight);
          }
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col pt-32">
        <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
        <p className="text-neutral-500 text-lg">Loading product...</p>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col pt-32">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="text-neutral-500 mb-6">{error}</p>
        <Link to="/shop">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  // Helper to get image URL from string or object
  const getImageUrl = (img: string | { url: string }): string => {
    if (typeof img === 'string') return img;
    return img.url;
  };

  // Gallery Logic - handle both API and static data structures
  const galleryImages: string[] = (() => {
    if (product.images && product.images.length > 0) {
      return product.images.map((img: any) => getImageUrl(img));
    }
    if (product.image) return [product.image];
    return [];
  })();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  // Get the selected variant for pricing
  const getSelectedVariant = () => {
    if (!product.variants || product.variants.length === 0) return null;
    return product.variants.find((v: any) => v.weight === selectedWeight) || product.variants[0];
  };

  const selectedVariant = getSelectedVariant();

  // Price calculations
  const getGrams = (w: string): number => {
    if (!w) return 500;
    const num = parseFloat(w);
    if (w.toLowerCase().includes('kg')) return num * 1000;
    if (w.toLowerCase().includes('g')) return num;
    return 0;
  };

  // Calculate prices - support both variant-based and static data
  const calculatePrices = () => {
    if (selectedVariant) {
      const hasDiscount = selectedVariant.discountedPrice && selectedVariant.discountedPrice < selectedVariant.price;
      return {
        originalPrice: selectedVariant.price,
        discountedPrice: hasDiscount ? selectedVariant.discountedPrice : null,
        discountPercent: hasDiscount
          ? Math.round(((selectedVariant.price - selectedVariant.discountedPrice) / selectedVariant.price) * 100)
          : 0
      };
    }

    // Fallback for static data
    const baseWeight = product.weight || '500g';
    const basePrice = product.price || 0;
    const baseGrams = getGrams(baseWeight);
    const selectedGrams = getGrams(selectedWeight || baseWeight);

    if (baseGrams > 0) {
      return {
        originalPrice: Math.round((basePrice / baseGrams) * selectedGrams),
        discountedPrice: null,
        discountPercent: 0
      };
    }
    return { originalPrice: basePrice, discountedPrice: null, discountPercent: 0 };
  };

  const { originalPrice, discountedPrice, discountPercent } = calculatePrices();
  const displayPrice = discountedPrice !== null ? discountedPrice : originalPrice;
  const hasDiscount = discountedPrice !== null;

  // Get stock from variant or product
  const getStock = () => {
    if (selectedVariant) return selectedVariant.stock || 0;
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
    }
    return 100; // Default for static data
  };
  const stock = getStock();
  const inStock = stock > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedWeight);
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
                {galleryImages.length > 0 ? (
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    No Image Available
                  </div>
                )}

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
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 snap-start ${currentImageIndex === idx
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
                <span className="font-bold text-neutral-900 text-lg">{product.rating || 0}</span>
                <span className="text-neutral-500 text-base">({product.reviews?.length || 0} reviews)</span>
              </div>
              <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full"></span>
              <span className={`font-medium text-base ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                {inStock ? `In Stock (${stock} units)` : 'Out of Stock'}
              </span>
            </div>

            {/* Price with Discount */}
            <div className="mb-10">
              {hasDiscount && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl text-neutral-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-white bg-success px-3 py-1 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${hasDiscount ? 'text-success' : 'text-neutral-900'}`}>
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xl text-neutral-400 font-normal">/ {selectedWeight}</span>
              </div>
            </div>

            <p className="text-xl text-neutral-600 leading-relaxed mb-12 font-light">
              {product.description} {!product.description?.includes('.') && 'Sourced from the best farms, processed with care, and packed to retain maximum freshness. Perfect for snacking, cooking, or gifting.'}
            </p>

            {/* Controls */}
            <div className="bg-neutral-50 p-8 rounded-3xl mb-12 border border-neutral-100">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Weight Selector */}
                <div className="flex-1">
                  <label className="block text-base font-bold text-neutral-900 mb-3">Pack Size</label>
                  <div className="flex gap-3">
                    {(product.variants && product.variants.length > 0
                      ? product.variants.map((v: any) => v.weight)
                      : WEIGHT_OPTIONS
                    ).map((w: string) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`flex-1 py-3 px-4 rounded-xl text-base font-bold border transition-all ${selectedWeight === w
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
                <Button size="lg" className="flex-1 py-5 text-lg" onClick={handleAddToCart} disabled={!inStock}>
                  Add to Cart
                </Button>
                <Button size="lg" variant="black" className="flex-1 py-5 text-lg" onClick={handleBuyNow} disabled={!inStock}>
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.highlights.map((h: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-xl">
                    <Leaf size={18} className="text-brand" />
                    <span className="text-sm font-medium text-neutral-700">{h.text}</span>
                  </div>
                ))}
              </div>
            )}

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