'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/lib/theme-context'
import {
  inputClass,
  selectClass,
  textareaClass,
  labelClass,
  cardClass,
  sectionTitleClass,
  btnPrimary,
  btnSecondary,
  btnDanger,
  btnOrange,
  ConfirmDialog,
} from '../components'

interface PosterImage {
  url: string
  image_type: string
}

interface PosterSize {
  name: string
  price?: number
}

interface Poster {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  status: string
  is_limited: boolean
  badge?: string
  material?: string
  product_type: string
  created_at: string
  product_images: PosterImage[]
  product_sizes: PosterSize[]
  product_colors: { name: string; hex: string }[]
}

export default function AdminPostersPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [posters, setPosters] = useState<Poster[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Poster | null>(null)
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Art Poster',
    material: 'Premium Matte Paper',
    status: 'draft',
    is_limited: false,
    badge: '',
    images: [] as { url: string; image_type: string }[],
    sizes: ['A3', 'A2', 'A1'] as { name: string; price: string }[],
  })

  const fetchPosters = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/posters?type=poster&status=${filter}`)
      const data = await res.json()
      setPosters(data.data || [])
    } catch (err) {
      console.error('Failed to fetch posters:', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchPosters() }, [fetchPosters])

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      category: 'Art Poster',
      material: 'Premium Matte Paper',
      status: 'draft',
      is_limited: false,
      badge: '',
      images: [],
      sizes: [
        { name: 'A3', price: '' },
        { name: 'A2', price: '' },
        { name: 'A1', price: '' },
      ],
    })
    setEditingPoster(null)
  }

  const openAddForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (poster: Poster) => {
    setEditingPoster(poster)
    setForm({
      name: poster.name,
      description: poster.description || '',
      price: String(poster.price || ''),
      category: poster.category || 'Art Poster',
      material: poster.material || 'Premium Matte Paper',
      status: poster.status,
      is_limited: poster.is_limited || false,
      badge: poster.badge || '',
      images: poster.product_images || [],
      sizes: poster.product_sizes?.length > 0
        ? poster.product_sizes.map((s) => ({ name: s.name, price: String(s.price || '') }))
        : [{ name: 'A3', price: '' }, { name: 'A2', price: '' }, { name: 'A1', price: '' }],
    })
    setIsFormOpen(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price ? Number(form.price) : 0,
        category: form.category,
        material: form.material,
        status: form.status,
        is_limited: form.is_limited,
        badge: form.badge || null,
        product_type: 'poster',
        images: form.images,
        sizes: form.sizes.filter(s => s.name).map(s => ({
          name: s.name,
          price: s.price ? Number(s.price) : undefined,
        })),
      }

      if (editingPoster) {
        await fetch(`/api/admin/posters/${editingPoster.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/admin/posters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      setIsFormOpen(false)
      resetForm()
      fetchPosters()
    } catch (err) {
      console.error('Failed to save poster:', err)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await fetch(`/api/admin/posters/${deleteTarget.id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      fetchPosters()
    } catch (err) {
      console.error('Failed to delete poster:', err)
    }
  }

  const addImage = () => {
    setForm(prev => ({
      ...prev,
      images: [...prev.images, { url: '', image_type: prev.images.length === 0 ? 'main' : 'gallery' }],
    }))
  }

  const updateImage = (idx: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === idx ? { ...img, [field]: value } : img),
    }))
  }

  const removeImage = (idx: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }))
  }

  const addSize = () => {
    setForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', price: '' }],
    }))
  }

  const updateSize = (idx: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => i === idx ? { ...s, [field]: value } : s),
    }))
  }

  const removeSize = (idx: number) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== idx),
    }))
  }

  const filtered = posters.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
      {/* Header */}
      <div className={`px-4 sm:px-6 lg:px-8 py-6 border-b ${isDark ? 'border-white/8' : 'border-black/8'}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              Posters
            </h1>
            <p className={`text-[11px] mt-1 uppercase tracking-[0.1em] ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              {posters.length} total · Art prints & poster management
            </p>
          </div>
          <button onClick={openAddForm} className={btnOrange}>
            + ADD POSTER
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {(['all', 'published', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : isDark
                    ? 'text-white/50 hover:text-white border border-white/10'
                    : 'text-black/50 hover:text-black border border-black/10'
              }`}
            >
              {f}
            </button>
          ))}
          <div className="flex-1" />
          <input
            type="text"
            placeholder="SEARCH POSTERS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-[200px] sm:w-[260px] px-3 py-1.5 text-[11px] uppercase tracking-wider border focus:outline-none transition-colors ${
              isDark
                ? 'border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30'
                : 'border-black/10 bg-white text-black placeholder:text-black/30 focus:border-black/30'
            }`}
          />
        </div>

        {/* Posters List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`${cardClass} animate-pulse h-20`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={`${cardClass} text-center py-16`}>
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              {search ? 'No posters match your search.' : 'No posters yet. Click "ADD POSTER" to create your first poster.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table Header */}
            <div className={`grid grid-cols-12 gap-3 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.1em] ${
              isDark ? 'text-white/30' : 'text-black/30'
            }`}>
              <div className="col-span-1">IMAGE</div>
              <div className="col-span-3">NAME</div>
              <div className="col-span-2">CATEGORY</div>
              <div className="col-span-1">PRICE</div>
              <div className="col-span-2">SIZES</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-2 text-right">ACTIONS</div>
            </div>

            {filtered.map(poster => (
              <div
                key={poster.id}
                className={`grid grid-cols-12 gap-3 items-center px-4 py-3 border transition-colors ${
                  isDark
                    ? 'border-white/5 hover:bg-white/[0.02]'
                    : 'border-black/5 hover:bg-black/[0.02]'
                }`}
              >
                {/* Image */}
                <div className="col-span-1">
                  <div className={`w-10 h-14 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                    {poster.product_images?.[0]?.url ? (
                      <img
                        src={poster.product_images[0].url}
                        alt={poster.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-black/20 dark:text-white/20">
                        NO IMG
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="col-span-3">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                    {poster.name}
                  </p>
                  {poster.badge && (
                    <span className="text-[9px] uppercase tracking-wider text-[#FF5131]">{poster.badge}</span>
                  )}
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    {poster.category}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-1">
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                    {poster.price?.toLocaleString()} MAD
                  </span>
                </div>

                {/* Sizes */}
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {poster.product_sizes?.map((s, i) => (
                      <span key={i} className={`text-[10px] px-1.5 py-0.5 ${isDark ? 'bg-white/5 text-white/60' : 'bg-black/5 text-black/60'}`}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    poster.status === 'published'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-black/30 dark:text-white/30'
                  }`}>
                    {poster.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button onClick={() => openEditForm(poster)} className={btnSecondary + ' text-[10px] px-2 py-1'}>
                    EDIT
                  </button>
                  <button onClick={() => setDeleteTarget(poster)} className={btnDanger}>
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setIsFormOpen(false); resetForm() }} />
          <div className={`relative w-full max-w-[800px] mx-4 ${isDark ? 'bg-[#111]' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            {/* Form Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-white/8' : 'border-black/8'}`}>
              <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                {editingPoster ? 'EDIT POSTER' : 'ADD POSTER'}
              </h2>
              <button
                onClick={() => { setIsFormOpen(false); resetForm() }}
                className={`text-xl ${isDark ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black'}`}
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <p className={sectionTitleClass}>POSTER INFORMATION</p>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>TITLE</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="PEACE OF MIND"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>DESCRIPTION</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="A study of silence, space and the moments we rarely make time for."
                      rows={3}
                      className={textareaClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>CATEGORY</label>
                      <select
                        value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                        className={selectClass}
                      >
                        <option>Art Poster</option>
                        <option>Photo Print</option>
                        <option>Illustration</option>
                        <option>Typography</option>
                        <option>Limited Edition</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>MATERIAL</label>
                      <input
                        type="text"
                        value={form.material}
                        onChange={e => setForm(p => ({ ...p, material: e.target.value }))}
                        placeholder="Premium Matte Paper"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <p className={sectionTitleClass}>PRICING</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>BASE PRICE (MAD)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="350"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>BADGE</label>
                    <input
                      type="text"
                      value={form.badge}
                      onChange={e => setForm(p => ({ ...p, badge: e.target.value }))}
                      placeholder="LIMITED ART PRINT"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className={sectionTitleClass}>SIZES</p>
                  <button onClick={addSize} className="text-[10px] text-[#FF5131] uppercase tracking-wider hover:opacity-80">
                    + ADD SIZE
                  </button>
                </div>
                <div className="space-y-2">
                  {form.sizes.map((size, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={size.name}
                        onChange={e => updateSize(idx, 'name', e.target.value)}
                        placeholder="A1"
                        className={`${inputClass} w-[100px]`}
                      />
                      <input
                        type="number"
                        value={size.price}
                        onChange={e => updateSize(idx, 'price', e.target.value)}
                        placeholder="Price per size (optional)"
                        className={`${inputClass} flex-1`}
                      />
                      <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-black/30'}`}>MAD</span>
                      {form.sizes.length > 1 && (
                        <button onClick={() => removeSize(idx)} className="text-[10px] text-[#FF5131] hover:opacity-80">✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className={sectionTitleClass}>IMAGES</p>
                  <button onClick={addImage} className="text-[10px] text-[#FF5131] uppercase tracking-wider hover:opacity-80">
                    + ADD IMAGE URL
                  </button>
                </div>
                <div className="space-y-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className={`text-[10px] w-12 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                        {idx === 0 ? 'MAIN' : `#${idx + 1}`}
                      </span>
                      <input
                        type="url"
                        value={img.url}
                        onChange={e => updateImage(idx, 'url', e.target.value)}
                        placeholder="https://example.com/poster-image.jpg"
                        className={`${inputClass} flex-1`}
                      />
                      {img.url && (
                        <div className={`w-8 h-10 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <button onClick={() => removeImage(idx)} className="text-[10px] text-[#FF5131] hover:opacity-80">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center gap-6">
                <div>
                  <label className={labelClass}>STATUS</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className={`${selectClass} w-[160px]`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-5">
                  <input
                    type="checkbox"
                    checked={form.is_limited}
                    onChange={e => setForm(p => ({ ...p, is_limited: e.target.checked }))}
                    className="accent-[#FF5131]"
                  />
                  <span className={`text-xs ${isDark ? 'text-white' : 'text-black'}`}>LIMITED EDITION</span>
                </label>
              </div>
            </div>

            {/* Form Footer */}
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isDark ? 'border-white/8' : 'border-black/8'}`}>
              <button onClick={() => { setIsFormOpen(false); resetForm() }} className={btnSecondary}>
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name}
                className={btnOrange}
              >
                {editingPoster ? 'SAVE CHANGES' : 'CREATE POSTER'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="DELETE POSTER"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="DELETE"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
