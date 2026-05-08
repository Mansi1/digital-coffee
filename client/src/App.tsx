import { useCallback, useEffect, useMemo, useState } from 'react';
import { kioskApi, type Employee, type Product } from './api';
import { Layout } from './components/Layout';
import LoadingIcon from './assets/loading.svg?react';
import { SelectProducts } from './assets/section/SelectProducts';
import UserSelectionList from './assets/section/UserSelectionList';
import { Confirmation } from './assets/section/Confirmation';

type AppState =
  | { state: 'LOADING' | 'ERROR' }
  | { state: 'SUCCESS'; products: Array<Product>; employees: Array<Employee> };

const STEPS = ['SELECT_PRODUCT', 'SELECT_USER', 'CONFIRMATION'] as const;

type Step = (typeof STEPS)[number];
const DEFAULT_STEP: Step = STEPS[0];
function App() {
  const [appState, setAppState] = useState<AppState>({
    state: 'LOADING',
  });

  const [orderList, setOrderList] = useState<Record<string, number>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >(undefined);

  const [step, setStep] = useState<Step>(DEFAULT_STEP);

  const loadProducts = async () => {
    try {
      setAppState({ state: 'LOADING' });
      const wait = new Promise((r) => setTimeout(r, 500));
      const products = await kioskApi.getProducts();
      const employees = await kioskApi.getEmployees();
      await wait;
      setAppState({ state: 'SUCCESS', products, employees });
    } catch (e) {
      setAppState({ state: 'ERROR' });
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);

  const handleOnProductClick = (type: 'plus' | 'minus') => (id: string) => {
    setOrderList((current) => {
      if (type === 'minus') {
        const productAmount = (current[id] ?? 0) - 1;
        return { ...current, [id]: productAmount > 0 ? productAmount : 0 };
      } else {
        return { ...current, [id]: (current[id] ?? 0) + 1 };
      }
    });
  };

  const handleConfirm = async(
    employee: Employee,
    pin: string,
    orders: Array<{ productId: string; amount: number }>,
  ) => {
    if (!selectedEmployee) {
      return;
    }
    await kioskApi.order({ employeeId: employee.id, pin, orders });
  };

  return (
    <Layout>
      {appState.state === 'LOADING' && (
        <div className="flex justify-center m-4">
          <LoadingIcon className="w-50 animate-spin fill-primary-350" />
        </div>
      )}
      {appState.state === 'SUCCESS' && (
        <>
          {step === 'SELECT_PRODUCT' && (
            <SelectProducts
              products={appState.products}
              orderList={orderList}
              onNextClick={() => {
                setStep('SELECT_USER');
              }}
              onProductClick={handleOnProductClick}
            />
          )}
          {step === 'SELECT_USER' && (
            <UserSelectionList
              employees={appState.employees}
              onSelect={(employee) => {
                setSelectedEmployee(employee);
                setStep('CONFIRMATION');
              }}
            />
          )}
          {step === 'CONFIRMATION' && !!selectedEmployee && (
            <Confirmation
              employee={selectedEmployee}
              onBackClick={() => setStep('SELECT_PRODUCT')}
              onConfirm={(pin) =>
                handleConfirm(
                  selectedEmployee,
                  pin,
                  Object.entries(orderList).filter(([,amount])=> amount > 0).map(([productId, amount])=> ({productId, amount})),
                )
              }
            />
          )}
        </>
      )}
    </Layout>
  );
}

export default App;
