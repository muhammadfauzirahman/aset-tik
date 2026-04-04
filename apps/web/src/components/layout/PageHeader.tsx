import React from 'react';
import { Button } from '../ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string; // Keep for backward compatibility if needed
  onAdd?: () => void;
  onAddClick?: () => void; // Keep for backward compatibility
  addLabel?: string;
  addButtonLabel?: string; // Keep for backward compatibility
  icon?: string;
  addButtonIcon?: string; // Keep for backward compatibility
}

export function PageHeader({ 
  title, 
  subtitle,
  description, 
  onAdd,
  onAddClick, 
  addLabel,
  addButtonLabel, 
  icon = 'add',
  addButtonIcon
}: PageHeaderProps) {
  const displaySubtitle = subtitle || description;
  const handleAdd = onAdd || onAddClick;
  const label = addLabel || addButtonLabel || 'Tambah';
  const displayIcon = icon || addButtonIcon || 'add';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
      <div>
        <h1 className="text-3xl font-mono font-black uppercase tracking-tight text-[#1A1A1A]">{title}</h1>
        {displaySubtitle && (
          <p className="font-body opacity-80 mt-1 max-w-2xl">{displaySubtitle}</p>
        )}
      </div>
      {handleAdd && (
        <Button onClick={handleAdd} size="lg">
          <span className="material-symbols-outlined mr-2">{displayIcon}</span>
          {label}
        </Button>
      )}
    </div>
  );
}
