import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'primary' | 'secondary' | 'danger' | 'accent' | 'default';
  children: React.ReactNode;
}

export function Card({ children, color = 'default', className = '', ...props }: CardProps) {
  const shadows = {
    primary: 'shadow-[6px_6px_0px_0px_#FFD600]',
    secondary: 'shadow-[6px_6px_0px_0px_#00E5FF]',
    danger: 'shadow-[6px_6px_0px_0px_#FF3366]',
    accent: 'shadow-[6px_6px_0px_0px_#B388FF]',
    default: 'shadow-[6px_6px_0px_0px_#1A1A1A]',
  };

  return (
    <div 
      className={`bg-white border-[3px] border-[#1A1A1A] ${shadows[color]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-4 border-b-[3px] border-[#1A1A1A] bg-[#1A1A1A] text-white ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <h4 className={`font-mono font-bold uppercase text-sm ${className}`}>
      {children}
    </h4>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
