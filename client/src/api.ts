export type Euro = number & {_currency: '€'}
export type Product = { id: string, name: string, price: Euro}
export const BASEURL = 'http://localhost:3000'
export const getProducts = async(): Promise<Array<Product>> => {
// mock api
   const productsResponse =  await fetch(BASEURL +'/products');
   if(productsResponse.status === 200){
    return JSON.parse(await productsResponse.text())
   }else {
    throw new Error('Error getting products')
   }
}
