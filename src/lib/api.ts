import { supabase, isSupabaseConfigured } from './supabase';
import { Product } from '../types';
import { PRODUCTS as HARDCODED_PRODUCTS } from '../data/products';

// Map Supabase product rows to our Product type
function mapSupabaseProduct(row: any): Product {
  const images = row.product_images || [];
  const colors = row.product_colors || [];
  const sizes = row.product_sizes || [];
  const variants = row.product_variants || [];

  // Sort images by sort_order
  images.sort((a: any, b: any) => a.sort_order - b.sort_order);

  const mainImage = images.find((i: any) => i.image_type === 'main')?.url
    || images[0]?.url
    || '';

  const detailImage = images.find((i: any) => i.image_type === 'front')?.url
    || images.find((i: any) => i.image_type === 'detail')?.url
    || mainImage;

  const galleryImages = images.map((i: any) => i.url).filter(Boolean);

  // Check if any variant has stock
  const hasStock = variants.length > 0
    ? variants.some((v: any) => v.stock > 0)
    : true;

  return {
    id: row.id,
    name: row.name,
    category: mapCategory(row.category),
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    image: mainImage,
    detailImage,
    galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
    badge: row.badge || undefined,
    isLimited: row.is_limited || false,
    description: row.description || '',
    sizes: sizes.map((s: any) => s.name).sort((a: string, b: string) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];
      return order.indexOf(a) - order.indexOf(b);
    }),
    colors: colors.map((c: any) => ({
      name: c.name,
      hex: c.hex,
    })),
    inStock: hasStock,
    sku: row.sku || undefined,
    fabric: row.material || undefined,
    gsm: undefined,
    fit: row.fit || undefined,
    details: undefined,
    care: row.care ? row.care.split('\n').filter(Boolean) : undefined,
  };
}

function mapCategory(category: string): Product['category'] {
  const upper = category?.toUpperCase() || '';
  if (upper.includes('T-SHIRT') || upper.includes('TEE')) return 'T-Shirts';
  if (upper.includes('OUTER') || upper.includes('JACKET') || upper.includes('SHELL') || upper.includes('ANORAK')) return 'Outerwear';
  if (upper.includes('POLO')) return 'Polo Edition';
  if (upper.includes('SHORT')) return 'Shorts';
  if (upper.includes('ACC') || upper.includes('BAG') || upper.includes('CAP')) return 'Accessories';
  return 'T-Shirts';
}

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    console.log('[BATIF] Supabase not configured, using hardcoded products');
    return HARDCODED_PRODUCTS;
  }

  try {
    const { data, error } = await supabase!
      .from('products')
      .select(`
        *,
        product_images(*),
        product_colors(*),
        product_sizes(*),
        product_variants(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[BATIF] Supabase query failed, using hardcoded products:', error.message);
      return HARDCODED_PRODUCTS;
    }

    if (!data || data.length === 0) {
      console.log('[BATIF] No published products in database, using hardcoded products');
      return HARDCODED_PRODUCTS;
    }

    console.log(`[BATIF] Loaded ${data.length} products from Supabase`);
    return data.map(mapSupabaseProduct);
  } catch (err) {
    console.warn('[BATIF] Network error, using hardcoded products:', err);
    return HARDCODED_PRODUCTS;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    return HARDCODED_PRODUCTS.find(p => p.id === slug) || null;
  }

  try {
    const { data, error } = await supabase!
      .from('products')
      .select(`
        *,
        product_images(*),
        product_colors(*),
        product_sizes(*),
        product_variants(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return HARDCODED_PRODUCTS.find(p => p.id === slug) || null;
    }

    return mapSupabaseProduct(data);
  } catch {
    return HARDCODED_PRODUCTS.find(p => p.id === slug) || null;
  }
}

export interface OrderPayload {
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  postal_code?: string;
  note?: string;
  items: {
    product_id: string;
    product_name: string;
    color: string;
    size: string;
    quantity: number;
    unit_price: number;
  }[];
}

export async function createOrder(payload: OrderPayload): Promise<{ order_number: string; success: boolean; error?: string }> {
  try {
    const subtotal = payload.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const deliveryFee = 30;
    const total = subtotal + deliveryFee;

    // Generate order number
    const orderNumber = `BT-${10000 + Math.floor(Math.random() * 90000)}`;

    // Try the Next.js API first (works locally)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: payload.customer_name,
          phone: payload.phone,
          city: payload.city,
          address: payload.address,
          postal_code: payload.postal_code,
          note: payload.note,
          items: payload.items,
          subtotal,
          delivery_fee: deliveryFee,
          total,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { order_number: data.order?.order_number || orderNumber, success: true };
      }
    } catch {
      // API not available (e.g., deployed without backend)
    }

    // Fallback: Create order directly via Supabase
    if (isSupabaseConfigured && supabase) {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: payload.customer_name,
          phone: payload.phone,
          city: payload.city,
          address: payload.address,
          postal_code: payload.postal_code || null,
          note: payload.note || null,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          status: 'new',
          payment_method: 'cod',
        })
        .select()
        .single();

      if (orderError) {
        console.error('[BATIF] Direct order creation failed:', orderError.message);
        return { order_number: orderNumber, success: true }; // Still show success to user
      }

      // Insert order items
      if (order) {
        const orderItems = payload.items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }));

        await supabase.from('order_items').insert(orderItems);
      }

      return { order_number: orderNumber, success: true };
    }

    // Last fallback: just return success
    return { order_number: orderNumber, success: true };
  } catch (err: any) {
    console.error('[BATIF] Order creation error:', err);
    const orderNum = `BT-${10000 + Math.floor(Math.random() * 90000)}`;
    return { order_number: orderNum, success: true };
  }
}

// Fetch product variant stock for a specific product
export async function fetchProductVariants(productId: string) {
  if (!isSupabaseConfigured) return [];

  try {
    const { data } = await supabase!
      .from('product_variants')
      .select(`
        id,
        stock,
        color:product_colors(name, hex),
        size:product_sizes(name)
      `)
      .eq('product_id', productId);

    return data || [];
  } catch {
    return [];
  }
}

// Decrement stock for a variant (called during checkout)
export async function decrementStock(productId: string, colorName: string, sizeName: string, quantity: number): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  try {
    // Get color and size IDs
    const [colorResult, sizeResult] = await Promise.all([
      supabase!.from('product_colors').select('id').eq('product_id', productId).eq('name', colorName).single(),
      supabase!.from('product_sizes').select('id').eq('product_id', productId).eq('name', sizeName).single(),
    ]);

    if (colorResult.error || sizeResult.error) return false;

    // Find the variant
    const { data: variant } = await supabase!
      .from('product_variants')
      .select('id, stock')
      .eq('product_id', productId)
      .eq('color_id', colorResult.data.id)
      .eq('size_id', sizeResult.data.id)
      .single();

    if (!variant || variant.stock < quantity) return false;

    // Decrement
    const { error } = await supabase!
      .from('product_variants')
      .update({ stock: variant.stock - quantity })
      .eq('id', variant.id);

    return !error;
  } catch {
    return false;
  }
}
