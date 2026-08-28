import React from 'react';
import { CheckCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-black text-white px-5 py-3.5 border border-white/20 shadow-2xl flex items-center gap-3 font-inter-tight text-xs font-normal tracking-wider uppercase">
        <Info className="w-4 h-4 text-[#FF3300]" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-3 text-white/60 hover:text-white text-base leading-none cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
};
