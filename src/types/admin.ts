
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category_id: number;
  merchandise?: string | null;
}
