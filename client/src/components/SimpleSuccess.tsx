import  { useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../functions/cn';

const SimpleSuccess = ({ onReset }: { onReset: () => void }) => {
  
  // Automatischer Reset nach 5 Sekunden für schnellen Flow
  useEffect(() => {
    const timer = setTimeout(onReset, 5000);
    return () => clearTimeout(timer);
  }, [onReset]);

  return (
    <div className='my-6'>
      <div className="m-auto max-w-sm">
        
        {/* Success Icon Animation */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <Check className="text-green-600" size={48} strokeWidth={3} />
          </div>
        </div>

        {/* Text Bereich */}
        <h1 className="text-3xl font-bold text-stone-800 mb-3 text-center">
          Vielen Dank!
        </h1>

        {/* Manueller Zurück-Button */}
        <button
          onClick={onReset}
          className={cn(
            "w-full py-4 rounded-2xl bg-stone-900 text-white font-bold transition-all",
            "hover:bg-stone-800 active:scale-95 shadow-lg shadow-stone-200"
          )}
        >
          Fertig
        </button>

        <p className="mt-6 text-sm text-stone-400 uppercase tracking-widest animate-pulse">
          Bereit für nächsten Kunden...
        </p>
      </div>
    </div>
  );
};

export default SimpleSuccess;