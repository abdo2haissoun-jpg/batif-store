'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminFetch } from '@/lib/admin-fetch'

interface InventoryItem { id: string; product_id: string; stock: number; product?: { name: string }; color?: { name: string; hex: string }; size?: { name: string } }

export default function AdminInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState(0)

  useEffect(() => { fetchInventory() }, [])
  const fetchInventory = async () => {
    try { const r = await adminFetch('/api/admin/inventory'); if (r.ok) { const d = await r.json(); setItems(d.items || []) } }
    catch {} finally { setLoading(false) }
  }
  const handleUpdateStock = async (itemId: string) => {
    const r = await adminFetch(`/api/admin/inventory/${itemId}`, { method: 'PATCH', body: JSON.stringify({ stock: editStock }) })
    if (r.ok) { toast.success('Stock updated'); setEditingId(null); fetchInventory() } else { toast.error('Failed to update') }
  }

  const grouped = items.reduce((acc, item) => {
    const pid = item.product_id
    if (!acc[pid]) acc[pid] = { name: item.product?.name || 'Unknown', variants: [] as InventoryItem[] }
    acc[pid].variants.push(item)
    return acc
  }, {} as Record<string, { name: string; variants: InventoryItem[] }>)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Inventory</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{items.length} variants tracked</p></div>
      {loading ? <div className="text-gray-400 text-sm">Loading inventory...</div> : items.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-400 text-sm">No products in inventory. Add products first.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([productId, group]) => {
            const totalStock = group.variants.reduce((sum, v) => sum + v.stock, 0)
            const lowItems = group.variants.filter(v => v.stock <= 5)
            return (
              <div key={productId} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h2 className="font-semibold text-sm">{group.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Total: {totalStock}</span>
                    {lowItems.length > 0 && <span className="text-[10px] bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">⚠ {lowItems.length} low</span>}
                  </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {group.variants.map((item) => (
                    <div key={item.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" style={{ backgroundColor: item.color?.hex }} />
                        <span className="text-sm">{item.color?.name} / {item.size?.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingId === item.id ? (
                          <>
                            <input type="number" value={editStock} onChange={(e) => setEditStock(parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF5131]" />
                            <button onClick={() => handleUpdateStock(item.id)} className="text-xs font-medium text-[#FF5131] dark:text-[#FF5131] hover:underline">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:underline">Cancel</button>
                          </>
                        ) : (
                          <>
                            <span className={`text-sm font-medium ${item.stock <= 3 ? 'text-red-600 dark:text-red-400' : item.stock <= 5 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                              {item.stock <= 3 && '⚠ '}{item.stock} units
                            </span>
                            <button onClick={() => { setEditingId(item.id); setEditStock(item.stock) }} className="text-xs font-medium text-[#FF5131] dark:text-[#FF5131] hover:underline">Edit</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
