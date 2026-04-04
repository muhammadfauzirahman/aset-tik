import React from 'react';

interface DetailFieldProps {
  label: string;
  value: string | number | undefined | null;
  icon?: string;
  className?: string;
  fullWidth?: boolean;
  variant?: 'boxy' | 'clean';
}

export const DetailField: React.FC<DetailFieldProps> = ({
  label,
  value,
  icon,
  className = "",
  fullWidth = false,
  variant = 'clean'
}) => {
  if (value === undefined || value === null || value === '') return null;

  if (variant === 'boxy') {
    return (
      <div className={`p-4 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-1 ${fullWidth ? 'col-span-full' : ''} ${className}`}>
        <div className="flex items-center gap-2 opacity-50">
          {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className="text-sm font-bold text-[#1A1A1A]">
          {value}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-between items-center py-2 border-b border-black border-dotted last:border-0 hover:bg-gray-50 px-1 transition-colors ${fullWidth ? 'col-span-full' : ''} ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-[14px] opacity-40">{icon}</span>}
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">{label}</span>
      </div>
      <div className="text-sm font-bold text-[#1A1A1A] text-right">
        {value}
      </div>
    </div>
  );
};
