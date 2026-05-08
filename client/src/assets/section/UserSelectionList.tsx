import { useState } from 'react';
import { User, Building2, ChevronRight } from 'lucide-react';
import { cn } from '../../functions/cn';
import type { Employee } from '../../api';
export type UserSelectionListProps = {
employees: Array<Employee>;
  onSelect: (employee: Employee) => void;
}
const UserSelectionList = ({
  employees,
  onSelect,
}: UserSelectionListProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (user: Employee) => {
    setSelectedId(user.id);
    onSelect(user);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="pt-6">
        <p className="text-2xl text-primary-350 text-center">Benutzer auswählen</p>
      </div>

      <div className="overflow-y-auto p-4 space-y-2">
        {employees.map((user) => {
          const isSelected = selectedId === user.id;

          return (
            <button
              key={user.id}
              onClick={() => handleSelect(user)}
              className={cn(
                // Base Styles
                'w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 border-2',
                'bg-[#be9072] border-transparent hover:border-stone-200 shadow-sm active:scale-[0.98]',
                // Conditional Styles using cn
                isSelected &&
                  'bg-primary-200 border-primary-450 shadow-md translate-x-1',
              )}
            >
              <div className="flex items-center gap-4">
                {/* Avatar Icon */}
                <div
                  className={cn(
                    'p-3 rounded-full transition-colors',
                    isSelected
                      ? 'bg-primary-350 text-white'
                      : 'bg-stone-100 text-stone-400',
                  )}
                >
                  <User size={24} />
                </div>

                {/* User Info */}
                <div className="text-left">
                  <div className="font-bold text-primary-50 text-xl leading-tight">
                    {user.name}
                  </div>
                  <div className="flex items-center gap-1 text-lg  text-primary-500 mt-1">
                    <Building2 size={14} />
                    {user.company.name}
                  </div>
                </div>
              </div>

              <ChevronRight
                className={cn(
                  'transition-all duration-300 text-primary-350 translate-x-1'
                )}
                size={20}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserSelectionList;
