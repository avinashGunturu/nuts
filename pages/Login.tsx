import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock Login Logic
    setTimeout(() => {
      if (email && password.length >= 6) {
        login({
          name: 'Rajesh Sharma',
          email: email,
          phone: '+91 9876543210'
        });
        navigate('/shop');
      } else {
        setError('Invalid email or password (min 6 characters)');
      }
      setIsLoading(false);
    }, 1000);
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
            <h1 className="text-4xl font-bold text-neutral-900 mb-2 tracking-tight">Welcome back</h1>
            <p className="text-neutral-500 font-light text-lg">Continue your healthy journey with KCnuts</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-error-bg border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-medium animate-fade-in-up">
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-neutral-50/50 hover:bg-neutral-50 text-neutral-900"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-xs font-bold text-brand hover:underline">Forgot password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 rounded-2xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-neutral-50/50 hover:bg-neutral-50 text-neutral-900"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-brand/20 group" isLoading={isLoading}>
              Sign In <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </form>

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