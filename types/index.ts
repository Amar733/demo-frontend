export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  collection?: string;
  isNewArrival?: boolean;
  specialPrice?: number;
  gender?: 'male' | 'female' | 'unisex';
  productType: 'perfume' | 'tea' | 'coffee' | 'powerbank' | 'earbuds' | 'toy' | 'accessory' | 'bottle' | 'study';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
