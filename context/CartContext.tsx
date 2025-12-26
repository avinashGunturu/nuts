import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity: number, weight: string) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to calculate price based on weight ratio
const calculatePriceForWeight = (basePrice: number, baseWeight: string, targetWeight: string): number => {
  const getGrams = (w: string) => {
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('kcnuts_cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const clearCart = () => setCart([]);

  const addToCart = (product: Product, quantity: number = 1, weight: string) => {
    const calculatedPrice = calculatePriceForWeight(product.price, product.weight, weight);

    setCart((prev) => {
      // Check if item with same ID AND same weight exists
      const existingItemIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedWeight === weight
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prev, { 
          ...product, 
          quantity, 
          selectedWeight: weight, 
          calculatedPrice 
        }];
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
      cartCount
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