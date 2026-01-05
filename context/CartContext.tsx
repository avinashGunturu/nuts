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
  saveCartNow: () => Promise<void>; // Explicitly save cart to server (for checkout)
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
  if (match) return true;
  return !!localStorage.getItem('token');
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const hasLoadedFromServer = useRef(false);
  const isInitialized = useRef(false);

  // Load cart from local storage on mount, then fetch from server for logged-in users
  useEffect(() => {
    const initializeCart = async () => {
      // First load from localStorage for instant UI
      const savedCart = localStorage.getItem('kcnuts_cart');
      let localCart: CartItem[] = [];
      if (savedCart) {
        try {
          localCart = JSON.parse(savedCart);
          setCart(localCart);
          console.log('[Cart] Loaded from localStorage:', localCart.length, 'items');
        } catch (e) {
          console.error("[Cart] Failed to parse local cart", e);
        }
      }

      // Then fetch from server if authenticated
      if (isAuthenticated() && !hasLoadedFromServer.current) {
        hasLoadedFromServer.current = true;
        setIsSyncing(true);
        try {
          console.log('[Cart] Fetching cart from server on mount...');
          const serverCart = await getCartFromServer();

          if (serverCart.items && serverCart.items.length > 0) {
            console.log('[Cart] Server has', serverCart.items.length, 'items');
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

            // If local cart is empty OR server has items, use server cart
            // This prevents losing server cart on reload
            if (localCart.length === 0) {
              console.log('[Cart] Local cart empty, restoring from server');
              setCart(restoredItems);
            } else {
              console.log('[Cart] Local cart has items, keeping local cart');
              // Local cart takes priority - user may have added items offline
            }
          } else {
            console.log('[Cart] Server cart is empty');
          }
        } catch (error) {
          console.error('[Cart] Failed to fetch from server:', error);
        } finally {
          setIsSyncing(false);
        }
      }

      // Mark as initialized after first load attempt
      isInitialized.current = true;
    };

    initializeCart();
  }, []);

  // Save to localStorage whenever cart changes (skip first render to avoid overwriting)
  useEffect(() => {
    if (!isInitialized.current) {
      return; // Skip first render - let initialization load existing data first
    }
    localStorage.setItem('kcnuts_cart', JSON.stringify(cart));
    console.log('[Cart] Saved to localStorage:', cart.length, 'items');
  }, [cart]);

  // Explicitly save cart to server (call this on checkout or when user wants to sync)
  const saveCartNow = useCallback(async (): Promise<void> => {
    if (!isAuthenticated()) {
      console.warn('[Cart] Cannot save to server - not authenticated');
      return;
    }

    if (cart.length === 0) {
      console.log('[Cart] Cart is empty, nothing to save');
      return;
    }

    setIsSyncing(true);
    try {
      console.log('[Cart] Explicitly saving cart to server...');
      await saveCartToServer(cart);
      console.log('[Cart] Cart saved to server successfully');
    } catch (error) {
      console.error('[Cart] Failed to save cart to server:', error);
      throw error;
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

  // Sync cart from server - reloads server cart (useful after login)
  const syncCartFromServer = useCallback(async (): Promise<{ restored: boolean; itemCount: number }> => {
    if (!isAuthenticated()) {
      return { restored: false, itemCount: 0 };
    }

    setIsSyncing(true);
    try {
      console.log('[Cart] Syncing cart from server...');
      const serverCart = await getCartFromServer();

      if (serverCart.items && serverCart.items.length > 0) {
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

        setCart(restoredItems);
        localStorage.setItem('kcnuts_cart', JSON.stringify(restoredItems));
        console.log('[Cart] Restored', restoredItems.length, 'items from server');
        return { restored: true, itemCount: restoredItems.length };
      }

      return { restored: false, itemCount: 0 };
    } catch (error) {
      console.error('[Cart] Failed to sync from server:', error);
      return { restored: false, itemCount: 0 };
    } finally {
      setIsSyncing(false);
    }
  }, []);

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
      saveCartNow,
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