'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { adminFetch } from '@/lib/admin-fetch'
import { inputClass, selectClass, labelClass, cardClass, sectionTitleClass, btnPrimary, btnSecondary } from '@/app/admin/components'

const CATEGORIES = ['T-Shirts', 'Outerwear', 'Polo Edition', 'Shorts', 'Accessories']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const IMAGE_TYPES = ['main', 'front', 'back', 'detail', 'editorial', 'additional']

export default function AddProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', price: '', original_price: '', category: 'T-Shirts',
    material: '', fit: '', care: '', sku: '', status: 'draft' as 'draft' | 'published' | 'archived',
    is_limited: false, badge: '',
  })
  const [colors, setColors] = useState<Array<{ name: string; hex: string }>>([{ name: 'Matte Black', hex: '#111111' }])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL'])
  const [stock, setStock] = useState<Record<string, Record<string, number>>>({})
  const [images, setImages] = useState<Array<{ url: string; type: string; file?: File; preview?: string }>>([{ url: '', type: 'main' }])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const addColor = () => setColors([...colors, { name: '', hex: '#000000' }])
  const updateColor = (i: number, f: 'name' | 'hex', v: string) => setColors(prev => prev.map((c, idx) => idx === i ? { ...c, [f]: v } : c))
  const removeColor = (i: number) => setColors(prev => prev.filter((_, idx) => idx !== i))
  const addImage = () => setImages(prev => [...prev, { url: '', type: 'additional' }])
  const updateImageType = (i: number, v: string) => setImages(prev => prev.map((img, idx) => idx === i ? { ...img, type: v } : img))
  const updateImageUrl = (i: number, v: string) => setImages(prev => prev.map((img, idx) => idx === i ? { ...img, url: v, file: undefined, preview: undefined } : img))
  const removeImage = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i))
  const handleFileSelect = (i: number, file: File) => {
    setImages(prev => prev.map((img, idx) => idx === i ? { ...img, file, preview: URL.createObjectURL(file), url: '' } : img))
  }
  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'products')
    fd.append('folder', 'uploads')
    try {
      const res = await adminFetch('/api/admin/upload', { method: 'POST', body: fd, headers: {} })
      if (!res.ok) return null
      const data = await res.json()
      return data.url
    } catch { return null }
  }
  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const getStock = (c: string, s: string) => stock[c]?.[s] || 0
  const setStockValue = (c: string, s: string, v: string) => setStock(prev => ({ ...prev, [c]: { ...(prev[c] || {}), [s]: parseInt(v) || 0 } }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setLoading(true)
    try {
      const res = await adminFetch('/api/admin/products', { method: 'POST', body: JSON.stringify({ ...form, price: parseFloat(form.price), original_price: form.original_price ? parseFloat(form.original_price) : null }) })
      if (!res.ok) throw new Error('Failed to create product')
      const { product } = await res.json()

      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        let imageUrl = img.url
        if (img.file) {
          toast.loading(`Uploading image ${i + 1}...`, { id: `upload-${i}` })
          const uploaded = await uploadFile(img.file)
          toast.dismiss(`upload-${i}`)
          if (uploaded) imageUrl = uploaded
        }
        if (imageUrl) {
          await adminFetch('/api/admin/products/images', { method: 'POST', body: JSON.stringify({ product_id: product.id, url: imageUrl, image_type: img.type, sort_order: i }) })
        }
      }

      for (let i = 0; i < colors.length; i++) {
        if (colors[i].name) {
          const r = await adminFetch('/api/admin/products/colors', { method: 'POST', body: JSON.stringify({ product_id: product.id, name: colors[i].name, hex: colors[i].hex, sort_order: i }) })
        }
      }
      for (let i = 0; i < selectedSizes.length; i++) {
        await adminFetch('/api/admin/products/sizes', { method: 'POST', body: JSON.stringify({ product_id: product.id, name: selectedSizes[i], sort_order: i }) }).catch(() => {})
      }
      for (const color of colors.filter(c => c.name)) {
        for (const sizeName of selectedSizes) {
          const sv = getStock(color.name, sizeName)
          await adminFetch('/api/admin/products/variants', { method: 'POST', body: JSON.stringify({ product_id: product.id, color_id: '', size_id: '', stock: sv, color_name: color.name, size_name: sizeName }) })
        }
      }
      toast.success('Product created successfully!')
      router.push('/admin/products')
    } catch (err: any) { toast.error(err.message || 'Failed to create product') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new product for your store</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className={cardClass}>
          <h2 className={sectionTitleClass}>Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input name="name" value={form.name} onChange={handleFormChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Price (MAD) *</label>
              <input name="price" type="number" value={form.price} onChange={handleFormChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Original Price (MAD)</label>
              <input name="original_price" type="number" value={form.original_price} onChange={handleFormChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={form.category} onChange={handleFormChange} className={selectClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input name="sku" value={form.sku} onChange={handleFormChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleFormChange} className={selectClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Badge</label>
              <input name="badge" value={form.badge} onChange={handleFormChange} placeholder="e.g., NEW DROP" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_limited" checked={form.is_limited} onChange={handleFormChange} className="rounded border-gray-300 dark:border-gray-600" />
                <span className="text-sm font-medium">Limited Edition</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Material</label>
              <input name="material" value={form.material} onChange={handleFormChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fit</label>
              <input name="fit" value={form.fit} onChange={handleFormChange} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Care Instructions</label>
              <textarea name="care" value={form.care} onChange={handleFormChange} rows={2} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={cardClass}>
          <h2 className={sectionTitleClass}>Images</h2>
          <div className="space-y-4">
            {images.map((img, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/30">
                <div className="flex gap-3 items-start mb-3">
                  <select value={img.type} onChange={(e) => updateImageType(index, e.target.value)} className={selectClass + ' w-auto'}>
                    {IMAGE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                  {images.length > 1 && <button type="button" onClick={() => removeImage(index)} className="text-xs text-red-500 hover:text-red-700 px-2 py-1">Remove</button>}
                </div>
                {(img.preview || img.url) && <img src={img.preview || img.url} alt="" className="h-32 w-auto object-cover rounded-lg border border-gray-200 dark:border-gray-700 mb-3" />}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(index, f) }} className="hidden" id={`file-${index}`} />
                    <label htmlFor={`file-${index}`} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      📷 Choose from device
                    </label>
                    <span className="text-xs text-gray-400 dark:text-gray-500">or paste URL</span>
                  </div>
                  <input value={img.url} onChange={(e) => updateImageUrl(index, e.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addImage} className="mt-4 text-sm text-[#FF5131] dark:text-[#FF5131] hover:underline">+ Add Image</button>
        </div>

        {/* Colors */}
        <div className={cardClass}>
          <h2 className={sectionTitleClass}>Colors</h2>
          <div className="space-y-3">
            {colors.map((color, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input type="color" value={color.hex} onChange={(e) => updateColor(index, 'hex', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700" />
                <input value={color.name} onChange={(e) => updateColor(index, 'name', e.target.value)} placeholder="Color name" className={inputClass + ' flex-1'} />
                {colors.length > 1 && <button type="button" onClick={() => removeColor(index)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>}
              </div>
            ))}
          </div>
          <button type="button" onClick={addColor} className="mt-3 text-sm text-[#FF5131] dark:text-[#FF5131] hover:underline">+ Add Color</button>
        </div>

        {/* Sizes */}
        <div className={cardClass}>
          <h2 className={sectionTitleClass}>Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button key={size} type="button" onClick={() => toggleSize(size)}
                className={`px-4 py-2 border text-sm rounded-xl font-medium transition-all ${
                  selectedSizes.includes(size)
                    ? 'bg-[#FF5131] text-white border-[#FF5131]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                }`}>{size}</button>
            ))}
          </div>
        </div>

        {/* Stock */}
        {colors.some(c => c.name) && selectedSizes.length > 0 && (
          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Inventory</h2>
            <div className="space-y-4">
              {colors.filter(c => c.name).map(color => (
                <div key={color.name}>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {selectedSizes.map(size => (
                      <div key={size}>
                        <label className="text-[10px] text-gray-400 dark:text-gray-500 block mb-1 uppercase">{size}</label>
                        <input type="number" min="0" value={getStock(color.name, size)} onChange={(e) => setStockValue(color.name, size, e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF5131]" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={loading} className={btnPrimary}>{loading ? 'Saving...' : 'Create Product'}</button>
          <button type="button" onClick={() => router.push('/admin/products')} className={btnSecondary}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
