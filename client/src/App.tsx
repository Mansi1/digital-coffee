import { useEffect, useMemo, useState } from 'react';
import { kioskApi, type Product } from './api';
import { ProductCard } from './components/ProductCard';
import { chunkArray } from './functions/chunkArray';
import { Layout } from './components/Layout';
import { renderPrice } from './functions/renderPrice';
import PinInput from './components/PinInput';
import { Button } from './components/Button';

type ProductState =
  | { state: 'LOADING' |'ERROR' }
  | { state: 'SUCCESS'; products: Array<Product> };
function App() {
  const [productLoadingState, setProductLoadingState] = useState<ProductState>({
    state: 'LOADING',
  });
  const [orderList, setOrderList] = useState<Record<string, number>>({});

  const loadProducts = async () => {
    try {
      setProductLoadingState({ state: 'LOADING' });
      const products = await kioskApi.getProducts();
      setProductLoadingState({ state: 'SUCCESS', products });
    } catch (e) {
      setProductLoadingState({ state: 'ERROR' });
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

  const totalPrice = useMemo(() => {
    if (productLoadingState.state !== 'SUCCESS') {
      return 0;
    }
    return Object.entries(orderList).reduce((prev, [productId, amount]) => {
      if (amount > 0) {
        const product = productLoadingState.products.find(
          (product) => product.id == productId,
        );
        if (product) {
          return prev + amount * product.price;
        }
      }
      return prev;
    }, 0);
  }, [orderList, productLoadingState]);

  return (
    <Layout>
      {productLoadingState.state === 'SUCCESS' && (
        <>
          <div className="flex justify-center">
            <div className="flex flex-col gap-y-5 mt-8 m-4">
              {chunkArray(productLoadingState.products).map(
                (productChunk, index) => (
                  <div
                    key={'junk-id' + index}
                    className="flex flex-row gap-5 flex-wrap justify-self-start"
                  >
                    {productChunk.map((p) => (
                      <ProductCard
                        key={p.id + '-porduct-card'}
                        product={p}
                        amount={orderList[p.id] ?? 0}
                        onPlusClick={handleOnProductClick('plus')}
                        onMinusClick={handleOnProductClick('minus')}
                      />
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              disabled={totalPrice === 0}
              onClick={() => {}}
            >
              Weiter {renderPrice(totalPrice)}
            </Button>
          </div>
          <PinInput  onComplete={(pin)=> {alert(pin)}} />
        </>
      )}
    </Layout>
  );
}

export default App;
