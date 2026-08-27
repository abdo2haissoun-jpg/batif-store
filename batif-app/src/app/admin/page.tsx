'use client'

import { useEffect, useState } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ ordersToday: 0, pendingOrders: 0, toShipOrders: 0, totalRevenue: 0, totalProducts: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, stockRes] = await Promise.all([
        adminFetch('/api/admin/stats'),
        adminFetch('/api/admin/orders?limit=5'),
        adminFetch('/api/admin/low-stock'),
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (ordersRes.ok) { const d = await ordersRes.json(); setRecentOrders(d.orders || []) }
      if (stockRes.ok) { const d = await stockRes.json(); setLowStock(d.items || []) }
    } catch (error) { console.error('Failed to fetch dashboard data:', error) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="text-gray-400 dark:text-gray-500 text-sm">Loading dashboard...</div>

  const statCards = [
    { label: 'Total Orders', value: stats.ordersToday, icon: '📦', color: 'from-gray-700 to-gray-900' },
    { label: 'Pending', value: stats.pendingOrders, icon: '⏳', color: 'from-[#FF5131] to-[#e6452a]' },
    { label: 'To Ship', value: stats.toShipOrders, icon: '🚚', color: 'from-gray-500 to-gray-700' },
    { label: 'Revenue', value: `${stats.totalRevenue.toLocaleString()} MAD`, icon: '💰', color: 'from-emerald-500 to-emerald-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color}`} />
            </div>
            <div className="text-2xl font-bold tracking-tight">{card.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-gray-500 hover:text-black dark:hover:text-white transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No orders yet</div>
            ) : recentOrders.map((order: any) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div>
                  <div className="font-medium text-sm">{order.order_number}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{order.customer_name} • {order.city}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{order.total} MAD</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'new' ? 'bg-[#FF5131]/10 text-[#FF5131]' :
                    order.status === 'confirmed' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Low Stock</h2>
            <a href="/admin/inventory" className="text-xs text-gray-500 hover:text-black dark:hover:text-white transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {lowStock.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">All products well stocked</div>
            ) : lowStock.slice(0, 5).map((item: any, i: number) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div>
                  <div className="text-sm font-medium">{item.product?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.color?.name || ''} / {item.size?.name || ''}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  item.stock <= 3 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>{item.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
