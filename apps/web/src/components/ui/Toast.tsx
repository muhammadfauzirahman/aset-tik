import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const success = (msg: string) => addToast(msg, 'success');
  const error = (msg: string) => addToast(msg, 'error');
  const info = (msg: string) => addToast(msg, 'info');
  const warning = (msg: string) => addToast(msg, 'warning');

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success': return 'bg-[#B9FF66] text-black border-[#000]';
      case 'error': return 'bg-[#FF4D4D] text-white border-[#000]';
      case 'warning': return 'bg-[#FFD700] text-black border-[#000]';
      case 'info': return 'bg-[#00E5FF] text-black border-[#000]';
      default: return 'bg-white text-black border-[#000]';
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
    }
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none max-w-md w-full">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto
              flex items-center gap-4 p-5
              border-4 ${getToastColors(toast.type)}
              shadow-[8px_8px_0px_0px_#1A1A1A]
              font-mono-bold uppercase italic tracking-tighter
              animate-in slide-in-from-right duration-300
            `}
          >
            <span className="material-symbols-outlined font-black text-2xl">
              {getIcon(toast.type)}
            </span>
            <span className="flex-1 text-sm leading-tight">
              {toast.message}
            </span>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined font-black text-lg">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
