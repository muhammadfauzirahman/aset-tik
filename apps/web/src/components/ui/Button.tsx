import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-mono font-bold uppercase border-2 border-[#1A1A1A] transition-transform transition-shadow cursor-pointer";
  
  const variants = {
    primary: "bg-[#FFD600] text-[#1A1A1A] hover:bg-[#e6c200] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-2 active:translate-y-2 active:shadow-none",
    secondary: "bg-[#00E5FF] text-[#1A1A1A] hover:bg-[#00cce6] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
    danger: "bg-[#FF3366] text-white hover:bg-[#e62e5c] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
    ghost: "bg-transparent text-[#1A1A1A] border-transparent hover:bg-[#EAE7E7] hover:border-[#1A1A1A]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
