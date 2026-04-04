import React from 'react';

interface SummaryItem {
  label: string;
  value: string | number;
  color: 'green' | 'yellow' | 'blue' | 'white';
}

interface SummaryGridProps {
  items: SummaryItem[];
}

export function SummaryGrid({ items }: SummaryGridProps) {
  const bgColorMap = {
    green: 'bg-[#B9FF66]',
    yellow: 'bg-[#FFD600]',
    blue: 'bg-[#00E5FF]',
    white: 'bg-white',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className={`${bgColorMap[item.color]} border-[3px] border-[#1A1A1A] p-5 shadow-[6px_6px_0px_0px_#1A1A1A]`}
        >
          <h3 className="font-mono font-bold uppercase text-xs mb-2 opacity-80">{item.label}</h3>
          <p className="font-mono font-black text-3xl">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
