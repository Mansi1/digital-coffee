import { useEffect, useState } from 'react';
import reactLogo from './assets/logo.png';
import { getProducts, type Product } from './api';
import { ProductCard } from './components/ProductCard';
import { chunkArray } from './functions/chunkArray';
type ProductState = Array<Product>;
function App() {
  const [products, setProducts] = useState<ProductState>([]);
  const [orderList, setOrderList] = useState<Record<string, number>>({});

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleOnProductClick = (type: 'plus' |'minus')=>(id: string)=> {
    setOrderList(current => {
      if(type === 'minus'){
        const productAmount = (current[id] ?? 0) -1
        return {...current, [id]: productAmount> 0 ?productAmount:0}
      }else {
          return {...current, [id]: (current[id] ?? 0)+1}
      }
    })
  }

  return (
    <main>
      <div>
        <div className="flex justify-center">
          <img src={reactLogo} width={200} />
        </div>
        <h1 className="text-4xl text-center text-y">Digitale Kaffeliste</h1>
      </div>

      <div className="flex justify-center">
      <div className="flex flex-col gap-y-5 mt-8 mx-4">
        {chunkArray(products).map((productChunk, index) => <div key={"junk-id"+ index} className="flex flex-row gap-5 flex-wrap justify-self-start">
          {productChunk.map((p) => (
            <ProductCard key={p.id+'-porduct-card'} 
            product={p} 
            amount={orderList[p.id] ?? 0}
            onPlusClick={handleOnProductClick('plus')} 
            onMinusClick={handleOnProductClick('minus')} 
            />
          ))}
        </div>)}
      
        
      </div>
      </div>
    </main>
  );
}

export default App;
