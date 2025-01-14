export interface User {
  userName: string;
  password: string;
  id?: number;
  cart?: Product[];
}

export interface Product {
  id: number;
  name: string;
  price?: string;
  category: string;
  color: string;
  description: string;
  image: string;
  quantity?: number;
}
