import type { Product } from '../api';
import coffeeLogo from '../assets/coffee.svg';
import MinusIcon from '../assets/minus.svg?react';
import { cn } from '../functions/cn';
import { renderPrice } from '../functions/renderPrice';
export type ProductCardProps = {
  product: Product;
  amount: number;
  onPlusClick: (id: string) => void;
  onMinusClick: (id: string) => void;
};
export const ProductCard = ({
  amount,
  product,
  onMinusClick,
  onPlusClick,
}: ProductCardProps) => {
  return (
    <>
      <div
        className={cn(
          'text-primary-100 bg-primary-250 border-2 border-primary-350 rounded-2xl w-50',
          {
            '': amount > 0,
          },
        )}
      >
        {amount > 0 && (
          <button
            className="cursor-pointer absolute flex justify-center w-max"
            onClick={() => onMinusClick(product.id)}
          >
            <MinusIcon className="h-10 rounded-tl-2xl rounded-br-2xl bg-primary-150" />
          </button>
        )}
        <div
          className="h-full flex flex-col"
          onClick={() => onPlusClick(product.id)}
        >
          <button className="px-10 pt-15 cursor-pointer mb-4">
            <div className="flex justify-center">
              <img src={coffeeLogo} width={100} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl">{product.name}</h2>
              <div className="text-xl">{renderPrice(product.price)}</div>
            </div>
          </button>
          <div
            className={cn(
              'text-center bg-black/60 rounded-b-2xl text-xl py-2 ',
              {
                'opacity-0': amount < 1,
              },
            )}
          >
            {amount}
          </div>
        </div>
      </div>
    </>
  );
};
