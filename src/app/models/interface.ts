export interface User {
  userName: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  price?: string ;
  category: string;
  color: string;
  description: string;
  image: string;
  quantity?: number;
}
