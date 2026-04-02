import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#1A1A1A] opacity-60" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border-[4px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] w-full max-w-md z-10 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#1A1A1A] text-white p-4 border-b-2 border-[#1A1A1A]">
          <h3 className="font-mono font-black uppercase text-lg tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="hover:text-[#FFD600] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold">close</span>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
