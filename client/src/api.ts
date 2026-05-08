export type Euro = number & { _currency: '€' };
export type Product = {
  id: string;
  name: string;
  price: Euro;
};

export type Employee = {
  id: string;
  name: string;
  company: {
    name: string;
  };
};
export type OrderBody = {
  pin: string;
  employeeId: string;
  orders: Array<{ productId: string; amount: number }>;
};
export const BASEURL_KIOSK = 'http://localhost:3000/kiosk';

export const kioskApi = {
  getProducts: async (): Promise<Array<Product>> => {
    // mock api
    const productsResponse = await fetch(BASEURL_KIOSK + '/products');
    if (productsResponse.status === 200) {
      return JSON.parse(await productsResponse.text()).data;
    } else {
      throw new Error('Error getting products');
    }
  },
  getEmployees: async (): Promise<Array<Employee>> => {
    // mock api
    const productsResponse = await fetch(BASEURL_KIOSK + '/employees');
    if (productsResponse.status === 200) {
      return JSON.parse(await productsResponse.text()).data;
    } else {
      throw new Error('Error getting employees');
    }
  },
  order: async (data: OrderBody): Promise<void> => {
    // mock api
    const productsResponse = await fetch(BASEURL_KIOSK + '/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (productsResponse.status === 201) {
      return JSON.parse(await productsResponse.text()).data;
    } else {
      throw new Error('Error getting employees');
    }
  },
};
