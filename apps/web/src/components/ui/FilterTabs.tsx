// Removed unused React import

interface FilterTabsProps<T extends string> {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  getLabel?: (tab: T) => string;
  counts?: Partial<Record<T, number | string>>;
}

export function FilterTabs<T extends string>({ 
  tabs, 
  activeTab, 
  onTabChange, 
  getLabel = (tab) => tab,
  counts 
}: FilterTabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2 mt-8">
      {tabs.map((tab) => (
        <button 
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-5 py-2 font-mono font-bold text-xs uppercase transition-all border-[3px] border-[#1A1A1A] flex items-center gap-3 ${
            activeTab === tab 
            ? 'bg-[#1A1A1A] text-white shadow-[4px_4px_0px_0px_#FFD600]' 
            : 'bg-white text-[#1A1A1A] hover:bg-[#F5F0E8] shadow-[4px_4px_0px_0px_#1A1A1A] hover:-translate-y-1'
          }`}
        >
          <span>{getLabel(tab)}</span>
          {counts?.[tab] !== undefined && (
            <span className={`px-1.5 py-0.5 min-w-[20px] text-center rounded-sm text-[10px] border-2 border-current ${
              activeTab === tab ? 'bg-white text-black' : 'bg-[#B9FF66] text-black'
            }`}>
              {counts[tab]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
