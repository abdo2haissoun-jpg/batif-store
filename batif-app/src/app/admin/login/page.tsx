'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bsibadesqhzerzuxegwv.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error_description || data.msg || 'Invalid credentials')
      document.cookie = `sb-access-token=${data.access_token}; path=/; max-age=${data.expires_in}; SameSite=Lax`
      sessionStorage.setItem('batif_admin_user', JSON.stringify(data.user))
      sessionStorage.setItem('batif_admin_token', data.access_token)
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[280px]">
        {/* Logo */}
        <div className="mb-10 text-center">
          <svg width="120" height="28" viewBox="0 0 879 439" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
            <path d="M79.0506 438.273H0V425.905C10.7552 424.292 20.9726 417.301 20.9726 402.244V36.0298C20.9726 20.4348 11.2929 12.9062 0 12.3685V0H79.0506C117.231 0 139.817 14.5195 139.817 47.3228V149.497C139.817 171.545 129.062 185.527 110.778 191.98C129.062 200.046 139.817 216.179 139.817 238.227V390.951C139.817 423.754 117.231 438.273 79.0506 438.273ZM59.1535 203.273V411.386C59.1535 418.914 60.229 426.443 72.5975 425.905H77.4373C91.9568 425.905 99.4854 412.999 99.4854 402.244V221.557C99.4854 210.801 91.9568 198.971 77.4373 198.971H63.4555C63.4555 198.971 59.1535 198.971 59.1535 203.273ZM59.1535 26.8879V182.3C59.1535 186.065 63.4555 186.602 63.4555 186.602H77.4373C91.9568 186.602 99.4854 173.696 99.4854 162.941V33.8788C99.4854 23.1236 91.9568 12.3685 77.4373 12.3685H72.5975C60.229 11.8307 59.1535 18.8215 59.1535 26.8879Z" className="fill-black dark:fill-white"/>
            <path d="M250.869 425.905V438.273H193.866V425.905C207.31 422.678 216.452 416.763 218.603 401.706L254.633 30.1145C254.633 20.4348 249.255 14.5195 240.114 12.3685V0H300.343L339.599 401.706C341.212 415.688 348.203 422.678 361.647 425.905V438.273H286.361V425.905C298.729 422.678 303.031 415.15 300.88 401.706L289.05 279.635C289.05 279.635 289.05 275.87 284.21 275.87H247.104C242.802 275.87 242.802 279.097 242.802 279.097L230.972 401.706C228.821 418.376 237.962 424.83 250.869 425.905ZM244.953 259.738C244.953 259.738 244.416 263.502 248.18 263.502H283.134C287.436 263.502 287.436 259.2 287.436 259.2L267.539 58.6157C267.001 57.5402 264.85 57.5402 264.313 58.6157L244.953 259.738Z" className="fill-black dark:fill-white"/>
            <path d="M503.452 425.905V438.273H423.863V425.905C434.618 424.83 444.298 417.301 444.298 402.244V29.039C444.298 22.5859 443.223 12.3685 432.467 12.3685C393.749 11.8307 395.9 75.824 395.9 99.4854H383.531V0H543.783V99.4854H531.415C531.415 75.824 533.566 11.8307 494.847 12.3685C484.092 12.3685 483.017 22.5859 482.479 29.039V403.319C483.017 417.839 492.696 424.83 503.452 425.905Z" className="fill-black dark:fill-white"/>
            <path d="M607.331 12.3685V0H687.458V12.3685C676.702 13.9817 666.485 20.4348 666.485 36.0298V402.244C666.485 417.301 676.702 424.292 687.458 425.905V438.273H607.331V425.905C618.087 424.292 628.304 417.301 628.304 402.244V36.0298C628.304 20.4348 618.087 13.9817 607.331 12.3685Z" className="fill-black dark:fill-white"/>
            <path d="M826.695 438.273H747.107V425.905C757.862 424.83 767.542 417.839 768.079 403.319V36.0298C768.079 20.4348 758.4 13.444 747.107 12.3685V0H878.858V99.4854H866.489C866.489 75.824 867.565 16.6705 821.317 12.3685C811.1 11.2929 806.26 18.2838 806.26 29.039V210.264C806.26 212.415 807.873 212.952 808.949 212.952C833.148 211.877 849.281 205.962 853.583 175.847H863.8V261.889H853.583C849.281 232.312 833.686 226.396 809.487 225.321C808.411 225.321 806.26 225.859 806.26 228.01V402.244C806.26 417.301 815.94 424.83 826.695 425.905V438.273Z" className="fill-black dark:fill-white"/>
          </svg>
          <p className="text-[11px] text-black/30 dark:text-white/30 tracking-[0.1em] uppercase">Admin</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="text-[11px] text-[#FF5131] py-2">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-0 py-2.5 border-0 border-b border-black/20 dark:border-white/20 bg-transparent text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-black/30 dark:placeholder:text-white/30"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-0 py-2.5 border-0 border-b border-black/20 dark:border-white/20 bg-transparent text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-black/30 dark:placeholder:text-white/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-black/80 dark:hover:bg-white/90 transition-colors disabled:opacity-30 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
