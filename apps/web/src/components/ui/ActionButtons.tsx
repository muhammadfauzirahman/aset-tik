import React from 'react';

interface ActionButtonsProps {
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDetail,
  onEdit,
  onDelete,
  className = ""
}) => {
  return (
    <div className={`flex justify-end gap-3 ${className}`}>
      {onDetail && (
        <button
          onClick={onDetail}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00E5FF] border-[3px] border-black rounded-none shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px]"
          title="Detail"
        >
          <span className="material-symbols-outlined text-[18px] font-black">visibility</span>
          <span className="text-[11px] font-mono-bold uppercase tracking-tight">Detail</span>
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FFD700] border-[3px] border-black rounded-none shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px]"
          title="Edit"
        >
          <span className="material-symbols-outlined text-[18px] font-black">edit</span>
          <span className="text-[11px] font-mono-bold uppercase tracking-tight">Edit</span>
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF4D4D] border-[3px] border-black rounded-none shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px]"
          title="Hapus"
        >
          <span className="material-symbols-outlined text-[18px] font-black text-white">delete</span>
          <span className="text-[11px] font-mono-bold uppercase tracking-tight text-white">Hapus</span>
        </button>
      )}
    </div>
  );
};
