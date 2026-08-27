'use client'

import { useCartStore } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, getDeliveryFee } = useCartStore()
  const router = useRouter()

  const subtotal = getTotal()
  const deliveryFee = getDeliveryFee()
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold tracking-tight">BATIF</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="hover:opacity-70">Home</a>
            <a href="/shop" className="hover:opacity-70">Shop</a>
            <a href="/about" className="hover:opacity-70">About</a>
            <a href="/cart" className="hover:opacity-70 font-medium">Cart ({items.length})</a>
          </nav>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-light mb-8">Shopping Bag</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Your bag is empty</p>
            <a
              href="/shop"
              className="text-sm text-black underline hover:no-underline"
            >
              Continue shopping
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="divide-y">
                {items.map((item) => {
                  const mainImage = item.product.product_images?.find(
                    (img) => img.image_type === 'main'
                  ) || item.product.product_images?.[0]

                  return (
                    <div key={`${item.product.id}-${item.color.id}-${item.size.id}`} className="py-6 flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-32 bg-gray-100 shrink-0">
                        {mainImage ? (
                          <img
                            src={mainImage.url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.color.name} / {item.size.name}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border">
                            <button
                              onClick={() => updateQuantity(
                                item.product.id,
                                item.color.id,
                                item.size.id,
                                item.quantity - 1
                              )}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                            >
                              −
                            </button>
                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(
                                item.product.id,
                                item.color.id,
                                item.size.id,
                                item.quantity + 1
                              )}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="text-right">
                            <div className="font-medium">
                              {(item.product.price * item.quantity).toLocaleString()} MAD
                            </div>
                            <button
                              onClick={() => removeItem(
                                item.product.id,
                                item.color.id,
                                item.size.id
                              )}
                              className="text-sm text-gray-500 hover:text-red-600 mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{deliveryFee} MAD</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-3">
                    <span>Total</span>
                    <span>{total.toLocaleString()} MAD</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
