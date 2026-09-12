'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { adminFetch } from '@/lib/admin-fetch'
import { StatusBadge, cardClass, SearchInput, EmptyState, formatRelative } from '@/app/admin/components'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  customer_name: string
  phone: string
  city: string
  address: string
  customer_email?: string
  items?: any[]
  subtotal: number
  delivery_fee: number
  total: number
  status: string
  payment_method: string
  created_at: string
  updated_at: string
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const res = await adminFetch(`/api/admin/orders${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 20000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const filteredOrders = orders.filter(o => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      o.order_number?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.city?.toLowerCase().includes(q)
    )
  })

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-black/5 dark:bg-white/5 animate-pulse" />
        <div className="h-10 bg-black/5 dark:bg-white/5 animate-pulse" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-black/5 dark:bg-white/5 animate-pulse" />)}
      </div>
    )
  }

  return (
    <div>
      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-[11px] font-medium tracking-[0.05em] uppercase transition-colors whitespace-nowrap ${
              filter === 'all' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
            }`}
          >
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 text-[11px] font-medium tracking-[0.05em] uppercase transition-colors whitespace-nowrap ${
                filter === s.value ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
              }`}
            >
              {s.label} ({statusCounts[s.value] || 0})
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search orders..." className="w-full sm:w-56" />
      </div>

      {/* Orders table */}
      {filteredOrders.length > 0 ? (
        <div className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5">Order</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5">Customer</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 hidden md:table-cell">City</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 text-right">Total</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 hidden sm:table-cell">Payment</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5">Status</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 hidden lg:table-cell">Date</th>
                  <th className="border-b border-black/5 dark:border-white/5" />
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="cursor-pointer transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-4 text-xs font-mono font-medium text-black dark:text-white border-b border-black/5 dark:border-white/5">{order.order_number}</td>
                    <td className="py-3 px-4 border-b border-black/5 dark:border-white/5">
                      <p className="text-xs text-black dark:text-white">{order.customer_name}</p>
                      <p className="text-[11px] text-black/30 dark:text-white/30">{order.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-xs text-black/50 dark:text-white/50 border-b border-black/5 dark:border-white/5 hidden md:table-cell">{order.city}</td>
                    <td className="py-3 px-4 text-xs font-medium text-black dark:text-white tabular-nums text-right border-b border-black/5 dark:border-white/5">{order.total?.toLocaleString()} MAD</td>
                    <td className="py-3 px-4 text-[11px] text-black/40 dark:text-white/40 uppercase border-b border-black/5 dark:border-white/5 hidden sm:table-cell">{order.payment_method}</td>
                    <td className="py-3 px-4 border-b border-black/5 dark:border-white/5"><StatusBadge status={order.status} size="xs" /></td>
                    <td className="py-3 px-4 text-[11px] text-black/30 dark:text-white/30 border-b border-black/5 dark:border-white/5 hidden lg:table-cell">{formatRelative(order.created_at)}</td>
                    <td className="py-3 px-4 border-b border-black/5 dark:border-white/5 text-right">
                      <span className="text-black/20 dark:text-white/20 text-xs">→</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No orders found" description={search ? 'Try a different search term.' : 'New orders will appear here.'} />
      )}
    </div>
  )
}
