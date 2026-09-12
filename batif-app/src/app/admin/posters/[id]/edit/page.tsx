'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { inputClass, selectClass, textareaClass, labelClass, cardClass, sectionTitleClass, btnPrimary, btnSecondary, btnOrange } from '../../../components'

const CATEGORIES = ['Art Poster', 'Photo Print', 'Illustration', 'Typography', 'Limited Edition']
const MATERIALS = ['Premium Matte Paper', 'Textured Fine Art Paper', 'Glossy Photo Paper', 'Canvas Print', 'Framed Print']

export default function EditPosterPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Art Poster',
    material: 'Premium Matte Paper',
    status: 'draft' as 'draft' | 'published',
    is_limited: false,
    badge: '',
  })
  const [images, setImages] = useState<Array<{ url: string }>>([])
  const [sizes, setSizes] = useState<Array<{ name: string; price: string }>>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/posters/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load poster')
        const p = data.data
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: String(p.price || ''),
          category: p.category || 'Art Poster',
          material: p.material || 'Premium Matte Paper',
          status: p.status === 'published' ? 'published' : 'draft',
          is_limited: p.is_limited || false,
          badge: p.badge || '',
        })
        setImages((p.product_images || []).map((i: any) => ({ url: i.url })))
        setSizes((p.product_sizes || []).map((s: any) => ({ name: s.name, price: s.price ? String(s.price) : '' })))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')

    const token = sessionStorage.getItem('batif_admin_token') || ''
    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'products')
      formData.append('folder', 'posters')

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        })
        const data = await res.json()
        if (data.url) {
          uploadedUrls.push(data.url)
        } else {
          setError(`Failed to upload ${file.name}: ${data.error || 'Unknown error'}`)
        }
      } catch (err: any) {
        setError(`Failed to upload ${file.name}: ${err.message}`)
      }
    }

    if (uploadedUrls.length > 0) {
      setImages(prev => [...prev, ...uploadedUrls.map(url => ({ url }))])
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx))

  const setMainImage = (idx: number) => {
    setImages(prev => {
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      return [item, ...next]
    })
  }

  const updateSize = (idx: number, field: 'name' | 'price', value: string) => {
    setSizes(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const handleSave = async (publish?: boolean) => {
    if (!form.name.trim()) {
      setError('Please enter a poster title')
      return
    }
    setSaving(true)
    setError('')

    try {
      const status = publish === undefined ? form.status : (publish ? 'published' : 'draft')
      const response = await fetch(`/api/admin/posters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price) || 0,
          category: form.category,
          material: form.material,
          status,
          is_limited: form.is_limited,
          badge: form.badge || null,
          images: images.map((img, idx) => ({
            url: img.url,
            image_type: idx === 0 ? 'main' : 'gallery',
          })),
          sizes: sizes.filter(s => s.name.trim()).map(s => ({
            name: s.name,
            price: s.price ? Number(s.price) : undefined,
          })),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update poster')
      router.push('/admin/posters')
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider">Loading poster…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-black/8 dark:border-white/8 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-[1000px] mx-auto">
          <button
            onClick={() => router.push('/admin/posters')}
            className="text-[11px] text-black/40 dark:text-white/40 uppercase tracking-wider hover:text-black dark:hover:text-white transition-colors mb-2"
          >
            ← Back to Posters
          </button>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            Edit Poster
          </h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-[#FF5131]/10 border border-[#FF5131]/30 text-[#FF5131] text-xs px-4 py-3">
            {error}
          </div>
        )}

        {/* POSTER INFORMATION */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Poster Information</p>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="PEACE OF MIND"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="A study of silence, space and the moments we rarely make time for."
                rows={4}
                className={textareaClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className={selectClass}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Material</label>
                <select
                  value={form.material}
                  onChange={e => setForm(p => ({ ...p, material: e.target.value }))}
                  className={selectClass}
                >
                  {MATERIALS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Pricing</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Base Price (MAD)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                placeholder="350"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Badge (optional)</label>
              <input
                type="text"
                value={form.badge}
                onChange={e => setForm(p => ({ ...p, badge: e.target.value }))}
                placeholder="LIMITED ART PRINT"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Limited Edition</label>
              <label className="flex items-center gap-2 h-[38px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_limited}
                  onChange={e => setForm(p => ({ ...p, is_limited: e.target.checked }))}
                  className="accent-[#FF5131] w-4 h-4"
                />
                <span className="text-xs text-black dark:text-white">This is a limited edition print</span>
              </label>
            </div>
          </div>
        </div>

        {/* SIZES */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <p className={sectionTitleClass + ' mb-0'}>Sizes & Prices per Size</p>
            <button
              onClick={() => setSizes(prev => [...prev, { name: '', price: '' }])}
              className="text-[11px] text-[#FF5131] uppercase tracking-wider hover:opacity-80"
            >
              + Add Size
            </button>
          </div>
          <div className="space-y-3">
            {sizes.map((size, idx) => (
              <div key={idx} className="grid grid-cols-[100px_1fr_40px] gap-3 items-center">
                <input
                  type="text"
                  value={size.name}
                  onChange={e => updateSize(idx, 'name', e.target.value)}
                  placeholder="A2"
                  className={inputClass}
                />
                <div className="relative">
                  <input
                    type="number"
                    value={size.price}
                    onChange={e => updateSize(idx, 'price', e.target.value)}
                    placeholder="Price for this size"
                    className={inputClass + ' pr-12'}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-black/30 dark:text-white/30">MAD</span>
                </div>
                <button
                  onClick={() => setSizes(prev => prev.filter((_, i) => i !== idx))}
                  className="text-[#FF5131] hover:opacity-70 text-sm"
                  title="Remove size"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-black/40 dark:text-white/40 mt-3">
            Leave a size price empty to use the base price.
          </p>
        </div>

        {/* IMAGES */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Images</p>

          <label className="block border-2 border-dashed border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40 transition-colors cursor-pointer py-10 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={e => handleUpload(e.target.files)}
            />
            {uploading ? (
              <span className="text-xs text-black/50 dark:text-white/50">Uploading…</span>
            ) : (
              <>
                <span className="block text-sm text-black dark:text-white font-medium">Click to upload images</span>
                <span className="block text-[11px] text-black/40 dark:text-white/40 mt-1">PNG, JPG or WEBP · First image becomes the main poster</span>
              </>
            )}
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-[3/4] bg-black/5 dark:bg-white/5 overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-black text-white text-[9px] px-1.5 py-0.5 uppercase tracking-wider">Main</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {idx !== 0 && (
                      <button
                        onClick={() => setMainImage(idx)}
                        className="text-[10px] text-white uppercase tracking-wider hover:text-[#FF5131]"
                      >
                        Set as main
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(idx)}
                      className="text-[10px] text-[#FF5131] uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VISIBILITY */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Visibility</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                className={selectClass}
              >
                <option value="draft">Draft — hidden from store</option>
                <option value="published">Published — visible on store</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button onClick={() => router.push('/admin/posters')} className={btnSecondary}>
            Cancel
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving || uploading || !form.name.trim()}
            className={btnSecondary}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
