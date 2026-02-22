import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, Phone, User, Home, ShieldCheck, ShoppingBag, AlertCircle, CheckCircle2, Truck, Lock, Tag, X, Loader2, Store, Gift } from 'lucide-react';
import { orderService, CartValidationItem } from '../services/orderService';

// Declare Razorpay on window object
declare global {
   interface Window {
      Razorpay: any;
   }
}

export const Checkout: React.FC = () => {
   const { cart, cartTotal, clearCart } = useCart();
   const { user, addresses: savedAddresses } = useAuth();
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
   const [previousOrderDetails, setPreviousOrderDetails] = useState<{ amount: number } | null>(null);
   const [showFailureModal, setShowFailureModal] = useState(false);
   const [isPaying, setIsPaying] = useState(false);
   const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

   // Coupon state
   const [couponCode, setCouponCode] = useState('');
   const [appliedCoupon, setAppliedCoupon] = useState<{
      code: string;
      discountAmount: number;
      _id: string;
   } | null>(null);
   const [couponLoading, setCouponLoading] = useState(false);
   const [couponError, setCouponError] = useState('');
   const [couponSuccess, setCouponSuccess] = useState('');

   // Payment error state
   const [paymentError, setPaymentError] = useState('');

   // Selected saved address
   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

   // Delivery Method
   const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');

   // Shipping fee state
   const [shippingFee, setShippingFee] = useState(0);
   const [shippingLoading, setShippingLoading] = useState(false);
   const [shippingError, setShippingError] = useState('');
   const [estimatedDays, setEstimatedDays] = useState('');
   const [courierName, setCourierName] = useState('');
   const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
   const [isFreeShipping, setIsFreeShipping] = useState(false);
   const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
   const [shippingInfo, setShippingInfo] = useState<any>(null);
   const shippingDebounceRef = useRef<NodeJS.Timeout | null>(null);

   // Helper: parse weight string to kg (e.g., "250g" -> 0.25, "1kg" -> 1.0)
   const parseWeightToKg = (weightStr: string): number => {
      const lower = weightStr.toLowerCase().trim();
      const num = parseFloat(lower);
      if (isNaN(num)) return 0.5; // fallback
      if (lower.includes('kg')) return num;
      if (lower.includes('g')) return num / 1000;
      return num; // assume kg if no unit
   };

   // Calculate total cart weight in kg
   const totalCartWeight = cart.reduce((total, item) => {
      return total + parseWeightToKg(item.selectedWeight || '500g') * item.quantity;
   }, 0) || 0.5; // minimum 0.5kg

   // Check shipping rate when pincode changes (debounced)
   const checkShipping = useCallback(async (pincode: string) => {
      if (!/^\d{6}$/.test(pincode) || deliveryMethod !== 'shipping') return;

      setShippingLoading(true);
      setShippingError('');
      try {
         const result = await orderService.checkShippingRate(pincode, totalCartWeight, cartTotal);
         const data = result.data;
         setIsServiceable(data.serviceable);
         setShippingFee(data.shippingFee);
         setEstimatedDays(data.estimatedDays);
         setCourierName(data.courierName);
         setIsFreeShipping(data.freeShipping);
         setFreeShippingThreshold(data.freeShippingThreshold);
         setShippingInfo(data.shippingInfo);
      } catch (err: any) {
         setShippingError(err.message || 'Failed to check shipping');
         setIsServiceable(false);
         setShippingFee(0);
         setShippingInfo(null);
      } finally {
         setShippingLoading(false);
      }
   }, [deliveryMethod, totalCartWeight, cartTotal]);

   useEffect(() => {
      if (deliveryMethod === 'pickup') {
         setShippingFee(0);
         setIsFreeShipping(false);
         setIsServiceable(null);
         setShippingError('');
         setShippingInfo(null);
         return;
      }

      if (shippingDebounceRef.current) clearTimeout(shippingDebounceRef.current);

      if (/^\d{6}$/.test(formData.pincode)) {
         shippingDebounceRef.current = setTimeout(() => {
            checkShipping(formData.pincode);
         }, 800);
      } else {
         setShippingFee(0);
         setIsServiceable(null);
         setIsFreeShipping(false);
      }

      return () => {
         if (shippingDebounceRef.current) clearTimeout(shippingDebounceRef.current);
      };
   }, [formData.pincode, deliveryMethod, checkShipping]);

   // Prefill contact details from user data on mount
   useEffect(() => {
      if (user) {
         // Split name into first and last name
         const nameParts = (user.name || '').trim().split(' ');
         const firstName = nameParts[0] || '';
         const lastName = nameParts.slice(1).join(' ') || '';

         setFormData(prev => ({
            ...prev,
            firstName: firstName,
            lastName: lastName,
            phone: user.phone?.replace('+91', '') || ''
         }));
         // Note: No auto-selection - user must click to select an address
      }
   }, [user]);

   // Handle selecting a saved address (works with AuthContext Address interface)
   const handleSelectAddress = (address: any) => {
      setSelectedAddressId(address.id || address._id || null);
      setFormData(prev => ({
         ...prev,
         // Support both AuthContext format (address) and backend format (street)
         address: address.address || address.street || '',
         city: address.city,
         state: address.state,
         // Support both AuthContext format (pincode) and backend format (zip)
         pincode: address.pincode || address.zip || ''
      }));
      // Clear any address errors
      setErrors(prev => {
         const newErrors = { ...prev };
         delete newErrors.address;
         delete newErrors.city;
         delete newErrors.state;
         delete newErrors.pincode;
         return newErrors;
      });
   };

   if (cart.length === 0 && !showSuccessModal) {
      return <Navigate to="/shop" />;
   }

   // Check if user is logged in
   if (!user && cart.length > 0) {
      return (
         <div className="min-h-screen bg-neutral-50 pt-28 pb-20 flex items-center justify-center">
            <div className="bg-white p-10 rounded-[32px] border border-neutral-100 shadow-xl max-w-md w-full text-center">
               <div className="w-16 h-16 bg-warning-bg rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock size={32} className="text-warning" />
               </div>
               <h2 className="text-2xl font-bold text-neutral-900 mb-4">Login Required</h2>
               <p className="text-neutral-600 mb-8">Please login to proceed with checkout and complete your purchase.</p>
               <Link to="/login">
                  <Button className="w-full">Login to Continue</Button>
               </Link>
            </div>
         </div>
      );
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

      // Only validate address if shipping is selected
      if (deliveryMethod === 'shipping') {
         if (!formData.address.trim()) newErrors.address = 'Address is required';
         if (!formData.city.trim()) newErrors.city = 'City is required';
         if (!formData.state.trim()) newErrors.state = 'State is required';

         if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
         } else if (!pincodeRegex.test(formData.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
         }
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

   // Calculate final total
   const discountAmount = appliedCoupon?.discountAmount || 0;
   const shippingCharge = deliveryMethod === 'shipping' ? shippingFee : 0;
   const finalTotal = cartTotal - discountAmount + shippingCharge;

   // Free shipping progress hint
   const amountForFreeShipping = freeShippingThreshold > 0 && !isFreeShipping && deliveryMethod === 'shipping'
      ? Math.max(0, freeShippingThreshold - (cartTotal - discountAmount))
      : 0;

   // Apply coupon handler
   const handleApplyCoupon = async () => {
      if (!couponCode.trim()) {
         setCouponError('Please enter a coupon code');
         return;
      }

      setCouponLoading(true);
      setCouponError('');
      setCouponSuccess('');

      try {
         const response = await orderService.applyCoupon(couponCode.toUpperCase(), cartTotal);
         setAppliedCoupon({
            code: response.data.couponCode,
            discountAmount: response.data.discountAmount,
            _id: response.data._id
         });
         setCouponSuccess(`Coupon applied! You save ₹${response.data.discountAmount.toLocaleString('en-IN')}`);
      } catch (error: any) {
         setCouponError(error.message || 'Invalid coupon code');
      } finally {
         setCouponLoading(false);
      }
   };

   // Remove coupon handler
   const handleRemoveCoupon = () => {
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponSuccess('');
      setCouponError('');
   };

   // Transform cart items for API
   const getCartItemsForAPI = (): CartValidationItem[] => {
      return cart.map(item => ({
         productId: item.id,
         variantId: item.variantId || '',
         quantity: item.quantity
      }));
   };

   // Handle Razorpay Payment
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
      setPaymentError('');

      try {
         // 1. Prepare shipping address
         const shippingAddress = {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.pincode,
            country: 'India'
         };

         // 2. Get cart items in API format
         const items = getCartItemsForAPI();

         // 3. Initiate checkout
         const checkoutResponse = await orderService.initiateCheckout(
            items,
            shippingAddress,
            appliedCoupon?.code,
            deliveryMethod,
            shippingCharge,
            shippingInfo
         );

         const { razorpayOrderId, amount, key, mongoOrderId, orderId } = checkoutResponse.data;

         // 4. Open Razorpay checkout modal
         const options = {
            key: key,
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            name: 'KCnuts',
            description: 'Premium Dry Fruits',
            order_id: razorpayOrderId,
            handler: async function (response: any) {
               // 5. Verify payment
               try {
                  await orderService.verifyPayment({
                     razorpay_order_id: response.razorpay_order_id,
                     razorpay_payment_id: response.razorpay_payment_id,
                     razorpay_signature: response.razorpay_signature,
                     mongoOrderId: mongoOrderId
                  });

                  // 6. Success!
                  setConfirmedOrderId(orderId);
                  setShowSuccessModal(true);
                  clearCart();
                  setIsPaying(false);
               } catch (verifyError: any) {
                  setPaymentError(verifyError.message || 'Payment verification failed');
                  setIsPaying(false);
               }
            },
            prefill: {
               name: `${formData.firstName} ${formData.lastName}`,
               contact: formData.phone,
               email: user?.email || ''
            },
            notes: {
               address: formData.address
            },
            theme: {
               color: '#2563EB'
            },
            modal: {
               ondismiss: function () {
                  setIsPaying(false);
                  setPaymentError('Payment cancelled. You can retry via the "Pay Now" button.');
                  setPreviousOrderDetails({ amount: amount });
                  setShowFailureModal(true);
               }
            }
         };

         const razorpay = new window.Razorpay(options);
         razorpay.on('payment.failed', function (response: any) {
            console.error('Payment Failed:', response.error);

            // Extract relevant error info
            const errorMessage = response.error.description || 'Payment failed. Please try again.';

            // Update state
            setPaymentError(errorMessage);
            setPreviousOrderDetails({ amount: amount });
            setIsPaying(false);
            setShowFailureModal(true);
         });
         razorpay.open();

      } catch (error: any) {
         setPaymentError(error.message || 'Checkout failed. Please try again.');
         setIsPaying(false);
      }
   };

   // ===== CREATE ORDER (Without Razorpay Payment) =====
   // Use this handler when Razorpay is not available
   const handleCreateOrder = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         const firstErrorField = document.querySelector('.border-error');
         if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
         return;
      }

      setIsPaying(true);
      setPaymentError('');

      try {
         // 1. Prepare shipping address
         const shippingAddress = {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.pincode,
            country: 'India'
         };

         // 2. Get cart items in API format
         const items = getCartItemsForAPI();

         // 3. Create order (without Razorpay)
         const response = await orderService.createOrder(
            items,
            shippingAddress,
            appliedCoupon?.code,
            deliveryMethod,
            shippingCharge,
            shippingInfo
         );

         // 4. Success!
         setConfirmedOrderId(response.data.orderId);
         setShowSuccessModal(true);
         clearCart();
         setIsPaying(false);

      } catch (error: any) {
         setPaymentError(error.message || 'Order creation failed. Please try again.');
         setIsPaying(false);
      }
   };
   // ===== END CREATE ORDER =====

   const handleContinueShopping = () => {
      setShowSuccessModal(false);
      navigate('/shop');
   };

   const handleViewOrders = () => {
      setShowSuccessModal(false);
      navigate('/orders');
   };

   const handleCloseFailureModal = () => {
      setShowFailureModal(false);
   };

   const handleRetryPayment = () => {
      setShowFailureModal(false);
      // Logic to retry could go here, for now it just closes so they can click the button again
      // We could also potentially auto-scroll to the payment button
      const paymentButton = document.querySelector('button[type="submit"]');
      if (paymentButton) {
         paymentButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
                              {deliveryMethod === 'shipping' ? <MapPin size={24} /> : <Store size={24} />}
                           </div>
                           <div>
                              <h2 className="text-2xl font-bold text-neutral-900">Delivery Method</h2>
                              <p className="text-neutral-500 text-sm">Choose how you want to receive your order.</p>
                           </div>
                        </div>

                        {/* Delivery Method Toggle */}
                        <div className="grid grid-cols-2 gap-4 mb-8 p-1 bg-neutral-100 rounded-2xl">
                           <button
                              type="button"
                              onClick={() => setDeliveryMethod('shipping')}
                              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${deliveryMethod === 'shipping'
                                 ? 'bg-white text-brand shadow-sm'
                                 : 'text-neutral-500 hover:text-neutral-700'
                                 }`}
                           >
                              <Truck size={20} />
                              Home Delivery
                           </button>
                           <button
                              type="button"
                              onClick={() => setDeliveryMethod('pickup')}
                              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${deliveryMethod === 'pickup'
                                 ? 'bg-white text-brand shadow-sm'
                                 : 'text-neutral-500 hover:text-neutral-700'
                                 }`}
                           >
                              <Store size={20} />
                              Pick Up from Store
                           </button>
                        </div>

                        {deliveryMethod === 'shipping' ? (
                           <>
                              {/* Saved Addresses Selection - Compact Inline */}
                              {savedAddresses.length > 0 && (
                                 <div className="mb-6">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 block">
                                       Use Saved Address
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                       {savedAddresses.map((addr: any) => {
                                          const isSelected = selectedAddressId === addr.id || selectedAddressId === addr._id;
                                          const label = addr.label || addr.type || 'Address';
                                          const street = addr.address || addr.street || '';
                                          const location = `${addr.city} - ${addr.pincode || addr.zip}`;

                                          return (
                                             <button
                                                key={addr.id || addr._id || street}
                                                type="button"
                                                onClick={() => handleSelectAddress(addr)}
                                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${isSelected
                                                   ? 'border-brand bg-brand-50 text-brand'
                                                   : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand/50 hover:bg-neutral-50'
                                                   }`}
                                             >
                                                {isSelected ? (
                                                   <CheckCircle2 size={14} className="text-brand flex-shrink-0" />
                                                ) : (
                                                   <MapPin size={14} className="text-neutral-400 flex-shrink-0" />
                                                )}
                                                <span className="font-semibold">{label}</span>
                                                <span className="text-neutral-400">•</span>
                                                <span className="truncate max-w-[150px]">{street}</span>
                                                <span className="text-neutral-400 text-xs">({location})</span>
                                                {addr.isDefault && (
                                                   <span className="text-[10px] font-bold text-success bg-success-bg px-1.5 py-0.5 rounded-full ml-1">
                                                      ★
                                                   </span>
                                                )}
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              )}

                              <div className="space-y-8 animate-fade-in">
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
                           </>
                        ) : (
                           <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 animate-slide-up">
                              <div className="flex items-start gap-4">
                                 <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand border border-neutral-100 shadow-sm shrink-0">
                                    <MapPin size={24} />
                                 </div>
                                 <div className="space-y-4">
                                    <div>
                                       <h3 className="font-bold text-lg text-neutral-900 mb-2">Mahindra Cashew Products</h3>
                                       <p className="text-neutral-600">Main Road, Garudabhadra Village & Post</p>
                                       <p className="text-neutral-600">Vajrapukotturu Mandal, Srikakulam</p>
                                       <p className="text-neutral-600">Andhra Pradesh - 532222, India</p>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-2">
                                       <div className="flex items-center gap-2 text-neutral-600">
                                          <Phone size={16} className="text-brand" />
                                          <span>+91 94408 29165</span>
                                          <span className="text-xs text-neutral-400">(Mon-Sat, 9am - 6pm)</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-neutral-600">
                                          <div className="w-4 flex justify-center"><span className="text-brand">@</span></div>
                                          <span className="break-all">Mahindracashewproducts@gmail.com</span>
                                       </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                       <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Open Now</span>
                                    </div>
                                    <p className="text-sm text-neutral-500 mt-2 pt-4 border-t border-neutral-200">
                                       Instructions: Please show your Order ID at the counter to collect your package.
                                    </p>
                                 </div>
                              </div>
                           </div>
                        )}
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

                     {/* Coupon Section */}
                     <div className="py-6 border-t border-neutral-100">
                        <div className="flex items-center gap-2 mb-4">
                           <Tag size={18} className="text-neutral-500" />
                           <span className="font-bold text-neutral-700">Have a Coupon?</span>
                        </div>

                        {!appliedCoupon ? (
                           <div className="space-y-3">
                              <div className="flex gap-2">
                                 <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => {
                                       setCouponCode(e.target.value.toUpperCase());
                                       setCouponError('');
                                    }}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-brand focus:bg-white transition-all uppercase font-medium"
                                 />
                                 <Button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading}
                                    className="px-6 py-3"
                                    variant="outline"
                                 >
                                    {couponLoading ? <Loader2 size={18} className="animate-spin" /> : 'Apply'}
                                 </Button>
                              </div>
                              {couponError && (
                                 <p className="text-error text-sm font-medium flex items-center gap-1 animate-fade-in">
                                    <AlertCircle size={14} /> {couponError}
                                 </p>
                              )}
                           </div>
                        ) : (
                           <div className="bg-success-bg rounded-xl p-4 flex items-center justify-between animate-fade-in">
                              <div>
                                 <p className="font-bold text-success">{appliedCoupon.code}</p>
                                 <p className="text-sm text-success">-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')} off</p>
                              </div>
                              <button
                                 type="button"
                                 onClick={handleRemoveCoupon}
                                 className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-500 hover:text-error hover:bg-error-bg transition-all"
                              >
                                 <X size={16} />
                              </button>
                           </div>
                        )}
                        {couponSuccess && !appliedCoupon && (
                           <p className="text-success text-sm font-medium flex items-center gap-1 mt-2 animate-fade-in">
                              <CheckCircle2 size={14} /> {couponSuccess}
                           </p>
                        )}
                     </div>

                     <div className="space-y-4 py-8 border-t border-b border-neutral-100 mb-8">
                        <div className="flex justify-between text-neutral-600 text-lg">
                           <span>Subtotal</span>
                           <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        {appliedCoupon && (
                           <div className="flex justify-between text-success text-lg font-medium">
                              <span>Discount</span>
                              <span>-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                           </div>
                        )}
                        <div className="flex justify-between text-neutral-600 text-lg">
                           <span>Shipping</span>
                           {deliveryMethod === 'pickup' ? (
                              <span className="text-green-600 font-bold">Free (Pickup)</span>
                           ) : shippingLoading ? (
                              <span className="flex items-center gap-2 text-neutral-400">
                                 <Loader2 size={16} className="animate-spin" /> Checking...
                              </span>
                           ) : isServiceable === false ? (
                              <span className="text-red-500 font-medium text-sm">Not serviceable</span>
                           ) : isFreeShipping ? (
                              <span className="text-green-600 font-bold flex items-center gap-1">
                                 <Gift size={16} /> Free 🎉
                              </span>
                           ) : shippingFee > 0 ? (
                              <span className="font-semibold">₹{shippingFee.toLocaleString('en-IN')}</span>
                           ) : (
                              <span className="text-neutral-400 text-sm">Enter pincode</span>
                           )}
                        </div>
                        {estimatedDays && deliveryMethod === 'shipping' && isServiceable && (
                           <p className="text-sm text-neutral-400 text-right">
                              Est. delivery: {estimatedDays} days{courierName ? ` via ${courierName}` : ''}
                           </p>
                        )}
                        {amountForFreeShipping > 0 && deliveryMethod === 'shipping' && !shippingLoading && (
                           <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-sm font-medium">
                              <Gift size={14} />
                              Add ₹{amountForFreeShipping.toLocaleString('en-IN')} more for free shipping!
                           </div>
                        )}
                     </div>
                     <div className="flex justify-between text-3xl font-bold text-neutral-900 mb-10">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                     </div>

                     {/* Payment Error */}
                     {paymentError && (
                        <div className="mb-6 p-4 bg-error-bg rounded-xl text-error text-sm font-medium flex items-center gap-2 animate-fade-in">
                           <AlertCircle size={18} />
                           {paymentError}
                        </div>
                     )}

                     <div className="space-y-4">
                        {/* ===== RAZORPAY PAYMENT BUTTON (Uncomment when Razorpay is activated) ===== */}
                        <Button
                           type="submit"
                           form="checkout-form"
                           size="lg"
                           className="w-full bg-brand hover:bg-brand-dark shadow-lg text-white text-lg py-5 group"
                           isLoading={isPaying || shippingLoading}
                           disabled={isPaying || shippingLoading || (!isServiceable && deliveryMethod === 'shipping')}
                        >
                           {!isPaying && !shippingLoading && <CreditCard className="mr-3 group-hover:-translate-y-0.5 transition-transform" size={24} />}
                           {isPaying ? 'Connecting to Razorpay...' : shippingLoading ? 'Calculating Shipping...' : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                        </Button>

                        <div className="flex items-center justify-center gap-3">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4 opacity-60 grayscale hover:grayscale-0 transition-all" />
                           <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              <Lock size={10} /> Secure Checkout
                           </span>
                        </div>
                        {/* ===== END RAZORPAY ===== */}

                        {/* ===== CREATE ORDER BUTTON (Comment out when Razorpay is activated) ===== */}
                        {/* <Button
                           type="button"
                           onClick={handleCreateOrder}
                           size="md"
                           className="w-full bg-brand hover:bg-brand-dark shadow-lg text-white"
                           isLoading={isPaying}
                        >
                           {!isPaying && <ShoppingBag className="mr-2 flex-shrink-0" size={18} />}
                           <span>{isPaying ? 'Creating Order...' : `Create Order • ₹${finalTotal.toLocaleString('en-IN')}`}</span>
                        </Button> */}

                        {/* <div className="flex items-center justify-center gap-3">
                           <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              <ShieldCheck size={10} /> Secure Order
                           </span>
                        </div> */}
                        {/* ===== END CREATE ORDER ===== */}
                     </div>

                     <div className="mt-8 flex items-start gap-3 text-sm text-neutral-400 bg-neutral-50 p-4 rounded-xl">
                        <ShieldCheck size={20} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                        <p>Your order will be created and our team will contact you for payment confirmation.</p>
                        {/* <p>Your payment is secured by Razorpay. We support UPI, Cards, Net Banking, and Wallets.</p> */}
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
                  <h3 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">Order Created!</h3>
                  <div className="w-16 h-1 bg-neutral-100 mx-auto mb-6 rounded-full"></div>
                  <p className="text-neutral-600 mb-4 leading-relaxed text-lg">
                     Thank you for your order! Our team will contact you shortly to confirm payment.
                  </p>
                  {confirmedOrderId && (
                     <p className="text-brand font-bold mb-8 text-lg">
                        Order ID: {confirmedOrderId}
                     </p>
                  )}
                  <div className="space-y-3">
                     <Button onClick={handleViewOrders} className="w-full py-4 text-lg">
                        View My Orders
                     </Button>
                     <Button onClick={handleContinueShopping} variant="outline" className="w-full py-4 text-lg">
                        Continue Shopping
                     </Button>
                  </div>
               </div>
            </div>
         )}
         {showFailureModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade-in" onClick={handleCloseFailureModal}></div>
               <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-sm w-full relative z-10 text-center shadow-2xl animate-fade-in-up border border-error/10">
                  <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mx-auto mb-6 text-error shadow-lg shadow-error/20">
                     <AlertCircle size={32} className="animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Transaction Failed</h3>
                  <div className="w-12 h-1 bg-neutral-100 mx-auto mb-5 rounded-full"></div>

                  <p className="text-neutral-600 mb-6 leading-relaxed text-base">
                     {paymentError || 'Your payment could not be processed. Please try again.'}
                  </p>

                  {previousOrderDetails && (
                     <div className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100 inline-block w-full">
                        <div className="text-neutral-500 text-xs mb-1 uppercase tracking-wider font-bold">Amount Pending</div>
                        <div className="text-2xl font-bold text-neutral-900">₹{Math.round(previousOrderDetails.amount).toLocaleString('en-IN')}</div>
                     </div>
                  )}

                  <div className="space-y-3">
                     {/* <Button onClick={handleRetryPayment} className="w-full py-3 text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                        Retry Payment
                     </Button> */}
                     <Button onClick={handleCloseFailureModal} variant="outline" className="w-full py-3 text-base border-neutral-200 hover:bg-neutral-50">
                        Cancel
                     </Button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};