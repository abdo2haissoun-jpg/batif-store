'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'
import { btnSecondary, btnOrange, btnDanger } from '../../components'

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_slug: string | null
  image: string | null
  sku: string | null
  material: string | null
  color: string
  size: string
  quantity: number
  unit_price: number
  total: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  phone: string
  customer_email: string | null
  city: string
  address: string
  postal_code: string | null
  note: string | null
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string
  status: string
  created_at: string
}

const STATUS_FLOW = ['new', 'confirmed', 'shipped', 'delivered']
const ALL_STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-[#FF5131] text-white',
  confirmed: 'bg-black text-white dark:bg-white dark:text-black',
  shipped: 'bg-neutral-700 text-white dark:bg-neutral-300 dark:text-black',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-red-600 text-white',
  returned: 'bg-neutral-400 text-black dark:text-black',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  const fetchOrder = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('batif_admin_token') || ''
      const res = await fetch(`/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load order')
      setOrder(data.order)
      setItems(data.items || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  const updateStatus = async (status: string) => {
    if (!order) return
    setUpdating(true)
    setError('')
    try {
      const token = sessionStorage.getItem('batif_admin_token') || ''
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update status')
      setOrder({ ...order, status })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider">Loading order…</p>
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#FF5131]">{error}</p>
        <Link href="/admin/orders" className={btnSecondary}>← Back to Orders</Link>
      </div>
    )
  }

  if (!order) return null

  const currentStep = STATUS_FLOW.indexOf(order.status)

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-white/8 bg-[#0A0A0A]' : 'border-black/8 bg-white'} sticky top-0 z-10`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/orders')}
                className={`text-[11px] uppercase tracking-wider transition-colors ${
                  isDark ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black'
                }`}
              >
                ← Orders
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    {order.order_number}
                  </h1>
                  <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 ${STATUS_STYLES[order.status] || 'bg-neutral-300 text-black'}`}>
                    {order.status}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  Placed {formatDateTime(order.created_at)} · {items.length} {items.length === 1 ? 'item' : 'items'} · COD
                </p>
              </div>
            </div>

            {/* Quick status actions */}
            <div className="hidden md:flex items-center gap-2">
              {order.status === 'new' && (
                <button onClick={() => updateStatus('confirmed')} disabled={updating} className={btnOrange}>
                  CONFIRM ORDER
                </button>
              )}
              {order.status === 'confirmed' && (
                <button onClick={() => updateStatus('shipped')} disabled={updating} className={btnOrange}>
                  MARK SHIPPED
                </button>
              )}
              {order.status === 'shipped' && (
                <button onClick={() => updateStatus('delivered')} disabled={updating} className={btnOrange}>
                  MARK DELIVERED
                </button>
              )}
              {(order.status === 'new' || order.status === 'confirmed') && (
                <button onClick={() => updateStatus('cancelled')} disabled={updating} className={btnDanger}>
                  CANCEL
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 bg-[#FF5131]/10 border border-[#FF5131]/30 text-[#FF5131] text-xs px-4 py-3">
            {error}
          </div>
        )}

        {/* Progress tracker */}
        <div className={`mb-6 border ${isDark ? 'border-white/8 bg-[#111]' : 'border-black/8 bg-white'} p-5`}>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] mb-4 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
            Order Progress
          </p>
          <div className="flex items-center">
            {STATUS_FLOW.map((step, idx) => {
              const reached = currentStep >= idx && order.status !== 'cancelled' && order.status !== 'returned'
              const isLast = idx === STATUS_FLOW.length - 1
              return (
                <div key={step} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      reached
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : isDark ? 'bg-white/10 text-white/30' : 'bg-black/5 text-black/30'
                    }`}>
                      {reached ? '✓' : idx + 1}
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider mt-1.5 ${
                      reached
                        ? isDark ? 'text-white' : 'text-black'
                        : isDark ? 'text-white/30' : 'text-black/30'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-px mx-2 mb-4 ${
                      currentStep > idx && order.status !== 'cancelled' && order.status !== 'returned'
                        ? 'bg-black dark:bg-white'
                        : isDark ? 'bg-white/10' : 'bg-black/10'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
          {(order.status === 'cancelled' || order.status === 'returned') && (
            <p className="text-[11px] text-red-500 mt-3 uppercase tracking-wider">
              This order was {order.status}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className={`border ${isDark ? 'border-white/8 bg-[#111]' : 'border-black/8 bg-white'}`}>
              <div className={`px-5 py-4 border-b ${isDark ? 'border-white/8' : 'border-black/8'}`}>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  Items ({items.length})
                </p>
              </div>

              {items.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                    No items recorded on this order.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {items.map((item) => (
                    <div key={item.id} className="px-5 py-4 flex gap-4">
                      {/* Product image */}
                      <div className={`w-16 h-20 shrink-0 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                        {item.image ? (
                          <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-[8px] uppercase ${isDark ? 'text-white/20' : 'text-black/20'}`}>
                            No image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                          {item.product_name}
                        </p>
                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                          {item.size && <span>Size: <span className={isDark ? 'text-white/80' : 'text-black/80'}>{item.size}</span></span>}
                          {item.color && <span>Color: <span className={isDark ? 'text-white/80' : 'text-black/80'}>{item.color}</span></span>}
                          {item.sku && <span>SKU: {item.sku}</span>}
                        </div>
                        {item.material && (
                          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                            {item.material}
                          </p>
                        )}
                        <p className={`text-[11px] mt-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                          {item.quantity} × {item.unit_price?.toLocaleString()} MAD
                        </p>
                      </div>

                      {/* Line total */}
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                          {item.total?.toLocaleString()} MAD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className={`px-5 py-4 border-t ${isDark ? 'border-white/8' : 'border-black/8'} space-y-1.5`}>
                <div className={`flex justify-between text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  <span>Subtotal</span>
                  <span>{order.subtotal?.toLocaleString()} MAD</span>
                </div>
                <div className={`flex justify-between text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  <span>Delivery</span>
                  <span>{order.delivery_fee?.toLocaleString()} MAD</span>
                </div>
                <div className={`flex justify-between pt-2 border-t ${isDark ? 'border-white/8' : 'border-black/8'}`}>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>Total</span>
                  <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    {order.total?.toLocaleString()} MAD
                  </span>
                </div>
              </div>
            </div>

            {/* Status controls (mobile + full list) */}
            <div className={`border ${isDark ? 'border-white/8 bg-[#111]' : 'border-black/8 bg-white'} p-5`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] mb-3 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    disabled={updating || s === order.status}
                    className={`px-3.5 py-2 text-[11px] font-medium uppercase tracking-wider border transition-all disabled:opacity-40 ${
                      s === order.status
                        ? STATUS_STYLES[s] + ' border-transparent'
                        : isDark
                          ? 'border-white/15 text-white/70 hover:border-white/40'
                          : 'border-black/15 text-black/70 hover:border-black/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className={`text-[11px] mt-3 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                Changing status automatically emails the customer (when an email is on file).
              </p>
            </div>
          </div>

          {/* RIGHT: Customer & delivery */}
          <div className="space-y-6">
            {/* Customer */}
            <div className={`border ${isDark ? 'border-white/8 bg-[#111]' : 'border-black/8 bg-white'} p-5`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] mb-3 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Customer
              </p>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                {order.customer_name}
              </p>
              <div className="mt-2 space-y-1">
                <a href={`tel:${order.phone}`} className={`block text-xs hover:underline ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  {order.phone}
                </a>
                {order.customer_email && (
                  <a href={`mailto:${order.customer_email}`} className={`block text-xs hover:underline ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    {order.customer_email}
                  </a>
                )}
              </div>
              {/* Quick actions */}
              <div className="flex gap-2 mt-4">
                <a
                  href={`tel:${order.phone}`}
                  className={`flex-1 text-center text-[10px] uppercase tracking-wider py-2 border transition-colors ${
                    isDark ? 'border-white/15 text-white hover:bg-white/5' : 'border-black/15 text-black hover:bg-black/5'
                  }`}
                >
                  Call
                </a>
                {order.customer_email && (
                  <a
                    href={`mailto:${order.customer_email}?subject=Order ${order.order_number}`}
                    className={`flex-1 text-center text-[10px] uppercase tracking-wider py-2 border transition-colors ${
                      isDark ? 'border-white/15 text-white hover:bg-white/5' : 'border-black/15 text-black hover:bg-black/5'
                    }`}
                  >
                    Email
                  </a>
                )}
              </div>
            </div>

            {/* Delivery address */}
            <div className={`border ${isDark ? 'border-white/8 bg-[#111]' : 'border-black/8 bg-white'} p-5`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] mb-3 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Delivery Address
              </p>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                {order.address}
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                {order.city}{order.postal_code ? ` · ${order.postal_code}` : ''} · Morocco
              </p>
              {order.note && (
                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-white/8' : 'border-black/8'}`}>
                  <p className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Note</p>
                  <p className={`text-xs italic ${isDark ? 'text-white/70' : 'text-black/70'}`}>"{order.note}"</p>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className={`border ${isDark ? 'border-white/8 bg-[#111]' : 'border-black/8 bg-white'} p-5`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] mb-3 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Payment
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  Cash on Delivery
                </span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${
                  isDark ? 'bg-white/10 text-white/70' : 'bg-black/5 text-black/70'
                }`}>
                  COD
                </span>
              </div>
              <p className={`text-[11px] mt-2 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Collect {order.total?.toLocaleString()} MAD on delivery.
              </p>
            </div>

            {/* Order meta */}
            <div className={`border ${isDark ? 'border-white/8 bg-[#111]' : 'border-black/8 bg-white'} p-5`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] mb-3 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Order Info
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/40' : 'text-black/40'}>Order date</span>
                  <span className={isDark ? 'text-white/80' : 'text-black/80'}>{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/40' : 'text-black/40'}>Order ID</span>
                  <span className={`${isDark ? 'text-white/80' : 'text-black/80'} font-mono text-[10px]`}>{order.id.slice(0, 8)}…</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
