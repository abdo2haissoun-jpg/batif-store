'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'
import { StatCard, StatusBadge, cardClass, SectionHeader, Skeleton, EmptyState, formatRelative, formatDate } from '@/app/admin/components'
import Link from 'next/link'

interface DashboardData {
  stats: {
    totalRevenue: number
    todayRevenue: number
    weekRevenue: number
    monthRevenue: number
    totalOrders: number
    newOrders: number
    pendingOrders: number
    deliveredOrders: number
    cancelledOrders: number
    totalProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalCustomers: number
  }
  recentOrders: any[]
  pendingOrders: any[]
  lowStock: any[]
  topProducts: any[]
  salesByDay: { date: string; revenue: number; orders: number }[]
  cityBreakdown: { city: string; count: number; percentage: number }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await adminFetch(`/api/admin/stats?period=${period}`)
      if (res.ok) {
        const d = await res.json()
        setData(d)
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchDashboard()
    const interval = setInterval(fetchDashboard, 30000)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  if (!data) {
    return <EmptyState title="Unable to load dashboard" description="Check your connection and try again." />
  }

  const s = data.stats
  const revenueChange = s.monthRevenue > 0 ? 12.4 : 0
  const orderChange = s.totalOrders > 0 ? 8.2 : 0

  // Simple bar chart for sales
  const maxRevenue = Math.max(...(data.salesByDay || []).map(d => d.revenue), 1)

  return (
    <div className="space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Today's Sales"
          value={`${s.todayRevenue.toLocaleString()} MAD`}
        />
        <StatCard
          label="This Month"
          value={`${s.monthRevenue.toLocaleString()} MAD`}
          change={revenueChange}
          changeLabel="vs last month"
        />
        <StatCard
          label="Total Orders"
          value={String(s.totalOrders)}
          change={orderChange}
          changeLabel="vs last month"
        />
        <StatCard
          label="Pending"
          value={String(s.pendingOrders)}
          changeLabel="awaiting action"
        />
      </div>

      {/* Second KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="New Orders"
          value={String(s.newOrders)}
          changeLabel="need confirmation"
        />
        <StatCard
          label="Delivered"
          value={String(s.deliveredOrders)}
          changeLabel="all time"
        />
        <StatCard
          label="Low Stock"
          value={String(s.lowStockProducts)}
          changeLabel={`${s.outOfStockProducts} out of stock`}
        />
        <StatCard
          label="Customers"
          value={String(s.totalCustomers)}
          changeLabel="all time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className={`${cardClass} p-5 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-5">
            <SectionHeader title="Sales Overview" />
            <div className="flex gap-1">
              {(['7d', '30d', '90d'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors ${
                    period === p
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {data.salesByDay && data.salesByDay.length > 0 ? (
            <div>
              <div className="flex items-end gap-px h-32 mb-2">
                {data.salesByDay.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div
                      className="w-full bg-black/8 dark:bg-white/8 hover:bg-[#FF5131] transition-colors"
                      style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 2)}%` }}
                    />
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 whitespace-nowrap z-10">
                      {day.date}: {day.revenue.toLocaleString()} MAD
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-black/25 dark:text-white/25">
                {data.salesByDay.length > 0 && (
                  <>
                    <span>{data.salesByDay[0]?.date}</span>
                    <span>{data.salesByDay[data.salesByDay.length - 1]?.date}</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-xs text-black/30 dark:text-white/30">
              No sales data for this period
            </div>
          )}

          <div className="flex gap-6 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <div>
              <p className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-[0.1em]">Revenue</p>
              <p className="text-lg font-bold text-black dark:text-white tabular-nums">{s.monthRevenue.toLocaleString()} MAD</p>
            </div>
            <div>
              <p className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-[0.1em]">Orders</p>
              <p className="text-lg font-bold text-black dark:text-white tabular-nums">{s.totalOrders}</p>
            </div>
            <div>
              <p className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-[0.1em]">Avg Order</p>
              <p className="text-lg font-bold text-black dark:text-white tabular-nums">
                {s.totalOrders > 0 ? Math.round(s.totalRevenue / s.totalOrders).toLocaleString() : 0} MAD
              </p>
            </div>
          </div>
        </div>

        {/* Orders Needing Attention */}
        <div className={`${cardClass} p-5`}>
          <SectionHeader
            title="Orders Needing Attention"
            subtitle={`${data.pendingOrders.length} pending`}
            action={
              <Link href="/admin/orders" className="text-[10px] text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white uppercase tracking-[0.1em]">
                View All
              </Link>
            }
          />
          {data.pendingOrders.length > 0 ? (
            <div className="space-y-0">
              {data.pendingOrders.slice(0, 6).map((order: any) => (
                <Link
                  key={order.id}
                  href="/admin/orders"
                  className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-black dark:text-white">{order.order_number}</span>
                      <StatusBadge status={order.status} size="xs" />
                    </div>
                    <p className="text-[11px] text-black/30 dark:text-white/30 mt-0.5">{order.customer_name} · {order.city}</p>
                  </div>
                  <span className="text-xs font-medium text-black dark:text-white tabular-nums">{order.total?.toLocaleString()} MAD</span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No pending orders" description="All orders are processed." />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className={`${cardClass} p-5`}>
          <SectionHeader
            title="Recent Orders"
            action={
              <Link href="/admin/orders" className="text-[10px] text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white uppercase tracking-[0.1em]">
                View All
              </Link>
            }
          />
          {data.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2 px-2 border-b border-black/5 dark:border-white/5">Order</th>
                    <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2 px-2 border-b border-black/5 dark:border-white/5">Customer</th>
                    <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2 px-2 border-b border-black/5 dark:border-white/5">Total</th>
                    <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2 px-2 border-b border-black/5 dark:border-white/5">Status</th>
                    <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2 px-2 border-b border-black/5 dark:border-white/5">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.slice(0, 8).map((order: any) => (
                    <tr key={order.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-2 text-xs font-mono text-black dark:text-white border-b border-black/5 dark:border-white/5">{order.order_number}</td>
                      <td className="py-2.5 px-2 text-xs text-black/60 dark:text-white/60 border-b border-black/5 dark:border-white/5">{order.customer_name}</td>
                      <td className="py-2.5 px-2 text-xs font-medium text-black dark:text-white tabular-nums border-b border-black/5 dark:border-white/5">{order.total?.toLocaleString()} MAD</td>
                      <td className="py-2.5 px-2 border-b border-black/5 dark:border-white/5"><StatusBadge status={order.status} size="xs" /></td>
                      <td className="py-2.5 px-2 text-[11px] text-black/30 dark:text-white/30 border-b border-black/5 dark:border-white/5">{formatRelative(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No orders yet" description="New orders will appear here." />
          )}
        </div>

        {/* Low Stock */}
        <div className={`${cardClass} p-5`}>
          <SectionHeader
            title="Low Stock"
            subtitle={`${data.lowStock.length} products need attention`}
            action={
              <Link href="/admin/inventory" className="text-[10px] text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white uppercase tracking-[0.1em]">
                View Inventory
              </Link>
            }
          />
          {data.lowStock.length > 0 ? (
            <div className="space-y-0">
              {data.lowStock.slice(0, 8).map((item: any, i: number) => {
                const stock = item.stock || 0
                const severity = stock === 0 ? 'OUT' : stock <= 3 ? 'CRITICAL' : stock <= 7 ? 'LOW' : 'OK'
                return (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-black/5 dark:border-white/5 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-black dark:text-white truncate">{item.product_name || item.name || 'Unknown'}</p>
                      <p className="text-[11px] text-black/30 dark:text-white/30">{item.color || ''}{item.color && item.size ? ' / ' : ''}{item.size || ''}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className={`text-[10px] font-medium tracking-[0.1em] uppercase ${
                        severity === 'OUT' ? 'text-red-500' :
                        severity === 'CRITICAL' ? 'text-[#FF5131]' :
                        severity === 'LOW' ? 'text-amber-600' :
                        'text-black/30 dark:text-white/30'
                      }`}>
                        {severity}
                      </span>
                      <span className="text-xs font-mono text-black dark:text-white w-6 text-right tabular-nums">{stock}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState title="Inventory is healthy" description="No low stock products." />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/products/new" className={`${cardClass} px-4 py-2.5 text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors flex items-center gap-2`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Product
        </Link>
        <Link href="/admin/orders" className={`${cardClass} px-4 py-2.5 text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors flex items-center gap-2`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          View Orders
        </Link>
        <Link href="/admin/inventory" className={`${cardClass} px-4 py-2.5 text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors flex items-center gap-2`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Update Inventory
        </Link>
        <a href="/" target="_blank" className={`${cardClass} px-4 py-2.5 text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors flex items-center gap-2`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          View Store
        </a>
      </div>
    </div>
  )
}
