import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Mail, Lock, User, ArrowRight, AlertCircle, Phone, Sparkles, CheckCircle2 } from 'lucide-react';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Mock Signup Logic
    setTimeout(() => {
      login({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      navigate('/shop');
      setIsLoading(false);
    }, 1500);
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
            Join the Circle of <span className="text-brand-light">Nutrition.</span>
          </h2>

          <div className="space-y-8">
            {[
              { title: "Early Harvest Access", desc: "Be the first to know when new seasonal batches arrive." },
              { title: "Exclusive Bulk Rates", desc: "Unlock member-only pricing for large family or business orders." },
              { title: "AI Health Concierge", desc: "Get personalized nutritional advice powered by Gemini." }
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
            <h1 className="text-4xl font-bold text-neutral-900 mb-2 tracking-tight">Create Account</h1>
            <p className="text-neutral-500 font-light text-lg">Start your premium harvest experience today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-bg border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-medium animate-fade-in">
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900"
                  placeholder="john@example.com"
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
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900"
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900"
                  placeholder="••••••"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Confirm</label>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white hover:bg-white/80 text-neutral-900"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-brand/20 group" isLoading={isLoading}>
                Create Account <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-neutral-100 text-center">
            <p className="text-neutral-500 font-medium">
              Already have an account? {' '}
              <Link to="/login" className="text-brand font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};