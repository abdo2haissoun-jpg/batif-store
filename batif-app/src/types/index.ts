export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  material: string | null;
  fit: string | null;
  care: string | null;
  sku: string | null;
  status: 'draft' | 'published' | 'archived';
  is_limited: boolean;
  badge: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  image_type: 'main' | 'front' | 'back' | 'detail' | 'editorial' | 'additional';
  sort_order: number;
  created_at: string;
}

export interface ProductColor {
  id: string;
  product_id: string;
  name: string;
  hex: string;
  sort_order: number;
}

export interface ProductSize {
  id: string;
  product_id: string;
  name: string;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_id: string;
  size_id: string;
  stock: number;
  sku: string | null;
}

export interface ProductWithDetails extends Product {
  product_images: ProductImage[];
  product_colors: ProductColor[];
  product_sizes: ProductSize[];
  product_variants: (ProductVariant & {
    color: ProductColor;
    size: ProductSize;
  })[];
}

export interface CartItem {
  product: ProductWithDetails;
  color: ProductColor;
  size: ProductSize;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  postal_code: string | null;
  note: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  status: 'new' | 'confirmed' | 'packing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  color: string;
  size: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface StoreSettings {
  id: string;
  store_name: string;
  store_email: string;
  store_phone: string;
  delivery_fee: number;
  currency: string;
  instagram: string;
  store_status: string;
  cities: string[];
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'packing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  new: { bg: 'bg-blue-100', text: 'text-blue-800' },
  confirmed: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  packing: { bg: 'bg-orange-100', text: 'text-orange-800' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  returned: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packing', label: 'Packing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];
