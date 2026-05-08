import type { ReactNode } from 'react';
import PinInput from '../../components/PinInput';
import { Button } from '../../components/Button';
import type { Employee } from '../../api';
export type ConfirmationProps = {
  employee: Employee;
  onConfirm: (pin: string) => void;
  onBackClick: () => void;
  children?: ReactNode;
};
export const Confirmation = ({
  employee,
  children,
  onConfirm,
  onBackClick
}: ConfirmationProps) => {
  return (
    <div className="w-full max-w-md mx-auto ">
      <div className="pt-6">
        <p className="text-2xl text-primary-350 text-center">
          Bitte geben Sie den PIN für <strong>{employee.name}</strong> von{' '}
          <strong>{employee.company.name}</strong>
        </p>
      </div>
      {children}
      <PinInput onComplete={onConfirm} />
      <Button className='w-50 h-10' onClick={onBackClick}>Zurück</Button>
    </div>
  );
};
