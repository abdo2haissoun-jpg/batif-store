'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'
import { StatusBadge, cardClass, SearchInput, EmptyState } from '@/app/admin/components'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  category: string
  status: string
  sku?: string
  badge?: string
  created_at: string
  updated_at: string
  product_images?: { url: string; image_type: string }[]
  product_variants?: { stock: number }[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || data || [])
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    setDeleting(id)
    try {
      const res = await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(null)
    }
  }

  const filteredProducts = products.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    }
    return true
  })

  const totalStock = (p: Product) => {
    if (!p.product_variants || p.product_variants.length === 0) return null
    return p.product_variants.reduce((sum, v) => sum + (v.stock || 0), 0)
  }

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
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {['all', 'published', 'draft'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-[11px] font-medium tracking-[0.05em] uppercase transition-colors ${
                  filter === f ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
                }`}
              >
                {f === 'all' ? `All (${products.length})` : f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search products..." className="w-full sm:w-56" />
          <Link href="/admin/products/new" className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-[11px] font-medium tracking-[0.08em] uppercase hover:bg-black/80 dark:hover:bg-white/90 transition-colors whitespace-nowrap">
            + Add Product
          </Link>
        </div>
      </div>

      {/* Products table */}
      {filteredProducts.length > 0 ? (
        <div className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5">Product</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 hidden md:table-cell">Category</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 text-right">Price</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 hidden sm:table-cell text-right">Stock</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5">Status</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const stock = totalStock(product)
                  const mainImage = product.product_images?.find(i => i.image_type === 'main')?.url || product.product_images?.[0]?.url
                  return (
                    <tr key={product.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 border-b border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-3">
                          {mainImage ? (
                            <img src={mainImage} alt="" className="w-8 h-8 object-cover bg-black/5 dark:bg-white/5 shrink-0" />
                          ) : (
                            <div className="w-8 h-8 bg-black/5 dark:bg-white/5 shrink-0 flex items-center justify-center text-[10px] text-black/20 dark:text-white/20">—</div>
                          )}
                          <div>
                            <p className="text-xs font-medium text-black dark:text-white">{product.name}</p>
                            {product.sku && <p className="text-[11px] text-black/30 dark:text-white/30 font-mono">{product.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-black/50 dark:text-white/50 border-b border-black/5 dark:border-white/5 hidden md:table-cell">{product.category}</td>
                      <td className="py-3 px-4 text-xs font-medium text-black dark:text-white tabular-nums text-right border-b border-black/5 dark:border-white/5">{product.price?.toLocaleString()} MAD</td>
                      <td className="py-3 px-4 text-right border-b border-black/5 dark:border-white/5 hidden sm:table-cell">
                        {stock !== null ? (
                          <span className={`text-xs tabular-nums ${stock === 0 ? 'text-red-500' : stock <= 5 ? 'text-[#FF5131]' : 'text-black/40 dark:text-white/40'}`}>
                            {stock}
                          </span>
                        ) : (
                          <span className="text-xs text-black/20 dark:text-white/20">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b border-black/5 dark:border-white/5"><StatusBadge status={product.status || 'draft'} size="xs" /></td>
                      <td className="py-3 px-4 text-right border-b border-black/5 dark:border-white/5">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`} className="text-[11px] text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white uppercase tracking-[0.05em]">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="text-[11px] text-[#FF5131]/60 hover:text-[#FF5131] uppercase tracking-[0.05em] disabled:opacity-30"
                          >
                            {deleting === product.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title={search ? 'No products match your search' : 'No products yet'}
          description={search ? 'Try a different search term.' : 'Create your first product to get started.'}
          action={!search ? (
            <Link href="/admin/products/new" className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-[11px] font-medium tracking-[0.08em] uppercase">
              + Add Product
            </Link>
          ) : undefined}
        />
      )}
    </div>
  )
}
