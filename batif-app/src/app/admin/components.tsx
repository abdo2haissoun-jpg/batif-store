'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/lib/theme-context'

// ============================================================
// DESIGN TOKENS — BATIF Admin
// Colors: #000000, #FFFFFF, #FF5131
// Typography: Inter, tight, editorial
// ============================================================

// Form elements
export const inputClass = "w-full px-3 py-2 border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-black/30 dark:placeholder:text-white/30"
export const selectClass = "w-full px-3 py-2 border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors appearance-none"
export const textareaClass = "w-full px-3 py-2 border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none placeholder:text-black/30 dark:placeholder:text-white/30"

// Labels
export const labelClass = "block text-[11px] font-medium text-black/50 dark:text-white/50 mb-1 uppercase tracking-[0.08em]"

// Cards & surfaces
export const cardClass = "bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 p-5 sm:p-6"
export const sectionTitleClass = "text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-[0.1em] mb-3"

// Buttons
export const btnPrimary = "bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-medium tracking-wide uppercase hover:bg-black/80 dark:hover:bg-white/90 transition-all disabled:opacity-30"
export const btnSecondary = "px-4 py-2 text-xs font-medium tracking-wide uppercase border border-black/15 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
export const btnDanger = "text-xs font-medium px-3 py-1.5 text-[#FF5131] hover:bg-[#FF5131]/10 transition-colors"
export const btnOrange = "bg-[#FF5131] text-white px-4 py-2 text-xs font-medium tracking-wide uppercase hover:bg-[#FF5131]/90 transition-all disabled:opacity-30"

// Status colors
export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  new: { bg: 'bg-[#FF5131]/10', text: 'text-[#FF5131]', dot: 'bg-[#FF5131]' },
  confirmed: { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black dark:text-white', dot: 'bg-black dark:bg-white' },
  packing: { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/60 dark:text-white/60', dot: 'bg-black/40 dark:bg-white/40' },
  shipped: { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/60 dark:text-white/60', dot: 'bg-black/40 dark:bg-white/40' },
  delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  returned: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  published: { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black dark:text-white', dot: 'bg-black dark:bg-white' },
  draft: { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40', dot: 'bg-black/30 dark:bg-white/30' },
  archived: { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/30 dark:text-white/30', dot: 'bg-black/20 dark:bg-white/20' },
}

// ============================================================
// STATUS BADGE COMPONENT
// ============================================================
export function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'xs' | 'sm' }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.new
  return (
    <span className={`inline-flex items-center gap-1.5 ${colors.bg} ${colors.text} ${size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} font-medium tracking-wide uppercase`}>
      <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
      {status}
    </span>
  )
}

// ============================================================
// STAT CARD — Compact KPI
// ============================================================
export function StatCard({ label, value, change, changeLabel, loading }: {
  label: string
  value: string
  change?: number
  changeLabel?: string
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className={`${cardClass} p-4`}>
        <div className="h-2 w-16 bg-black/5 dark:bg-white/5 mb-3" />
        <div className="h-7 w-24 bg-black/5 dark:bg-white/5 mb-2" />
        <div className="h-2 w-20 bg-black/5 dark:bg-white/5" />
      </div>
    )
  }

  return (
    <div className={`${cardClass} p-4`}>
      <p className="text-[10px] font-medium text-black/40 dark:text-white/40 uppercase tracking-[0.1em] mb-1.5">{label}</p>
      <p className="text-2xl font-bold text-black dark:text-white tracking-tight tabular-nums">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className={`text-[11px] font-medium ${change >= 0 ? 'text-emerald-600' : 'text-[#FF5131]'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
          <span className="text-[11px] text-black/30 dark:text-white/30">{changeLabel || 'vs previous'}</span>
        </div>
      )}
    </div>
  )
}

// ============================================================
// SKELETON LOADING
// ============================================================
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-black/5 dark:bg-white/5 animate-pulse ${className}`} />
}

// ============================================================
// SEARCH INPUT
// ============================================================
export function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pl-8`}
      />
    </div>
  )
}

// ============================================================
// EMPTY STATE
// ============================================================
export function EmptyState({ title, description, action }: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-medium text-black dark:text-white mb-1">{title}</p>
      {description && <p className="text-xs text-black/40 dark:text-white/40 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// ============================================================
// TABLE SHELL — reusable table wrapper
// ============================================================
export function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">{children}</table>
    </div>
  )
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-[10px] font-medium text-black/40 dark:text-white/40 uppercase tracking-[0.1em] py-2.5 px-3 border-b border-black/8 dark:border-white/8 ${className}`}>{children}</th>
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 px-3 text-sm text-black dark:text-white border-b border-black/5 dark:border-white/5 ${className}`}>{children}</td>
}

// ============================================================
// SECTION HEADER
// ============================================================
export function SectionHeader({ title, subtitle, action }: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-[0.1em]">{title}</h2>
        {subtitle && <p className="text-[11px] text-black/30 dark:text-white/30 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ============================================================
// DATE FORMATTER
// ============================================================
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatRelative(date: string) {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

// ============================================================
// CONFIRM DIALOG COMPONENT
// ============================================================
interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 dark:bg-white/20 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 w-full max-w-sm p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-black dark:text-white mb-2">{title}</h3>
        <p className="text-xs text-black/50 dark:text-white/50 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-[11px] font-medium tracking-wide uppercase transition-colors ${
              danger
                ? 'bg-[#FF5131] text-white hover:bg-[#FF5131]/90'
                : 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
