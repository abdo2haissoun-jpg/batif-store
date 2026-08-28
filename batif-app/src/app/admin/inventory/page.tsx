'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'
import { cardClass, SearchInput, EmptyState, SectionHeader } from '@/app/admin/components'

interface Variant {
  id: string
  stock: number
  product_id: string
  product_name?: string
  product?: { name: string }
  product_colors?: { name: string; hex?: string } | null
  product_sizes?: { name: string } | null
}

export default function InventoryPage() {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [quickAdd, setQuickAdd] = useState<Record<string, string>>({})

  const fetchInventory = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/inventory')
      if (res.ok) {
        const data = await res.json()
        setVariants(data.variants || data || [])
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  const updateStock = async (variantId: string, newStock: number) => {
    setUpdatingId(variantId)
    try {
      const res = await adminFetch(`/api/admin/inventory/${variantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: Math.max(0, newStock) }),
      })
      if (res.ok) {
        setVariants(prev => prev.map(v => v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v))
      }
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const quickStockUpdate = async (variantId: string, delta: number) => {
    const v = variants.find(v => v.id === variantId)
    if (!v) return
    await updateStock(variantId, v.stock + delta)
  }

  const getStockSeverity = (stock: number) => {
    if (stock === 0) return { label: 'OUT', color: 'text-red-500', bg: 'bg-red-500/10' }
    if (stock <= 3) return { label: 'CRITICAL', color: 'text-[#FF5131]', bg: 'bg-[#FF5131]/10' }
    if (stock <= 7) return { label: 'LOW', color: 'text-amber-600', bg: 'bg-amber-500/10' }
    return { label: 'OK', color: 'text-black/30 dark:text-white/30', bg: '' }
  }

  const filtered = variants.filter(v => {
    if (filter === 'low' && v.stock > 7) return false
    if (filter === 'out' && v.stock > 0) return false
    if (search) {
      const q = search.toLowerCase()
      const name = v.product_name || (v.product as any)?.name || ''
      const color = (v.product_colors as any)?.name || ''
      const size = (v.product_sizes as any)?.name || ''
      return name.toLowerCase().includes(q) || color.toLowerCase().includes(q) || size.toLowerCase().includes(q)
    }
    return true
  })

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
  const outOfStock = variants.filter(v => v.stock === 0).length
  const lowStock = variants.filter(v => v.stock > 0 && v.stock <= 7).length

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-black/5 dark:bg-white/5 animate-pulse" />)}
        </div>
        {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-black/5 dark:bg-white/5 animate-pulse" />)}
      </div>
    )
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`${cardClass} p-4`}>
          <p className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-1">Total Stock</p>
          <p className="text-xl font-bold text-black dark:text-white tabular-nums">{totalStock}</p>
        </div>
        <div className={`${cardClass} p-4`}>
          <p className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-1">Low Stock</p>
          <p className="text-xl font-bold text-amber-600 tabular-nums">{lowStock}</p>
        </div>
        <div className={`${cardClass} p-4`}>
          <p className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mb-1">Out of Stock</p>
          <p className="text-xl font-bold text-red-500 tabular-nums">{outOfStock}</p>
        </div>
      </div>

      {/* Filter + search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex gap-1">
          {[
            { value: 'all' as const, label: `All (${variants.length})` },
            { value: 'low' as const, label: `Low (${lowStock})` },
            { value: 'out' as const, label: `Out (${outOfStock})` },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-[11px] font-medium tracking-[0.05em] uppercase transition-colors ${
                filter === f.value ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search inventory..." className="w-full sm:w-56" />
      </div>

      {/* Inventory table */}
      {filtered.length > 0 ? (
        <div className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5">Product</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 hidden sm:table-cell">Variant</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 text-center">Stock</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 text-center">Status</th>
                  <th className="text-[10px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.1em] py-2.5 px-4 border-b border-black/5 dark:border-white/5 text-right">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => {
                  const severity = getStockSeverity(v.stock)
                  const productName = v.product_name || (v.product as any)?.name || 'Unknown'
                  const colorName = (v.product_colors as any)?.name || ''
                  const sizeName = (v.product_sizes as any)?.name || ''
                  return (
                    <tr key={v.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-xs text-black dark:text-white border-b border-black/5 dark:border-white/5">{productName}</td>
                      <td className="py-3 px-4 text-xs text-black/40 dark:text-white/40 border-b border-black/5 dark:border-white/5 hidden sm:table-cell">
                        {colorName}{colorName && sizeName ? ' / ' : ''}{sizeName}
                      </td>
                      <td className="py-3 px-4 border-b border-black/5 dark:border-white/5 text-center">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setVariants(prev => prev.map(vv => vv.id === v.id ? { ...vv, stock: val } : vv))
                          }}
                          onBlur={(e) => updateStock(v.id, parseInt(e.target.value) || 0)}
                          onKeyDown={(e) => { if (e.key === 'Enter') updateStock(v.id, parseInt((e.target as HTMLInputElement).value) || 0) }}
                          disabled={updatingId === v.id}
                          className="w-16 text-center text-xs font-mono bg-transparent border border-black/10 dark:border-white/10 py-1 px-1 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white disabled:opacity-30"
                        />
                      </td>
                      <td className="py-3 px-4 border-b border-black/5 dark:border-white/5 text-center">
                        <span className={`text-[10px] font-medium tracking-[0.1em] uppercase px-1.5 py-0.5 ${severity.bg} ${severity.color}`}>
                          {severity.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b border-black/5 dark:border-white/5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {[1, 5, 10].map(delta => (
                            <button
                              key={delta}
                              onClick={() => quickStockUpdate(v.id, delta)}
                              disabled={updatingId === v.id}
                              className="px-1.5 py-0.5 text-[10px] font-medium text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white border border-black/10 dark:border-white/10 disabled:opacity-30 transition-colors"
                            >
                              +{delta}
                            </button>
                          ))}
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
        <EmptyState title="No inventory data" description="Add products with variants to track stock." />
      )}
    </div>
  )
}
