'use client'

import { useEffect, useState } from 'react'
import { ProductWithDetails } from '@/types'

const CATEGORIES = ['All', 'T-Shirts', 'Polo Edition', 'Outerwear', 'Shorts', 'Accessories']

export default function ShopPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

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

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold tracking-tight">BATIF</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="hover:opacity-70">Home</a>
            <a href="/shop" className="hover:opacity-70 font-medium">Shop</a>
            <a href="/about" className="hover:opacity-70">About</a>
            <a href="/cart" className="hover:opacity-70">Cart</a>
          </nav>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-light mb-8">Shop</h1>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No products in this category
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const mainImage = product.product_images?.find(
                (img) => img.image_type === 'main'
              ) || product.product_images?.[0]

              return (
                <a
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 relative">
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
                    {product.badge && (
                      <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-900">{product.price} MAD</p>
                      {product.original_price && (
                        <p className="text-sm text-gray-400 line-through">{product.original_price} MAD</p>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {product.product_colors?.slice(0, 4).map((color) => (
                        <span
                          key={color.id}
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t px-6 py-8 mt-12">
        <div className="max-w-[1400px] mx-auto text-center text-sm text-gray-500">
          <p>© 2026 BATIF STORE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
