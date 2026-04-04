import React from 'react';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  options: string[];
}

export function FilterTabs({ activeFilter, onFilterChange, options }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-8">
      {options.map((tab) => (
        <button 
          key={tab}
          onClick={() => onFilterChange(tab)}
          className={`px-5 py-2 font-mono font-bold text-sm uppercase transition-all border-[3px] border-[#1A1A1A] ${
            activeFilter === tab 
            ? 'bg-[#1A1A1A] text-white shadow-[4px_4px_0px_0px_#FFD600]' 
            : 'bg-white text-[#1A1A1A] hover:bg-[#F5F0E8] shadow-[4px_4px_0px_0px_#1A1A1A] hover:-translate-y-1'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
