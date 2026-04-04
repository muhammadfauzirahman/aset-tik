import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string; // e.g. "max-w-md", "max-w-2xl", "max-w-4xl"
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}

const sizeClasses = {
  xs: 'max-w-sm',
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw]'
};

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth,
  size = 'md',
  closeOnOverlayClick = true
}: ModalProps) {
  const widthClass = maxWidth || sizeClasses[size];
  // Close on Escape key & Disable body scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#1A1A1A] opacity-60" 
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white border-[4px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] w-full ${widthClass} z-10 flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="flex justify-between items-center bg-[#1A1A1A] text-white p-4 border-b-2 border-[#1A1A1A] sticky top-0 z-20">
          <h3 className="font-mono font-black uppercase text-lg tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="hover:text-[#FFD600] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold">close</span>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
