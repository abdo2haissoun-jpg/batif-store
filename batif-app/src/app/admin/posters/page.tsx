'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'
import {
  cardClass,
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
          <Link href="/admin/posters/new" className={btnOrange}>
            + ADD POSTER
          </Link>
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
                  <Link
                    href={`/admin/posters/${poster.id}/edit`}
                    className={`text-[10px] px-2 py-1 border uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                      isDark ? 'border-white/15 text-white' : 'border-black/15 text-black'
                    }`}
                  >
                    EDIT
                  </Link>
                  <button onClick={() => setDeleteTarget(poster)} className={btnDanger}>
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
