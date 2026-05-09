import { useMemo } from 'react';
import type { Product } from '../../api';
import { Button } from '../../components/Button';
import { ProductCard } from '../../components/ProductCard';
import { chunkArray } from '../../functions/chunkArray';
import { renderPrice } from '../../functions/renderPrice';

export type SelectProductsProps = {
  products: Array<Product>;
  orderList: Record<string, number>;
  onProductClick: (type: 'minus' | 'plus') => (productId: string) => void;
  onNextClick: () => void;
};
export const SelectProducts = ({
  products,
  orderList,
  onNextClick,
  onProductClick,
}: SelectProductsProps) => {
  const totalPrice = useMemo(() => {
    return Object.entries(orderList).reduce((prev, [productId, amount]) => {
      if (amount > 0) {
        const product = products.find((product) => product.id == productId);
        if (product) {
          return prev + amount * product.price;
        }
      }
      return prev;
    }, 0);
  }, [orderList, products]);

  return (
    <>
      <div className="pt-6">
        <p className="text-2xl text-primary-350 text-center">
          Bitte wählen Sie Ihre Produkte aus!
        </p>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-y-5 mt-8 m-4">
          {chunkArray(products).map((productChunk, index) => (
            <div
              key={'junk-id' + index}
              className="flex flex-row gap-5 flex-wrap justify-self-start items-stretch"
            >
              {productChunk.map((p) => (
                <ProductCard
                  key={p.id + '-porduct-card'}
                  product={p}
                  amount={orderList[p.id] ?? 0}
                  onPlusClick={onProductClick('plus')}
                  onMinusClick={onProductClick('minus')}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          className="w-50 text-xl"
          disabled={totalPrice === 0}
          onClick={onNextClick}
        >
          Weiter {renderPrice(totalPrice)}
        </Button>
      </div>
    </>
  );
};
