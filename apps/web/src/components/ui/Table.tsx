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

export function TableHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <th className={`p-4 font-mono font-bold text-xs uppercase ${className}`}>
      {children}
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
