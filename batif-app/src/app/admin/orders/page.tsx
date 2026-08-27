'use client'

import { useEffect, useState } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

const ORDER_STATUS_OPTIONS = [
  { value: 'new', label: 'New' }, { value: 'confirmed', label: 'Confirmed' },
  { value: 'packing', label: 'Packing' }, { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' }, { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
]
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  confirmed: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  packing: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  shipped: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  returned: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

interface Order { id: string; order_number: string; customer_name: string; phone: string; city: string; address: string; postal_code?: string; note?: string; subtotal: number; delivery_fee: number; total: number; payment_method: string; status: string; created_at: string; order_items?: any[] }

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => { fetchOrders() }, [])
  const fetchOrders = async () => {
    setLoading(true)
    try { const r = await adminFetch('/api/admin/orders'); if (r.ok) { const d = await r.json(); setOrders(d.orders || []) } }
    catch {} finally { setLoading(false) }
  }
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const r = await adminFetch(`/api/admin/orders/${orderId}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
    if (r.ok) { fetchOrders(); if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus }) }
  }
  const filtered = orders.filter(o => {
    if (filter && o.status !== filter) return false
    if (search) { const q = search.toLowerCase(); return o.order_number?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q) || o.phone?.includes(q) }
    return true
  })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Orders</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{orders.length} orders total</p></div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" placeholder="Search by order #, name, or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF5131] text-sm" />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter('')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${!filter ? 'bg-[#FF5131] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>All</button>
          {ORDER_STATUS_OPTIONS.map(s => (<button key={s.value} onClick={() => setFilter(s.value)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === s.value ? 'bg-[#FF5131] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{s.label}</button>))}
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[calc(100vh-300px)] overflow-y-auto">
            {loading ? <div className="p-6 text-center text-gray-400 text-sm">Loading...</div> : filtered.length === 0 ? <div className="p-6 text-center text-gray-400 text-sm">No orders found</div> :
              filtered.map((order) => (
                <div key={order.id} onClick={() => setSelectedOrder(order)} className={`px-5 py-4 cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-gray-50 dark:bg-gray-800/80 border-l-2 border-[#FF5131]' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                  <div className="flex items-center justify-between">
                    <div><div className="font-medium text-sm">{order.order_number}</div><div className="text-xs text-gray-500 dark:text-gray-400">{order.customer_name} • {order.city}</div></div>
                    <div className="text-right"><div className="text-sm font-medium">{order.total} MAD</div><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || STATUS_COLORS.new}`}>{order.status}</span></div>
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString('en-GB')}</div>
                </div>
              ))}
          </div>
        </div>
        {selectedOrder ? (
          <div className="w-full lg:w-[420px] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{selectedOrder.order_number}</h2>
              <select value={selectedOrder.status} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FF5131]">
                {ORDER_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Customer</h3>
              <p className="text-sm">{selectedOrder.customer_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.phone}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.city}, {selectedOrder.address}</p>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Products</h3>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div><div className="font-medium">{item.product_name}</div><div className="text-gray-500 dark:text-gray-400 text-xs">{item.color} / {item.size} × {item.quantity}</div></div>
                    <div className="font-medium">{item.total} MAD</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Subtotal</span><span>{selectedOrder.subtotal} MAD</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Delivery</span><span>{selectedOrder.delivery_fee} MAD</span></div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-100 dark:border-gray-800 pt-2"><span>Total</span><span>{selectedOrder.total} MAD</span></div>
            </div>
          </div>
        ) : <div className="hidden lg:flex w-[420px] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 items-center justify-center text-gray-400 text-sm">Select an order to view details</div>}
      </div>
    </div>
  )
}
