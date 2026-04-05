import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export function Input({ label, className = '', containerClassName = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col space-y-1 w-full ${containerClassName}`}>
      {label && <label className="font-mono font-bold uppercase text-xs">{label}</label>}
      <input 
        className={`border-2 border-[#1A1A1A] p-2 font-body text-sm bg-white outline-none focus:border-[#FFD600] focus:shadow-[4px_4px_0px_0px_#FFD600] transition-all rounded-none ${className}`}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  containerClassName?: string;
}

export function Select({ label, options, className = '', containerClassName = '', ...props }: SelectProps) {
  return (
    <div className={`flex flex-col space-y-1 w-full ${containerClassName}`}>
      {label && <label className="font-mono font-bold uppercase text-xs tracking-tight">{label}</label>}
      <div className="relative group">
        <select 
          className={`w-full border-2 border-black p-2 pr-10 font-body text-sm bg-[#FDFDFF] outline-none hover:bg-white focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_0px_#00E5FF] transition-all rounded-none cursor-pointer appearance-none ${className}`}
          {...props}
        >
          <option value="" disabled>Pilih Opsi</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none border-l-2 border-black bg-[#F2F2F7] group-hover:bg-[#E5E5EA] transition-colors">
          <span className="material-symbols-outlined text-sm font-bold">expand_more</span>
        </div>
      </div>
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerClassName?: string;
}

export function Textarea({ label, className = '', containerClassName = '', ...props }: TextareaProps) {
  return (
    <div className={`flex flex-col space-y-1 w-full ${containerClassName}`}>
      {label && <label className="font-mono font-bold uppercase text-xs">{label}</label>}
      <textarea 
        className={`border-2 border-[#1A1A1A] p-2 font-body text-sm bg-white outline-none focus:border-[#FFD600] focus:shadow-[4px_4px_0px_0px_#FFD600] transition-all rounded-none min-h-[100px] ${className}`}
        {...props}
      />
    </div>
  );
}
