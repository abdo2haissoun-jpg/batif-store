export interface Product {
  id: string;
  name: string;
  category: 'T-Shirts' | 'Outerwear' | 'Polo Edition' | 'Shorts' | 'Accessories';
  price: number;
  originalPrice?: number;
  image: string;
  detailImage?: string;
  galleryImages?: string[];
  badge?: string;
  isLimited?: boolean;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  sku?: string;
  fabric?: string;
  gsm?: number | string;
  fit?: string;
  details?: string[];
  care?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export type Currency = 'USD' | 'MAD' | 'EUR';

export type LegalTab = 'TERMS' | 'PRIVACY' | 'COOKIE_POLICY' | 'COOKIE_PREFERENCES';

