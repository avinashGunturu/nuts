import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp, setAuthCookie } from '../services/authService';
import { Button } from '../components/Button';
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, Phone, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Enter phone/email, 2 = Enter OTP
  const [identifier, setIdentifier] = useState('');
  const [inputType, setInputType] = useState<'phone' | 'email'>('phone');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (inputType === 'phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(identifier)) {
        setError('Please enter a valid 10-digit Indian mobile number');
        setIsLoading(false);
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }
    }

    try {
      const payload = inputType === 'phone'
        ? { phone: identifier }
        : { email: identifier };

      await sendOtp(payload);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = inputType === 'phone'
        ? { phone: identifier, otp }
        : { email: identifier, otp };

      const response = await verifyOtp(payload);

      if (response.data?.token) {
        // Save token in cookie
        setAuthCookie(response.data.token);
      }

      // Fetch user profile to populate AuthContext
      await fetchUserProfile();

      // Redirect to shop
      navigate('/shop');

    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInputType = () => {
    setInputType(prev => prev === 'phone' ? 'email' : 'phone');
    setIdentifier('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side: Visuals (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-neutral-900 relative items-center justify-center overflow-hidden p-12 pt-32 lg:p-20 lg:pt-40">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596328330761-46820572d421?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40 scale-110 animate-pulse-slow"
            alt="Premium harvest"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
        </div>

        <div className="relative z-10 px-12 lg:px-20 text-white max-w-xl">
          <div className="w-16 h-1 bg-brand-light mb-8 rounded-full" />
          <h2 className="text-5xl lg:text-7xl font-bold leading-tight mb-8 tracking-tight">
            The Source of <span className="text-brand-light">Purity.</span>
          </h2>
          <p className="text-xl text-neutral-300 font-light leading-relaxed mb-12">
            Sign in to access your curated selection of the world's finest dry fruits and nuts, delivered with love.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] font-bold">
                  {i === 4 ? '50k+' : <ShieldCheck size={14} />}
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Trusted by thousands</p>
          </div>
        </div>

        {/* Brand Logo Floating */}
        <div className="absolute top-12 left-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">KC</div>
            <span className="text-2xl font-bold tracking-tight text-white">KCnuts.</span>
          </Link>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-12 md:px-12 md:pt-40 lg:px-24">
        <div className="max-w-md w-full">
          {/* Mobile Logo Only */}
          <div className="md:hidden text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl">KC</div>
              <span className="text-2xl font-bold tracking-tight text-neutral-900">KCnuts.</span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
              {step === 1 ? 'Welcome back' : 'Verify OTP'}
            </h1>
            <p className="text-neutral-500 font-light text-lg">
              {step === 1
                ? 'Continue your healthy journey with KCnuts'
                : `Enter the OTP sent to ${identifier}`}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-error-bg border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-medium animate-fade-in-up">
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          {step === 1 ? (
            // Step 1: Enter Phone or Email
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">
                  {inputType === 'phone' ? 'Mobile Number' : 'Email Address'}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                    {inputType === 'phone' ? <Phone size={20} /> : <Mail size={20} />}
                  </div>
                  <input
                    type={inputType === 'phone' ? 'tel' : 'email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-neutral-50/50 hover:bg-neutral-50 text-neutral-900"
                    placeholder={inputType === 'phone' ? '9876543210' : 'name@example.com'}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleInputType}
                  className="text-sm font-medium text-brand hover:underline"
                >
                  Use {inputType === 'phone' ? 'Email' : 'Phone'} instead
                </button>
              </div>

              <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-brand/20 group" isLoading={isLoading}>
                Send OTP <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </form>
          ) : (
            // Step 2: Enter OTP
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">
                  Enter OTP
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-neutral-50/50 hover:bg-neutral-50 text-neutral-900 text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2 ml-1">
                  OTP sent to <span className="font-semibold">{identifier}</span>
                </p>
              </div>

              <div className="space-y-3">
                <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-brand/20 group" isLoading={isLoading}>
                  Verify & Sign In <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(''); setError(''); }}
                  className="w-full py-3 text-neutral-600 hover:text-brand font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft size={18} /> Change {inputType === 'phone' ? 'Number' : 'Email'}
                </button>
              </div>
            </form>
          )}

          {/* Social Proof Placeholder */}
          <div className="mt-12 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-white px-4 text-neutral-400 font-bold">New to the Circle?</span>
              </div>
            </div>

            <Link to="/signup">
              <Button variant="outline" className="w-full py-4 border-2 border-neutral-100 hover:bg-neutral-50">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};