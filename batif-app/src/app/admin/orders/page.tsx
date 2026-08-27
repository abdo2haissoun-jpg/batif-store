'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/lib/theme-context'
import { adminFetch } from '@/lib/admin-fetch'
import { inputClass, selectClass, cardClass, btnPrimary, labelClass } from '@/app/admin/components'

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
  { value: 'new', label: 'New', color: 'bg-[#FF5131]/10 text-[#FF5131]' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'shipped', label: 'Shipped', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
]

const STATUS_EMAIL_INFO: Record<string, string> = {
  new: 'Confirmation email will be sent',
  confirmed: 'Customer notified: order confirmed',
  shipped: 'Customer notified: order shipped',
  delivered: 'Customer notified: order delivered',
  cancelled: 'Customer notified: order cancelled',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [emailStatus, setEmailStatus] = useState<string>('')
  const { theme } = useTheme()

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
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    setEmailStatus('')

    try {
      // Use the new status API that sends emails
      const res = await adminFetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.email_sent) {
          setEmailStatus(`✓ Status updated. Email sent to customer.`)
        } else if (data.email_error) {
          setEmailStatus(`✓ Status updated. Email: ${data.email_error}`)
        } else {
          setEmailStatus(`✓ Status updated.`)
        }
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder!, status: newStatus })
        }
      } else {
        setEmailStatus('Failed to update status')
      }
    } catch (err) {
      setEmailStatus('Error updating status')
    } finally {
      setUpdating(null)
      setTimeout(() => setEmailStatus(''), 5000)
    }
  }

  const getStatusStyle = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-600'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF5131] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage customer orders and send notifications</p>
        </div>
      </div>

      {/* Email status notification */}
      {emailStatus && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${
          emailStatus.includes('Failed') || emailStatus.includes('Error')
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
        }`}>
          {emailStatus}
        </div>
      )}

      {/* Status filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'all'
              ? 'bg-[#FF5131] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map(status => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === status.value
                ? 'bg-[#FF5131] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders list */}
        <div className="lg:col-span-2 space-y-3">
          {orders.length === 0 ? (
            <div className={cardClass}>
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No orders found</p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`${cardClass} cursor-pointer hover:border-[#FF5131]/30 transition-colors ${
                  selectedOrder?.id === order.id ? 'border-[#FF5131]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{order.order_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{order.customer_name} · {order.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{order.total} MAD</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order detail */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className={`${cardClass} sticky top-24`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedOrder.order_number}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className={labelClass}>Customer</p>
                  <p className="text-gray-900 dark:text-white">{selectedOrder.customer_name}</p>
                  <p className="text-gray-500 dark:text-gray-400">{selectedOrder.phone}</p>
                  {selectedOrder.customer_email && (
                    <p className="text-gray-500 dark:text-gray-400">{selectedOrder.customer_email}</p>
                  )}
                </div>

                <div>
                  <p className={labelClass}>Address</p>
                  <p className="text-gray-900 dark:text-white">{selectedOrder.address}</p>
                  <p className="text-gray-500 dark:text-gray-400">{selectedOrder.city}</p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className={labelClass}>Total</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">{selectedOrder.subtotal} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-gray-900 dark:text-white">{selectedOrder.delivery_fee} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold mt-1">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">{selectedOrder.total} MAD</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className={labelClass}>Payment</p>
                  <p className="text-gray-900 dark:text-white capitalize">{selectedOrder.payment_method}</p>
                </div>

                {/* Status update */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className={labelClass}>Update Status</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    {STATUS_EMAIL_INFO[selectedOrder.status] || ''}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map(status => (
                      <button
                        key={status.value}
                        onClick={() => updateStatus(selectedOrder.id, status.value)}
                        disabled={updating === selectedOrder.id || selectedOrder.status === status.value}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          selectedOrder.status === status.value
                            ? `${getStatusStyle(status.value)} opacity-50 cursor-not-allowed`
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        } ${updating === selectedOrder.id ? 'opacity-50' : ''}`}
                      >
                        {updating === selectedOrder.id ? '...' : status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${cardClass} text-center py-12`}>
              <p className="text-gray-400 dark:text-gray-500">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
