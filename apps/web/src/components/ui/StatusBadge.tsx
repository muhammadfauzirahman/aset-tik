import React from 'react';
import { Badge } from './Badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = (s: string) => {
    const normalized = s.toLowerCase();
    if (normalized.includes('aktif') || normalized.includes('pemerintah') || normalized.includes('sendiri') || normalized.includes('terhubung')) return 'success';
    if (normalized.includes('perbaikan') || normalized.includes('bumn') || normalized.includes('terbatas')) return 'yellow' as any;
    if (normalized.includes('non-aktif') || normalized.includes('rusak') || normalized.includes('danger')) return 'danger';
    return 'secondary';
  };

  return (
    <Badge color={getStatusColor(status)} className={className}>
      {status}
    </Badge>
  );
};
