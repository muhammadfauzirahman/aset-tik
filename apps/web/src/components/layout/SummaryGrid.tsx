import React from 'react';

interface SummaryItem {
  label: string;
  value: string | number;
  color?: string;
}

interface SummaryGridProps {
  items: SummaryItem[];
}

export function SummaryGrid({ items }: SummaryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`${item.color || 'bg-[#B9FF66]'} border-[3px] border-[#1A1A1A] p-5 shadow-[6px_6px_0px_0px_#1A1A1A] transition-transform hover:-translate-y-1`}
        >
          <h3 className="font-mono font-bold uppercase text-xs mb-2 opacity-70 tracking-wider font-mono-bold">
            {item.label}
          </h3>
          <p className="font-mono font-black text-4xl text-[#1A1A1A]">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
