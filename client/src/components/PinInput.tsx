import  { useState } from 'react';
import { Delete } from 'lucide-react';
import { cn } from '../functions/cn';
import { Button } from './Button';

const PinPad = ({ onComplete }: { onComplete: (pin: string) => void }) => {
  const [pin, setPin] = useState<string>("");
  const length = 4;

  const handlePress = (val: string) => {
    if (pin.length < length) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === length) onComplete(newPin);
    }
  };

  const clear = () => setPin(pin.slice(0, -1));

  return (
    <div className=" p-6 rounded-[2rem] w-100">
      {/* PIN Anzeige (Punkte) */}
      <div className="flex justify-center gap-4 mb-8">
        {[...Array(length)].map((_, i) => (
          <div
            key={i}
            className={cn(`w-4 h-4 rounded-full transition-all duration-200`,{  "bg-primary-300 scale-110":pin.length > i,
                "bg-stone-300":!(pin.length > i)
            })}
          />
        ))}
      </div>

      {/* Button Raster */}
      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <button
            key={n}
            onClick={() => handlePress(n)}
            className="h-16 rounded-xl bg-white border-b-2 border-stone-300 active:border-b-0 active:translate-y-0.5 text-2xl font-bold text-stone-700 hover:bg-stone-100 transition-all"
          >
            {n}
          </button>
        ))}

        {/* Untere Reihe */}
        <button
          onClick={() => setPin("")}
          className="h-16 rounded-xl text-stone-400 font-semibold text-sm uppercase active:scale-95"
        >
          Reset
        </button>

        <button
          onClick={() => handlePress("0")}
          className="h-16 rounded-xl bg-white border-b-2 border-stone-300 active:border-b-0 active:translate-y-0.5 text-2xl font-bold text-stone-700 hover:bg-stone-100 transition-all"
        >
          0
        </button>

        <button
          onClick={clear}
          className="h-16 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 active:scale-95 transition-all"
        >
          <Delete size={24} />
        </button>
      </div>

      {/* Bestätigen (optional, falls kein Auto-Submit gewünscht) */}
      <Button
        disabled={pin.length < length}
        onClick={() => onComplete(pin)}
        className={cn({
            "bg-primary-450 text-white shadow-md active:scale-[0.98]" : pin.length === length ,
             "bg-stone-200 text-stone-400 cursor-not-allowed": pin.length !== length 
        })}
      >
       Bestellung abschließen
      </Button>
    </div>
  );
};

export default PinPad;