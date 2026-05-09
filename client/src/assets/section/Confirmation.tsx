import { useCallback, useState, type ReactNode } from 'react';
import PinInput from '../../components/PinInput';
import { Button } from '../../components/Button';
import type { Employee } from '../../api';
import SimpleSuccess from '../../components/SimpleSuccess';
export type ConfirmationProps = {
  employee: Employee;
  onConfirm: (pin: string) => Promise<void>;
  onBackClick: () => void;
  onReset: () => void;
  children?: ReactNode;
};
export const Confirmation = ({
  employee,
  children,
  onConfirm,
  onBackClick,
  onReset
}: ConfirmationProps) => {
  const [isSuccess, setIsSucces] = useState(false);
  const handleConfirm = useCallback(
    async (pin: string) => {
      try {
        await onConfirm(pin);
        setIsSucces(true);
      } catch (e) {
        alert('Error');
      }
    },
    [onConfirm],
  );
  return (
    <>
      {!isSuccess && (
        <div className="w-full max-w-md mx-auto ">
          <div className="pt-6">
            <p className="text-2xl text-primary-350 text-center">
              Bitte geben Sie den PIN für <strong>{employee.name}</strong> von{' '}
              <strong>{employee.company.name}</strong>
            </p>
          </div>
          <PinInput onComplete={handleConfirm} />
          {children}
          <Button className="w-50 h-10 mt-5" onClick={onBackClick}>
            Zurück
          </Button>
        </div>
      )}
      {isSuccess && (
        <SimpleSuccess
          onReset={onReset}
        />
      )}
    </>
  );
};
