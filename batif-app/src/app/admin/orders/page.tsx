'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'
import { StatusBadge, cardClass, SearchInput, EmptyState, formatRelative, formatDate } from '@/app/admin/components'
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
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')

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

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    setStatusMessage('')
    try {
      const res = await adminFetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const emailNote = data.email_sent ? ' · Email sent' : data.email_error ? ` · ${data.email_error}` : ''
        setStatusMessage(`Updated to ${newStatus}${emailNote}`)
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder!, status: newStatus })
        }
      } else {
        setStatusMessage(`Error: ${data.error || 'Unknown'}`)
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`)
    } finally {
      setUpdating(null)
      setTimeout(() => setStatusMessage(''), 6000)
    }
  }

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
      {/* Status message */}
      {statusMessage && (
        <div className={`mb-4 px-3 py-2 text-xs ${
          statusMessage.startsWith('Error') ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-black/5 dark:bg-white/5 text-black dark:text-white'
        }`}>
          {statusMessage}
        </div>
      )}

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
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id
                        ? 'bg-black/[0.03] dark:bg-white/[0.03]'
                        : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                    }`}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No orders found" description={search ? 'Try a different search term.' : 'New orders will appear here.'} />
      )}

      {/* Order detail panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] border-l border-black/8 dark:border-white/8 overflow-y-auto">
            <div className="sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-black/5 dark:border-white/5 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-sm font-semibold text-black dark:text-white">{selectedOrder.order_number}</h3>
                <StatusBadge status={selectedOrder.status} size="xs" />
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status actions */}
              <div>
                <p className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-2">Update Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(selectedOrder.id, s.value)}
                      disabled={updating === selectedOrder.id || selectedOrder.status === s.value}
                      className={`px-3 py-1.5 text-[11px] font-medium tracking-[0.05em] uppercase transition-colors ${
                        selectedOrder.status === s.value
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'border border-black/10 dark:border-white/10 text-black/40 dark:text-white/40 hover:border-black/30 dark:hover:border-white/30'
                      } disabled:opacity-30`}
                    >
                      {updating === selectedOrder.id ? '...' : s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-2">Customer</p>
                <p className="text-sm text-black dark:text-white">{selectedOrder.customer_name}</p>
                <p className="text-xs text-black/40 dark:text-white/40">{selectedOrder.phone}</p>
                {selectedOrder.customer_email && <p className="text-xs text-black/40 dark:text-white/40">{selectedOrder.customer_email}</p>}
              </div>

              {/* Address */}
              <div>
                <p className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-2">Address</p>
                <p className="text-sm text-black dark:text-white">{selectedOrder.address}</p>
                <p className="text-xs text-black/40 dark:text-white/40">{selectedOrder.city}{selectedOrder.postal_code ? ` · ${selectedOrder.postal_code}` : ''}</p>
              </div>

              {/* Totals */}
              <div>
                <p className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-2">Total</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-black/40 dark:text-white/40">Subtotal</span>
                    <span className="text-black dark:text-white tabular-nums">{selectedOrder.subtotal?.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-black/40 dark:text-white/40">Delivery</span>
                    <span className="text-black dark:text-white tabular-nums">{selectedOrder.delivery_fee?.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold pt-1 border-t border-black/5 dark:border-white/5">
                    <span className="text-black dark:text-white">Total</span>
                    <span className="text-black dark:text-white tabular-nums">{selectedOrder.total?.toLocaleString()} MAD</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-2">Payment</p>
                <p className="text-sm text-black dark:text-white uppercase">{selectedOrder.payment_method}</p>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-2">Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                    <span className="text-black/40 dark:text-white/40">Ordered</span>
                    <span className="text-black/30 dark:text-white/30 ml-auto">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  {selectedOrder.updated_at !== selectedOrder.created_at && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF5131]" />
                      <span className="text-black/40 dark:text-white/40">Updated</span>
                      <span className="text-black/30 dark:text-white/30 ml-auto">{formatDate(selectedOrder.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
