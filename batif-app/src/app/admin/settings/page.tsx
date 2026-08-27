'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminFetch } from '@/lib/admin-fetch'
import { inputClass, labelClass, cardClass, sectionTitleClass, btnPrimary } from '@/app/admin/components'

export default function AdminSettings() {
  const [settings, setSettings] = useState({ store_name: 'BATIF STORE', store_email: 'contact@batif.store', store_phone: '+212 661 735 339', delivery_fee: 30, currency: 'MAD', instagram: '@batif.store', store_status: 'open' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSettings() }, [])
  const fetchSettings = async () => {
    try { const r = await adminFetch('/api/admin/settings'); if (r.ok) { const d = await r.json(); if (d.settings) setSettings(prev => ({ ...prev, ...d.settings })) } }
    catch {} finally { setLoading(false) }
  }
  const handleSave = async () => {
    setSaving(true)
    try {
      const r = await adminFetch('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(settings) })
      if (r.ok) { toast.success('Settings saved') } else { toast.error('Failed') }
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading settings...</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="mb-8"><h1 className="text-2xl font-bold tracking-tight">Settings</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your store configuration</p></div>

      <div className={cardClass}>
        <h2 className={sectionTitleClass}>Store Information</h2>
        <div className="space-y-4">
          <div><label className={labelClass}>Store Name</label><input value={settings.store_name} onChange={(e) => setSettings(prev => ({ ...prev, store_name: e.target.value }))} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Store Email</label><input type="email" value={settings.store_email} onChange={(e) => setSettings(prev => ({ ...prev, store_email: e.target.value }))} className={inputClass} /></div>
            <div><label className={labelClass}>Store Phone</label><input value={settings.store_phone} onChange={(e) => setSettings(prev => ({ ...prev, store_phone: e.target.value }))} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Delivery Fee (MAD)</label><input type="number" value={settings.delivery_fee} onChange={(e) => setSettings(prev => ({ ...prev, delivery_fee: parseFloat(e.target.value) || 0 }))} className={inputClass} /></div>
            <div><label className={labelClass}>Currency</label><input value={settings.currency} onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Instagram</label><input value={settings.instagram} onChange={(e) => setSettings(prev => ({ ...prev, instagram: e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>Store Status</label>
            <select value={settings.store_status} onChange={(e) => setSettings(prev => ({ ...prev, store_status: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF5131] text-sm">
              <option value="open">Open</option><option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pb-8">
        <button onClick={handleSave} disabled={saving} className={btnPrimary}>{saving ? 'Saving...' : 'Save Settings'}</button>
      </div>
    </div>
  )
}
