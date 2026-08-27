import { createServiceClient } from './server'

// =====================================================
// PUBLIC QUERIES
// =====================================================

export async function getPublishedProducts() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_colors(*), product_sizes(*), product_variants(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (error) { console.error('Error fetching products:', error); return [] }
  return data || []
}

export async function getProductBySlug(slug: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_colors(*), product_sizes(*), product_variants(*)')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return data
}

export async function getStoreSettings() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('store_settings').select('*').single()
  if (error || !data) return null
  return data
}

// =====================================================
// SERVER-SIDE QUERIES
// =====================================================

export async function createOrder(orderData: {
  customer_name: string; phone: string; city: string; address: string;
  postal_code?: string; note?: string;
  items: Array<{ product_id: string; product_name: string; color: string; size: string; quantity: number; unit_price: number }>;
  subtotal: number; delivery_fee: number; total: number;
}) {
  const supabase = createServiceClient()
  const orderNum = `BT-${10000 + Math.floor(Math.random() * 90000)}`

  const { error: orderError } = await supabase.from('orders').insert({
    order_number: orderNum, customer_name: orderData.customer_name, phone: orderData.phone,
    city: orderData.city, address: orderData.address, postal_code: orderData.postal_code || null,
    note: orderData.note || null, subtotal: orderData.subtotal, delivery_fee: orderData.delivery_fee,
    total: orderData.total, payment_method: 'COD', status: 'new',
  })
  if (orderError) return { error: `Failed to create order: ${orderError.message}` }

  const { data: latestOrder } = await supabase.from('orders').select('id').eq('order_number', orderNum).single()
  if (latestOrder) {
    const orderItems = orderData.items.map(item => ({
      order_id: latestOrder.id, product_id: item.product_id, product_name: item.product_name,
      color: item.color, size: item.size, quantity: item.quantity,
      unit_price: item.unit_price, total: item.unit_price * item.quantity,
    }))
    await supabase.from('order_items').insert(orderItems)
  }
  return { order: { order_number: orderNum } }
}

// =====================================================
// ADMIN QUERIES
// =====================================================

export async function adminGetAllProducts() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_colors(*), product_sizes(*), product_variants(*)')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function adminGetAllOrders() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function adminGetOrderById(id: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()
  if (error || !data) return null
  return data
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('orders').eq('id', orderId).update({ status })
  return { error: error?.message || null }
}

export async function adminCreateProduct(product: any) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('products').insert(product)
  if (error) return { error: error.message }
  if (data?.id) return { data }
  const { data: created } = await supabase.from('products').select('*').eq('slug', product.slug).single()
  return { data: created }
}

export async function adminUpdateProduct(id: string, updates: any) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('products').eq('id', id).update(updates)
  return { error: error?.message || null }
}

export async function adminDeleteProduct(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('products').eq('id', id).delete()
  return { error: error?.message || null }
}

export async function adminAddProductImage(image: any) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('product_images').insert(image)
  if (error) return { error: error.message }
  return { data }
}

export async function adminDeleteProductImage(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('product_images').eq('id', id).delete()
  return { error: error?.message || null }
}

export async function adminUpdateProductImage(id: string, updates: any) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('product_images').eq('id', id).update(updates)
  return { error: error?.message || null }
}

export async function adminAddProductColor(color: any) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('product_colors').insert(color)
  if (error) return { error: error.message }
  return { data }
}

export async function adminDeleteProductColor(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('product_colors').eq('id', id).delete()
  return { error: error?.message || null }
}

export async function adminAddProductSize(size: any) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('product_sizes').insert(size)
  if (error) return { error: error.message }
  return { data }
}

export async function adminDeleteProductSize(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('product_sizes').eq('id', id).delete()
  return { error: error?.message || null }
}

export async function adminAddProductVariant(variant: any) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('product_variants').upsert(variant)
  if (error) return { error: error.message }
  return { data }
}

export async function adminUpdateVariantStock(variantId: string, stock: number) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('product_variants').eq('id', variantId).update({ stock })
  return { error: error?.message || null }
}

export async function adminGetDashboardStats() {
  const supabase = createServiceClient()
  const [ordersResult, pendingResult, confirmedResult, revenueResult, productsResult] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('orders').select('total').eq('status', 'new'),
    supabase.from('products').select('id', { count: 'exact', head: true }),
  ])
  const totalRevenue = revenueResult.data?.reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 0
  return {
    ordersToday: ordersResult.count || 0, pendingOrders: pendingResult.count || 0,
    toShipOrders: confirmedResult.count || 0, totalRevenue, totalProducts: productsResult.count || 0,
  }
}

export async function adminGetLowStockProducts() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('product_variants').select('*').lte('stock', 5).order('stock', { ascending: true })
  if (error) return []
  return data || []
}
