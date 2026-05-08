export type Euro = number & {_currency: '€'}
export type Product = { id: string, name: string, price: Euro}

export const getProducts = async(): Promise<Array<Product>> => {
// mock api
   const productsResponse =  await fetch('/products.json');
   if(productsResponse.status === 200){
    return JSON.parse(await productsResponse.text())
   }else {
    throw new Error('Error getting products')
   }
}
