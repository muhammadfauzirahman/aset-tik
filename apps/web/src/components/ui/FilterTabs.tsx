import React from 'react';

interface FilterTabsProps<T extends string> {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  getLabel?: (tab: T) => string;
}

export function FilterTabs<T extends string>({ 
  tabs, 
  activeTab, 
  onTabChange, 
  getLabel = (tab) => tab 
}: FilterTabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2 mt-8">
      {tabs.map((tab) => (
        <button 
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-2 font-mono font-bold text-sm uppercase transition-all border-[3px] border-[#1A1A1A] ${
            activeTab === tab 
            ? 'bg-[#1A1A1A] text-white shadow-[4px_4px_0px_0px_#FFD600]' 
            : 'bg-white text-[#1A1A1A] hover:bg-[#F5F0E8] shadow-[4px_4px_0px_0px_#1A1A1A] hover:-translate-y-1'
          }`}
        >
          {getLabel(tab)}
        </button>
      ))}
    </div>
  );
}
