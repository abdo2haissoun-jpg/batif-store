'use client'

import { useState } from 'react'
import { adminFetch } from '@/lib/admin-fetch'
import { cardClass, inputClass, labelClass, SectionHeader } from '@/app/admin/components'

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('BATIF STORE')
  const [storeEmail, setStoreEmail] = useState('contact@batif-store.com')
  const [storePhone, setStorePhone] = useState('+212 6XX-XXXXXX')
  const [currency, setCurrency] = useState('MAD')
  const [deliveryFee, setDeliveryFee] = useState('30')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await adminFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName, storeEmail, storePhone, currency, deliveryFee }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {saved && (
        <div className="px-3 py-2 bg-black/5 dark:bg-white/5 text-xs text-black dark:text-white">
          Settings saved.
        </div>
      )}

      {/* Store */}
      <div className={`${cardClass} p-5`}>
        <SectionHeader title="Store" subtitle="Basic store information" />
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Store Name</label>
            <input value={storeName} onChange={e => setStoreName(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input value={storeEmail} onChange={e => setStoreEmail(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={storePhone} onChange={e => setStorePhone(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputClass}>
              <option value="MAD">MAD — Moroccan Dirham</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className={`${cardClass} p-5`}>
        <SectionHeader title="Delivery" subtitle="Shipping configuration" />
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Delivery Fee (MAD)</label>
            <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Free Shipping Threshold (MAD)</label>
            <input type="number" placeholder="0 = no free shipping" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Account */}
      <div className={`${cardClass} p-5`}>
        <SectionHeader title="Account" subtitle="Admin account information" />
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input value="abdo2.haissoun@gmail.com" disabled className={`${inputClass} opacity-50`} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" value="••••••••" disabled className={`${inputClass} opacity-50`} />
            <p className="text-[11px] text-black/30 dark:text-white/30 mt-1">Change password through Supabase Auth.</p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-black/30 dark:text-white/30">Changes are saved to the admin configuration.</p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-[11px] font-medium tracking-[0.08em] uppercase hover:bg-black/80 dark:hover:bg-white/90 transition-colors disabled:opacity-30"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
