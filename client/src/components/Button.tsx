import type { ReactNode } from 'react';
import { cn } from '../functions/cn';
export type ButtonProps = {
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  children?: ReactNode;
};
export const Button = ({
  disabled,
  onClick,
  className,
  children,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'w-full h-14 rounded-xl flex items-center justify-center transition-all bg-primary-450 text-white shadow-md active:scale-[0.98] cursor-pointer',
        {"bg-stone-200 text-stone-400 cursor-not-allowed": disabled},
        className,
      )}
    >
      {children}
    </button>
  );
};
