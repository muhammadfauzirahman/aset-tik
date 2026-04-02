import { useState, useEffect } from 'react';

const COLORS = [
  { id: 'red', hex: '#FF3B30', label: 'MERAH' },
  { id: 'blue', hex: '#007AFF', label: 'BIRU' },
  { id: 'yellow', hex: '#FFCC00', label: 'KUNING' },
  { id: 'green', hex: '#34C759', label: 'HIJAU' },
  { id: 'black', hex: '#1A1A1A', label: 'HITAM' },
];

interface SequenceCaptchaProps {
  onSuccess: () => void;
  sequenceLength?: number;
}

export function SequenceCaptcha({ onSuccess, sequenceLength = 3 }: SequenceCaptchaProps) {
  const [targetSequence, setTargetSequence] = useState<typeof COLORS>([]);
  const [availableColors, setAvailableColors] = useState<typeof COLORS>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'error'>('idle');

  const generateCaptcha = () => {
    // Pick unique colors to show
    const shuffled = [...COLORS].sort(() => 0.5 - Math.random());
    const selectedOptions = shuffled.slice(0, 4);

    // Create a target sequence from the selected options
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
        sequence.push(selectedOptions[Math.floor(Math.random() * selectedOptions.length)]);
    }

    setTargetSequence(sequence);
    setAvailableColors(selectedOptions);
    setUserSequence([]);
    setStatus('idle');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleColorClick = (colorId: string) => {
    const newUserSequence = [...userSequence, colorId];
    
    // Check if current click is correct so far
    const isCorrectSoFar = newUserSequence.every((col, idx) => col === targetSequence[idx].id);
    
    if (!isCorrectSoFar) {
      // Wrong move, reset
      setStatus('error');
      setUserSequence([]);
      setTimeout(() => {
        generateCaptcha();
      }, 500);
      return;
    }

    setUserSequence(newUserSequence);

    // Check if done
    if (newUserSequence.length === targetSequence.length) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full border-[3px] border-[#1A1A1A] p-4 bg-white shadow-[4px_4px_0px_0px_#1A1A1A]">
      <div className="font-mono font-bold text-xs uppercase text-center bg-[#FFD600] p-1 border-[2px] border-[#1A1A1A]">
        SISTEM KEAMANAN KAPCA
      </div>
      
      <div className="text-center font-mono text-sm leading-relaxed p-2 bg-[#F5F0E8] border-2 border-[#1A1A1A]">
        Klik warna sesuai urutan berikut:
        <div className="font-black mt-1 text-[#1A1A1A] text-lg">
          {targetSequence.map(c => c.label).join(' ➔ ')}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-2">
        {availableColors.map((color) => (
          <button
            type="button"
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            style={{ backgroundColor: color.hex }}
            className={`w-12 h-12 border-[3px] border-[#1A1A1A] cursor-pointer hover:-translate-y-1 active:translate-y-1 transition-transform ${
              status === 'error' ? 'animate-bounce' : ''
            }`}
            aria-label={color.label}
          />
        ))}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-2 h-4">
        {targetSequence.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-3 h-3 border-2 border-[#1A1A1A] ${
              idx < userSequence.length ? 'bg-[#FFD600]' : 'bg-transparent'
            }`} 
          />
        ))}
      </div>

      {status === 'error' && (
        <div className="text-red-500 font-mono font-bold text-xs text-center uppercase animate-pulse">
          SALAH! COBA LAGI.
        </div>
      )}
    </div>
  );
}
