import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, Phone, User, Home, ShieldCheck, ShoppingBag, AlertCircle, CheckCircle2, Truck, Lock } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  if (cart.length === 0 && !showSuccessModal) {
    return <Navigate to="/shop" />;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = document.querySelector('.border-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsPaying(true);

    // Simulate Razorpay Gateway Loading
    // In a real app, you'd call your backend to create a Razorpay Order ID here
    setTimeout(() => {
      // Simulate successful payment confirmation
      setShowSuccessModal(true);
      clearCart();
      setIsPaying(false);
    }, 2000);
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    navigate('/shop');
  };

  const getInputClass = (fieldName: string, hasIcon: boolean = false) => {
    const base = `w-full py-4 rounded-xl border outline-none transition-all text-base ${hasIcon ? 'pl-12 pr-4' : 'px-4'}`;
    if (errors[fieldName]) {
        return `${base} border-error border-2 bg-error-bg text-neutral-900 placeholder:text-error/40 focus:ring-4 focus:ring-error/10`;
    }
    return `${base} bg-neutral-50 border-neutral-200 text-neutral-900 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 placeholder:text-neutral-400`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-20 relative">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Stepped Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12 hidden md:block">
            <div className="flex items-center justify-between relative">
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 -z-10 rounded-full"></div>
               <div className="flex flex-col items-center gap-2 bg-neutral-50 px-4 z-10">
                  <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold shadow-sm ring-4 ring-neutral-50">
                     <CheckCircle2 size={20} />
                  </div>
                  <span className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Bag</span>
               </div>
               <div className="flex flex-col items-center gap-2 bg-neutral-50 px-4 z-10">
                  <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-glow ring-4 ring-neutral-50">
                     2
                  </div>
                  <span className="text-sm font-bold text-brand uppercase tracking-wider">Shipping</span>
               </div>
               <div className="flex flex-col items-center gap-2 bg-neutral-50 px-4 z-10">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-400 flex items-center justify-center font-bold ring-4 ring-neutral-50">
                     3
                  </div>
                  <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Payment</span>
               </div>
            </div>
         </div>

        <Link to="/shop" className="inline-flex items-center text-neutral-500 hover:text-brand mb-8 transition-colors font-medium text-lg">
           <ArrowLeft size={24} className="mr-2" /> Back to Shop
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow lg:w-2/3">
             <form onSubmit={handleRazorpayPayment} id="checkout-form" noValidate className="space-y-8">
                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-neutral-100 shadow-xl shadow-neutral-100/50">
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
                       <div className="w-12 h-12 rounded-full bg-brand-50 text-brand flex items-center justify-center">
                          <User size={24} />
                       </div>
                       <div>
                          <h2 className="text-2xl font-bold text-neutral-900">Contact Details</h2>
                          <p className="text-neutral-500 text-sm">Required for order tracking and Razorpay invoices.</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">First Name <span className="text-error">*</span></label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={getInputClass('firstName')} placeholder="John" />
                          {errors.firstName && <p className="text-error text-sm font-medium ml-1 flex items-center gap-1 animate-fade-in"><AlertCircle size={14} /> {errors.firstName}</p>}
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Last Name <span className="text-error">*</span></label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={getInputClass('lastName')} placeholder="Doe" />
                          {errors.lastName && <p className="text-error text-sm font-medium ml-1 flex items-center gap-1 animate-fade-in"><AlertCircle size={14} /> {errors.lastName}</p>}
                       </div>
                    </div>
                    <div className="space-y-2 mt-8">
                       <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Phone Number <span className="text-error">*</span></label>
                       <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-error' : 'text-neutral-400'}`}>
                             <Phone size={20} />
                          </div>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={getInputClass('phone', true)} placeholder="+91 98765 43210" maxLength={15} />
                       </div>
                       {errors.phone && <p className="text-error text-sm font-medium ml-1 flex items-center gap-1 animate-fade-in"><AlertCircle size={14} /> {errors.phone}</p>}
                    </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-neutral-100 shadow-xl shadow-neutral-100/50">
                   <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
                      <div className="w-12 h-12 rounded-full bg-brand-50 text-brand flex items-center justify-center">
                         <MapPin size={24} />
                      </div>
                      <div>
                         <h2 className="text-2xl font-bold text-neutral-900">Delivery Address</h2>
                         <p className="text-neutral-500 text-sm">Where should we deliver your premium nuts?</p>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Street Address <span className="text-error">*</span></label>
                         <div className="relative">
                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.address ? 'text-error' : 'text-neutral-400'}`}>
                               <Home size={20} />
                            </div>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className={getInputClass('address', true)} placeholder="Flat No, Building, Street Name" />
                         </div>
                         {errors.address && <p className="text-error text-sm font-medium ml-1 flex items-center gap-1 animate-fade-in"><AlertCircle size={14} /> {errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Pincode <span className="text-error">*</span></label>
                            <div className="relative">
                               <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.pincode ? 'text-error' : 'text-neutral-400'}`}>
                                  <Truck size={20} />
                               </div>
                               <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={getInputClass('pincode', true)} placeholder="400001" maxLength={6} />
                            </div>
                            {errors.pincode && <p className="text-error text-sm font-medium ml-1 flex items-center gap-1 animate-fade-in"><AlertCircle size={14} /> {errors.pincode}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700 ml-1 uppercase tracking-wider">City <span className="text-error">*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className={getInputClass('city')} placeholder="Mumbai" />
                            {errors.city && <p className="text-error text-sm font-medium ml-1 flex items-center gap-1 animate-fade-in"><AlertCircle size={14} /> {errors.city}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700 ml-1 uppercase tracking-wider">State <span className="text-error">*</span></label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} className={getInputClass('state')} placeholder="Maharashtra" />
                            {errors.state && <p className="text-error text-sm font-medium ml-1 flex items-center gap-1 animate-fade-in"><AlertCircle size={14} /> {errors.state}</p>}
                         </div>
                      </div>
                   </div>
                </div>
             </form>
          </div>

          <div className="lg:w-1/3">
             <div className="bg-white p-8 md:p-10 rounded-[32px] border border-neutral-100 shadow-xl shadow-neutral-100/50 sticky top-32">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center">
                      <ShoppingBag size={24} />
                   </div>
                   <h2 className="text-2xl font-bold text-neutral-900">Order Summary</h2>
                </div>
                <div className="max-h-[300px] overflow-y-auto pr-2 mb-8 space-y-6">
                   {cart.map((item) => (
                      <div key={`${item.id}-${item.selectedWeight}`} className="flex gap-4">
                         <div className="w-20 h-20 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                               <p className="font-bold text-base text-neutral-900 line-clamp-1">{item.name}</p>
                               <p className="font-bold text-base text-neutral-900">₹{(item.calculatedPrice * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                            <p className="text-sm text-neutral-500">{item.selectedWeight} x {item.quantity}</p>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="space-y-4 py-8 border-t border-b border-neutral-100 mb-8">
                   <div className="flex justify-between text-neutral-600 text-lg">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between text-neutral-600 text-lg">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold">Free</span>
                   </div>
                </div>
                <div className="flex justify-between text-3xl font-bold text-neutral-900 mb-10">
                   <span>Total</span>
                   <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    form="checkout-form"
                    size="lg" 
                    className="w-full bg-brand hover:bg-brand-dark shadow-lg text-white text-lg py-5 group"
                    isLoading={isPaying}
                  >
                    {!isPaying && <CreditCard className="mr-3 group-hover:-translate-y-0.5 transition-transform" size={24} />}
                    {isPaying ? 'Connecting to Razorpay...' : 'Pay with Razorpay'}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4 opacity-60 grayscale hover:grayscale-0 transition-all" />
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-1">
                       <Lock size={10} /> Secure Checkout
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 flex items-start gap-3 text-sm text-neutral-400 bg-neutral-50 p-4 rounded-xl">
                   <ShieldCheck size={20} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                   <p>Your payment is secured by Razorpay. We support UPI, Cards, Net Banking, and Wallets.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade-in" onClick={handleContinueShopping}></div>
           <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-lg w-full relative z-10 text-center shadow-2xl animate-fade-in-up">
              <div className="w-24 h-24 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-8 text-success shadow-lg shadow-success/20">
                 <CheckCircle2 size={48} className="animate-bounce" />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">Payment Successful!</h3>
              <div className="w-16 h-1 bg-neutral-100 mx-auto mb-6 rounded-full"></div>
              <p className="text-neutral-600 mb-10 leading-relaxed text-lg">
                Thank you for your order! Your payment via Razorpay was confirmed. You will receive an invoice on your registered email shortly.
              </p>
              <Button onClick={handleContinueShopping} className="w-full py-4 text-lg">
                Continue Shopping
              </Button>
           </div>
        </div>
      )}
    </div>
  );
};