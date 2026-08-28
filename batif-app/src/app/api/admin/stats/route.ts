import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'

    const supabase = createServiceClient()

    // Calculate date ranges
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart = new Date(now.getTime() - 7 * 86400000).toISOString()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // Fetch all orders for calculations
    const { data: allOrders } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, phone, city, address, status, total, payment_method, created_at, updated_at')
      .order('created_at', { ascending: false })

    const orders = allOrders || []

    // Fetch products count
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Fetch variants for stock info
    const { data: variants } = await supabase
      .from('product_variants')
      .select('id, stock, product_id, product_colors(name), product_sizes(name)')
      .order('stock', { ascending: true })

    // Fetch products for product names
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug')

    // Build product lookup
    const productMap = new Map()
    ;(products || []).forEach((p: any) => productMap.set(p.id, p.name))

    // Calculate stats
    const todayOrders = orders.filter(o => new Date(o.created_at) >= new Date(todayStart))
    const weekOrders = orders.filter(o => new Date(o.created_at) >= new Date(weekStart))
    const monthOrders = orders.filter(o => new Date(o.created_at) >= new Date(monthStart))

    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

    const newOrders = orders.filter(o => o.status === 'new')
    const pendingOrders = orders.filter(o => ['new', 'confirmed'].includes(o.status))
    const deliveredOrders = orders.filter(o => o.status === 'delivered')
    const cancelledOrders = orders.filter(o => o.status === 'cancelled')

    // Low stock products
    const lowStock = (variants || [])
      .filter((v: any) => v.stock <= 10)
      .map((v: any) => ({
        product_name: productMap.get(v.product_id) || 'Unknown',
        color: (v.product_colors as any)?.name || '',
        size: (v.product_sizes as any)?.name || '',
        stock: v.stock,
      }))
      .sort((a: any, b: any) => a.stock - b.stock)

    const outOfStockCount = lowStock.filter((v: any) => v.stock === 0).length
    const lowStockCount = lowStock.filter((v: any) => v.stock > 0).length

    // City breakdown
    const cityCount: Record<string, number> = {}
    orders.forEach(o => {
      const city = o.city || 'Unknown'
      cityCount[city] = (cityCount[city] || 0) + 1
    })
    const totalOrdersCount = orders.length
    const cityBreakdown = Object.entries(cityCount)
      .map(([city, count]) => ({ city, count, percentage: totalOrdersCount > 0 ? Math.round((count / totalOrdersCount) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)

    // Sales by day (for chart)
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const salesByDay: { date: string; revenue: number; orders: number }[] = []
    for (let i = periodDays - 1; i >= 0; i--) {
      const dayDate = new Date(now.getTime() - i * 86400000)
      const dayStr = dayDate.toISOString().split('T')[0]
      const dayLabel = dayDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      const dayOrders = orders.filter(o => o.created_at?.startsWith(dayStr))
      salesByDay.push({
        date: dayLabel,
        revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        orders: dayOrders.length,
      })
    }

    // Top products (by order count in order_items)
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity, unit_price')

    const productSales: Record<string, { name: string; units: number; revenue: number }> = {}
    ;(orderItems || []).forEach((item: any) => {
      const id = item.product_id
      if (!productSales[id]) {
        productSales[id] = { name: item.product_name || 'Unknown', units: 0, revenue: 0 }
      }
      productSales[id].units += item.quantity || 0
      productSales[id].revenue += (item.unit_price || 0) * (item.quantity || 0)
    })
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.units - a.units)
      .slice(0, 10)

    // Unique customers (by phone)
    const customerPhones = new Set(orders.map(o => o.phone).filter(Boolean))

    // Calculate real month-over-month comparisons
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastMonthOrders = orders.filter(o => {
      const d = o.created_at
      return d >= lastMonthStart && d < lastMonthEnd
    })
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const revenueChange = lastMonthRevenue > 0 ? Math.round(((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0
    const orderChange = lastMonthOrders.length > 0 ? Math.round(((monthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100) : 0

    return NextResponse.json({
      stats: {
        totalRevenue,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        totalOrders: orders.length,
        newOrders: newOrders.length,
        pendingOrders: pendingOrders.length,
        deliveredOrders: deliveredOrders.length,
        cancelledOrders: cancelledOrders.length,
        totalProducts: totalProducts || 0,
        lowStockProducts: lowStockCount,
        outOfStockProducts: outOfStockCount,
        totalCustomers: customerPhones.size,
        revenueChange,
        orderChange,
      },
      recentOrders: orders.slice(0, 20),
      pendingOrders: pendingOrders.slice(0, 10),
      lowStock: lowStock.slice(0, 20),
      topProducts,
      salesByDay,
      cityBreakdown,
    })
  } catch (err: any) {
    console.error('[STATS] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
