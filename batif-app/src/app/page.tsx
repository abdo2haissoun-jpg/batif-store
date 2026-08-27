'use client'

import { useEffect, useState } from 'react'
import { ProductWithDetails } from '@/types'

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

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
            <a href="/cart" className="hover:opacity-70">Cart</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-light tracking-tight mb-4">
          BATIF STORE
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          Contemporary men&apos;s fashion. Premium essentials. Designed in Casablanca, Morocco.
        </p>
      </section>

      {/* Products Grid */}
      <section className="px-6 py-12 max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-light mb-8">New Arrivals</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No products available yet</p>
            <p className="text-sm">Check back soon for our latest collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const mainImage = product.product_images?.find(
                (img) => img.image_type === 'main'
              ) || product.product_images?.[0]

              return (
                <a
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                    {mainImage ? (
                      <img
                        src={mainImage.url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.price} MAD</p>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 mt-12">
        <div className="max-w-[1400px] mx-auto text-center text-sm text-gray-500">
          <p>© 2026 BATIF STORE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
