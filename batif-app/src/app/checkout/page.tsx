'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, getTotal, getDeliveryFee, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    city: '',
    address: '',
    postal_code: '',
    note: '',
  })

  const subtotal = getTotal()
  const deliveryFee = getDeliveryFee()
  const total = subtotal + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.customer_name || !form.phone || !form.city || !form.address) {
      toast.error('Please fill in all required fields')
      return
    }

    if (items.length === 0) {
      toast.error('Your bag is empty')
      return
    }

    setLoading(true)

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        color_id: item.color.id,
        size_id: item.size.id,
        product_name: item.product.name,
        color: item.color.name,
        size: item.size.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          subtotal,
          delivery_fee: deliveryFee,
          total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      setOrderNumber(data.order.order_number)
      clearCart()
      setOrderComplete(true)
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-3xl font-light mb-2">Order Confirmed</h1>
          <p className="text-2xl font-medium mb-6">{orderNumber}</p>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We&apos;ll get it delivered to you soon.
          </p>
          <div className="border rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium">Cash on Delivery</p>
            <p className="text-sm text-gray-600 mt-2">Total</p>
            <p className="text-2xl font-medium">{total.toLocaleString()} MAD</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold tracking-tight">BATIF</a>
          <span className="text-sm">Checkout</span>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-light mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Full Name *</label>
                  <input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone Number *</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">City *</label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-black focus:outline-none"
                    required
                  >
                    <option value="">Select city</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Fez">Fez</option>
                    <option value="Tangier">Tangier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Postal Code</label>
                  <input
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Delivery Note</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-black focus:outline-none"
                    placeholder="Optional instructions for delivery"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Payment</h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  </div>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-8">
                  Pay with cash when your order is delivered
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Place Order — ${total.toLocaleString()} MAD`}
            </button>
          </form>

          {/* Order Summary */}
          <div>
            <div className="border rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const mainImage = item.product.product_images?.find(
                    (img) => img.image_type === 'main'
                  ) || item.product.product_images?.[0]

                  return (
                    <div key={`${item.product.id}-${item.color.id}-${item.size.id}`} className="flex gap-3">
                      <div className="w-16 h-20 bg-gray-100 shrink-0">
                        {mainImage && (
                          <img
                            src={mainImage.url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.product.name}</h3>
                        <p className="text-xs text-gray-500">{item.color.name} / {item.size.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        {(item.product.price * item.quantity).toLocaleString()} MAD
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{deliveryFee} MAD</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total</span>
                  <span>{total.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
