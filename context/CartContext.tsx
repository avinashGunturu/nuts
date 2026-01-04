import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Product, CartItem } from '../types';
import { saveCartToServer, getCartFromServer, clearCartOnServer } from '../services/cartService';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: any, quantity: number, weight: string) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  syncCartFromServer: () => Promise<{ restored: boolean; itemCount: number }>;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to calculate price based on weight ratio
const calculatePriceForWeight = (basePrice: number, baseWeight: string, targetWeight: string): number => {
  const getGrams = (w: string) => {
    if (!w) return 500; // Default to 500g
    const num = parseFloat(w);
    if (w.toLowerCase().includes('kg')) return num * 1000;
    if (w.toLowerCase().includes('g')) return num;
    return 0;
  };

  const baseGrams = getGrams(baseWeight);
  const targetGrams = getGrams(targetWeight);

  if (baseGrams === 0 || targetGrams === 0) return basePrice;

  return Math.round((basePrice / baseGrams) * targetGrams);
};

// Helper to get product ID (handles both id and _id)
const getProductId = (product: any): string => {
  return product.id || product._id || '';
};

// Helper to get base price and weight from product (handles both static and API data)
const getProductPriceAndWeight = (product: any, selectedWeight: string): { price: number; weight: string } => {
  // If product has variants (API data), find the selected variant
  if (product.variants && product.variants.length > 0) {
    const selectedVariant = product.variants.find((v: any) => v.weight === selectedWeight);
    if (selectedVariant) {
      // Use discounted price if available
      const price = selectedVariant.discountedPrice && selectedVariant.discountedPrice < selectedVariant.price
        ? selectedVariant.discountedPrice
        : selectedVariant.price;
      return { price, weight: selectedVariant.weight };
    }
    // Fallback to first variant
    const firstVariant = product.variants[0];
    const price = firstVariant.discountedPrice && firstVariant.discountedPrice < firstVariant.price
      ? firstVariant.discountedPrice
      : firstVariant.price;
    return { price, weight: firstVariant.weight };
  }

  // Static data
  return { price: product.price || 0, weight: product.weight || '500g' };
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
  return !!match;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kcnuts_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage and sync to server (debounced)
  useEffect(() => {
    localStorage.setItem('kcnuts_cart', JSON.stringify(cart));

    // Skip sync on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Debounced sync to server for logged-in users
    if (isAuthenticated() && cart.length >= 0) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(async () => {
        try {
          await saveCartToServer(cart);
          console.log('[Cart] Synced to server');
        } catch (error) {
          console.error('[Cart] Sync failed:', error);
        }
      }, 1500); // Debounce: wait 1.5s after last change
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [cart]);

  // Sync cart from server (called on login)
  const syncCartFromServer = useCallback(async (): Promise<{ restored: boolean; itemCount: number }> => {
    if (!isAuthenticated()) {
      return { restored: false, itemCount: 0 };
    }

    setIsSyncing(true);
    try {
      const serverCart = await getCartFromServer();

      if (serverCart.items && serverCart.items.length > 0) {
        // Convert server items to CartItem format
        const restoredItems: CartItem[] = serverCart.items.map((item: any) => ({
          id: item.productId,
          name: item.name || 'Product',
          price: item.price,
          weight: item.weight || '500g',
          image: item.image || '',
          category: '',
          rating: 0,
          description: '',
          quantity: item.quantity,
          selectedWeight: item.weight || '500g',
          calculatedPrice: item.price,
          variantId: item.variantId
        }));

        // Merge strategy: If local cart is empty, use server cart
        // If both have items, prefer local cart but notify user
        if (cart.length === 0) {
          setCart(restoredItems);
          return { restored: true, itemCount: restoredItems.length };
        } else {
          // Local cart has items - keep local, but save to server
          await saveCartToServer(cart);
          return { restored: false, itemCount: cart.length };
        }
      }

      return { restored: false, itemCount: 0 };
    } catch (error) {
      console.error('[Cart] Failed to sync from server:', error);
      return { restored: false, itemCount: 0 };
    } finally {
      setIsSyncing(false);
    }
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const clearCart = async () => {
    setCart([]);
    // Also clear on server
    if (isAuthenticated()) {
      try {
        await clearCartOnServer();
      } catch (error) {
        console.error('[Cart] Failed to clear on server:', error);
      }
    }
  };

  const addToCart = (product: any, quantity: number = 1, weight: string) => {
    const productId = getProductId(product);
    const { price: basePrice, weight: baseWeight } = getProductPriceAndWeight(product, weight);

    // For variant-based products, use direct variant price and get variantId
    let calculatedPrice: number;
    let variantId: string | undefined;

    if (product.variants && product.variants.length > 0) {
      const selectedVariant = product.variants.find((v: any) => v.weight === weight);
      if (selectedVariant) {
        calculatedPrice = selectedVariant.discountedPrice && selectedVariant.discountedPrice < selectedVariant.price
          ? selectedVariant.discountedPrice
          : selectedVariant.price;
        variantId = selectedVariant._id; // Capture variantId for checkout
      } else {
        calculatedPrice = calculatePriceForWeight(basePrice, baseWeight, weight);
      }
    } else {
      calculatedPrice = calculatePriceForWeight(basePrice, baseWeight, weight);
    }

    // Get image URL (handle both API and static data)
    const getImageUrl = (product: any): string => {
      if (product.images && product.images.length > 0) {
        const img = product.images.find((i: any) => i.isPrimary) || product.images[0];
        if (typeof img === 'string') return img;
        return img.url || '';
      }
      return product.image || '';
    };

    setCart((prev) => {
      // Check if item with same ID AND same weight exists
      const existingItemIndex = prev.findIndex(
        (item) => (item.id === productId || (item as any)._id === productId) && item.selectedWeight === weight
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Create a normalized cart item
        const cartItem: CartItem = {
          id: productId,
          name: product.name,
          price: basePrice,
          weight: baseWeight,
          image: getImageUrl(product),
          category: product.category || '',
          rating: product.rating || 0,
          description: product.description || '',
          quantity,
          selectedWeight: weight,
          calculatedPrice,
          variantId // Store variantId for checkout
        };
        return [...prev, cartItem];
      }
    });

    setIsCartOpen(true); // Open cart automatically when adding
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCart((prev) => prev.filter((p) => !(p.id === productId && p.selectedWeight === weight)));
  };

  const updateQuantity = (productId: string, weight: string, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.id === productId && item.selectedWeight === weight) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.calculatedPrice * item.quantity), 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      syncCartFromServer,
      isSyncing
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};