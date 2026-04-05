interface Metric {
  label: string;
  value: string | number;
  icon?: string;
  color?: 'blue' | 'yellow' | 'green' | 'red' | 'cyan' | 'gray';
}

interface MetricPillsProps {
  metrics: Metric[];
}

export function MetricPills({ metrics }: MetricPillsProps) {
  const getColorClasses = (color: Metric['color']) => {
    switch (color) {
      case 'blue': return 'bg-[#9CF0FF]';
      case 'yellow': return 'bg-[#FFD600]';
      case 'green': return 'bg-[#B9FF66]';
      case 'red': return 'bg-[#FF90E8]'; // Pinkish-red for brutalist
      case 'cyan': return 'bg-[#00D1FF]';
      default: return 'bg-white';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {metrics.map((m, i) => (
        <div 
          key={i}
          className={`flex items-center gap-2 px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#1A1A1A] ${getColorClasses(m.color)}`}
        >
          {m.icon && (
            <span className="material-symbols-outlined text-sm font-bold">
              {m.icon}
            </span>
          )}
          <span className="text-[10px] font-mono-bold uppercase opacity-80 whitespace-nowrap">
            {m.label}:
          </span>
          <span className="text-xs font-black uppercase whitespace-nowrap">
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
}
