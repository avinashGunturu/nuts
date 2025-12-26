import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col animate-fade-in-up md:animate-none md:transition-transform duration-300 transform translate-x-0">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
            <span className="text-sm font-normal text-neutral-500 ml-2">({cart.length} items)</span>
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Your cart is empty</h3>
              <p className="text-neutral-500 mb-6">Looks like you haven't added any dry fruits yet.</p>
              <Button onClick={closeCart} variant="outline">Start Shopping</Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.selectedWeight}`} className="flex gap-4 group">
                {/* Image */}
                <div className="w-24 h-24 rounded-2xl bg-neutral-50 overflow-hidden flex-shrink-0 border border-neutral-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-neutral-900 text-base leading-tight mb-1">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedWeight)}
                        className="text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-neutral-500">{item.selectedWeight}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-neutral-50 rounded-full px-2 py-1 border border-neutral-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedWeight, -1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-sm hover:text-brand disabled:opacity-50 text-neutral-600"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.selectedWeight, 1)}
                         className="w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-sm hover:text-brand text-neutral-600"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-bold text-neutral-900">₹{(item.calculatedPrice * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
             <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-600">
                   <span>Subtotal</span>
                   <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                   <span>Shipping</span>
                   <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                   <span>Total</span>
                   <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
             </div>
             <Button className="w-full justify-between group" size="lg" onClick={handleCheckout}>
                <span>Checkout</span>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                   ₹{cartTotal.toLocaleString('en-IN')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
             </Button>
          </div>
        )}
      </div>
    </>
  );
};
