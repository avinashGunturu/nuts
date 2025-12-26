import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'black' | 'white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 rounded-full tracking-wide";
  
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark hover:shadow-glow hover:shadow-brand/40",
    secondary: "bg-brand-50 text-brand-dark hover:bg-brand-100",
    outline: "border border-neutral-200 text-neutral-900 hover:border-brand hover:text-brand bg-transparent",
    ghost: "text-neutral-600 hover:bg-neutral-50 hover:text-brand-dark",
    black: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl",
    white: "bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg hover:shadow-xl",
  };

  const sizes = {
    sm: "px-4 py-2 text-caption-bold",
    md: "px-6 py-3.5 text-body-bold",
    lg: "px-8 py-4 text-heading-3",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
      {children}
    </button>
  );
};