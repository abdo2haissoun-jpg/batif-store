'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/admin-fetch'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await adminFetch('/api/admin/products')
      if (res.ok) { const data = await res.json(); setProducts(data.products || []) }
    } catch (error) { console.error('Failed to fetch products:', error) }
    finally { setLoading(false) }
  }

  const filteredProducts = filter === 'all' ? products : products.filter(p => p.status === filter)

  const handleStatusChange = async (productId: string, newStatus: string) => {
    const res = await adminFetch(`/api/admin/products/${productId}`, {
      method: 'PATCH', body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) fetchProducts()
  }

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return
    setDeleting(productId)
    try {
      const res = await adminFetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success(`"${productName}" deleted`)
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch { toast.error('Failed to delete product') }
    finally { setDeleting(null) }
  }

  const statusColors: Record<string, string> = {
    published: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    draft: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading products...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new"
          className="bg-[#FF5131] text-white px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-[#e6452a] transition-colors">
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'published', 'draft', 'archived'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === f ? 'bg-[#FF5131] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      {/* Products table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</th>
              <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
              <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 hidden sm:table-cell">Stock</th>
              <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-right px-5 py-3 font-medium text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredProducts.map((product) => {
              const totalStock = product.product_variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0
              const mainImage = product.product_images?.find((i: any) => i.image_type === 'main') || product.product_images?.[0]
              return (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {mainImage ? (
                        <img src={mainImage.url} alt={product.name} className="w-10 h-12 object-cover rounded-lg bg-gray-100 dark:bg-gray-800" />
                      ) : (
                        <div className="w-10 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">No img</div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{product.sku || 'No SKU'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{product.category}</td>
                  <td className="px-5 py-3 font-medium">{product.price} MAD</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`font-medium text-sm ${totalStock <= 5 ? 'text-red-600 dark:text-red-400' : ''}`}>{totalStock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <select value={product.status} onChange={(e) => handleStatusChange(product.id, e.target.value)}
                      className={`text-xs px-2.5 py-1 rounded-lg border-0 cursor-pointer font-medium ${statusColors[product.status] || statusColors.draft}`}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(product.id, product.name)} disabled={deleting === product.id}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50">
                        {deleting === product.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-gray-400">No products found</div>
        )}
      </div>
    </div>
  )
}
