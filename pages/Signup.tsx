import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp, setAuthCookie } from '../services/authService';
import { Button } from '../components/Button';
import { Mail, User, ArrowRight, AlertCircle, Phone, Sparkles, CheckCircle2, Lock, ArrowLeft, PartyPopper } from 'lucide-react';

export const Signup: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Info form, 2 = OTP verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  // Step 1: Send OTP to phone
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    // Phone validation (10 digit Indian number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      setIsLoading(false);
      return;
    }

    try {
      await sendOtp({ phone: formData.phone });
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await verifyOtp({
        phone: formData.phone,
        otp,
        name: formData.name,
        userEmail: formData.email || undefined
      });

      if (response.data?.token) {
        // Save token in cookie
        setAuthCookie(response.data.token);
      }

      // Fetch user profile to populate AuthContext
      await fetchUserProfile();

      // Show success modal
      setShowSuccessModal(true);

    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row-reverse">
      {/* Visual side: Benefits */}
      <div className="hidden md:flex md:w-5/12 bg-brand relative flex-col items-center justify-center p-12 pt-32 lg:p-20 lg:pt-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-light/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-brand-dark/40 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 text-white w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/20 w-fit">
            <Sparkles className="text-brand-light" size={32} />
          </div>

          <h2 className="text-5xl font-bold tracking-tight mb-10 leading-tight">
            Premium Dry Fruits & <span className="text-brand-light">Cashews.</span>
          </h2>

          <div className="space-y-8">
            {[
              { title: "Farm Fresh Quality", desc: "Directly sourced from trusted farms. Pure, natural, and preservative-free." },
              { title: "Wholesale Prices", desc: "Get the best rates on bulk orders for home, events, or business needs." },
              { title: "Free Delivery", desc: "Enjoy free shipping on orders above ₹500 across India." }
            ].map((benefit, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-brand-light group-hover:bg-white group-hover:text-brand transition-all">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{benefit.title}</h4>
                  <p className="text-brand-100 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Logo Floating */}
        <div className="absolute top-12 right-12">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-white">KCnuts.</span>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand font-bold text-xl shadow-lg">KC</div>
          </Link>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-12 md:px-12 md:pt-40 lg:px-24 bg-neutral-50/30">
        <div className="max-w-md w-full">
          {/* Mobile Logo Only */}
          <div className="md:hidden text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl">KC</div>
              <span className="text-2xl font-bold tracking-tight text-neutral-900">KCnuts.</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
              {step === 1 ? 'Create Account' : 'Verify OTP'}
            </h1>
            <p className="text-neutral-500 font-light text-lg">
              {step === 1
                ? 'Start your premium harvest experience today'
                : `Enter the OTP sent to ${formData.phone}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-bg border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-medium animate-fade-in">
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          {step === 1 ? (
            // Step 1: User Information Form
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Email (Optional)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-brand/20 group" isLoading={isLoading}>
                  Continue <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </div>
            </form>
          ) : (
            // Step 2: OTP Verification
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Enter OTP</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900 text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2 ml-1">
                  OTP sent to <span className="font-semibold">{formData.phone}</span>
                </p>
              </div>

              <div className="pt-6 space-y-3">
                <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-brand/20 group" isLoading={isLoading}>
                  Verify & Create Account <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(''); setError(''); }}
                  className="w-full py-3 text-neutral-600 hover:text-brand font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft size={18} /> Change Phone Number
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-neutral-100 text-center">
            <p className="text-neutral-500 font-medium">
              Already have an account? {' '}
              <Link to="/login" className="text-brand font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-scale-in">
            <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="text-brand" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Welcome to KCnuts!</h2>
            <p className="text-neutral-600 mb-8">
              Your account has been created successfully. Start exploring our premium collection of dry fruits and nuts.
            </p>
            <Button onClick={handleSuccessModalClose} className="w-full py-4 shadow-lg shadow-brand/20">
              Start Shopping <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};