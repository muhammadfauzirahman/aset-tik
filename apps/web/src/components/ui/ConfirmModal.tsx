import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  loadingMessage?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  type = 'danger',
  isLoading = false,
  loadingMessage = "Memproses transaksi..."
}) => {
  const getHeaderColor = () => {
    switch (type) {
      case 'danger': return 'bg-[#FF4D4D] text-white';
      case 'warning': return 'bg-[#FFD700] text-black';
      case 'info': return 'bg-[#00E5FF] text-black';
      default: return 'bg-white text-black';
    }
  };

  const getButtonColor = () => {
    if (isLoading) return 'bg-gray-400 text-gray-700 cursor-not-allowed border-2 border-black opacity-50';
    switch (type) {
      case 'danger': return 'bg-black text-white hover:bg-red-600 transition-colors border-2 border-black';
      case 'warning': return 'bg-black text-white hover:bg-yellow-600 transition-colors border-2 border-black';
      default: return 'bg-black text-white border-2 border-black';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={isLoading ? () => {} : onClose} 
      title={title} 
      size="xs"
      showCloseButton={false}
    >
      <div className="space-y-6 pt-2">
        <div className={`p-4 border-4 border-black shadow-[4px_4px_0_0_#1A1A1A] ${getHeaderColor()}`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined font-black text-3xl">
              {isLoading ? 'sync' : (type === 'danger' ? 'warning' : type === 'warning' ? 'help' : 'info')}
            </span>
            <h3 className="font-mono-bold text-xl uppercase italic leading-none">{title}</h3>
          </div>
        </div>
        
        <div className="px-1 space-y-4">
          <p className="font-body text-sm font-bold leading-relaxed">
            {isLoading ? loadingMessage : message}
          </p>

          {isLoading && (
            <div className="w-full border-4 border-black h-8 bg-white overflow-hidden relative shadow-[4px_4px_0_0_#000]">
              {/* Segmented Loading Bar */}
              <div className="flex w-full h-full">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 border-r-2 border-black bg-[#B9FF66] animate-pulse`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t-4 border-black">
          <Button 
            onClick={onClose} 
            disabled={isLoading}
            className="flex-1 bg-white text-black hover:bg-gray-100 border-2 border-black shadow-[3px_3px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all uppercase font-black italic text-xs py-3 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </Button>
          <Button 
            onClick={() => onConfirm()} 
            disabled={isLoading}
            className={`flex-[1.5] ${getButtonColor()} shadow-[3px_3px_0_0_#000] ${!isLoading ? 'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none' : ''} transition-all uppercase font-black italic text-xs py-3`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
