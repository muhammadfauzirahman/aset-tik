import React from 'react';

export function Table({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <thead>
      <tr className={`bg-[#EAE7E7] border-b-[3px] border-[#1A1A1A] ${className}`}>
        {children}
      </tr>
    </thead>
  );
}

export function TableHeader({ 
  children, 
  className = '', 
  sortKey, 
  onSort, 
  activeSortConfig 
}: { 
  children: React.ReactNode, 
  className?: string, 
  sortKey?: string, 
  onSort?: (key: string) => void,
  activeSortConfig?: { key: string; direction: 'asc' | 'desc' } | null
}) {
  const isSorted = activeSortConfig?.key === sortKey;
  const isAsc = activeSortConfig?.direction === 'asc';

  return (
    <th 
      className={`p-4 font-mono font-bold text-xs uppercase ${sortKey ? 'cursor-pointer hover:bg-[#FFD600] transition-colors group' : ''} ${className}`}
      onClick={sortKey && onSort ? () => onSort(sortKey) : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortKey && (
          <span className={`material-symbols-outlined text-[14px] font-black transition-opacity ${isSorted ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}>
            {isSorted ? (isAsc ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
          </span>
        )}
      </div>
    </th>
  );
}

export function TableBody({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <tr className={`border-b-2 border-[#1A1A1A] hover:bg-[#9CF0FF] transition-none ${className}`}>
      {children}
    </tr>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td className={`p-4 font-body ${className}`} {...props}>
      {children}
    </td>
  );
}
