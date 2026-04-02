import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'black';
  children: React.ReactNode;
}

export function Badge({ children, color = 'primary', className = '', ...props }: BadgeProps) {
  const colors = {
    primary: 'bg-[#FFD600] text-[#1A1A1A]',
    secondary: 'bg-[#00E5FF] text-[#1A1A1A]',
    danger: 'bg-[#FF3366] text-white',
    success: 'bg-[#00E676] text-[#1A1A1A]',
    black: 'bg-[#1A1A1A] text-white',
  };

  return (
    <span 
      className={`px-2 py-1 text-xs font-bold uppercase ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
