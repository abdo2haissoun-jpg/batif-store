'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeProvider, useTheme } from '@/lib/theme-context'

const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ],
  },
  {
    label: 'COMMERCE',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { name: 'Products', href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      { name: 'Inventory', href: '/admin/inventory', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ],
  },
]

const BATIF_LOGO = () => (
  <svg width="68" height="16" viewBox="0 0 879 439" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-auto">
    <path d="M79.0506 438.273H0V425.905C10.7552 424.292 20.9726 417.301 20.9726 402.244V36.0298C20.9726 20.4348 11.2929 12.9062 0 12.3685V0H79.0506C117.231 0 139.817 14.5195 139.817 47.3228V149.497C139.817 171.545 129.062 185.527 110.778 191.98C129.062 200.046 139.817 216.179 139.817 238.227V390.951C139.817 423.754 117.231 438.273 79.0506 438.273ZM59.1535 203.273V411.386C59.1535 418.914 60.229 426.443 72.5975 425.905H77.4373C91.9568 425.905 99.4854 412.999 99.4854 402.244V221.557C99.4854 210.801 91.9568 198.971 77.4373 198.971H63.4555C63.4555 198.971 59.1535 198.971 59.1535 203.273ZM59.1535 26.8879V182.3C59.1535 186.065 63.4555 186.602 63.4555 186.602H77.4373C91.9568 186.602 99.4854 173.696 99.4854 162.941V33.8788C99.4854 23.1236 91.9568 12.3685 77.4373 12.3685H72.5975C60.229 11.8307 59.1535 18.8215 59.1535 26.8879Z" className="fill-black dark:fill-white"/>
    <path d="M250.869 425.905V438.273H193.866V425.905C207.31 422.678 216.452 416.763 218.603 401.706L254.633 30.1145C254.633 20.4348 249.255 14.5195 240.114 12.3685V0H300.343L339.599 401.706C341.212 415.688 348.203 422.678 361.647 425.905V438.273H286.361V425.905C298.729 422.678 303.031 415.15 300.88 401.706L289.05 279.635C289.05 279.635 289.05 275.87 284.21 275.87H247.104C242.802 275.87 242.802 279.097 242.802 279.097L230.972 401.706C228.821 418.376 237.962 424.83 250.869 425.905ZM244.953 259.738C244.953 259.738 244.416 263.502 248.18 263.502H283.134C287.436 263.502 287.436 259.2 287.436 259.2L267.539 58.6157C267.001 57.5402 264.85 57.5402 264.313 58.6157L244.953 259.738Z" className="fill-black dark:fill-white"/>
    <path d="M503.452 425.905V438.273H423.863V425.905C434.618 424.83 444.298 417.301 444.298 402.244V29.039C444.298 22.5859 443.223 12.3685 432.467 12.3685C393.749 11.8307 395.9 75.824 395.9 99.4854H383.531V0H543.783V99.4854H531.415C531.415 75.824 533.566 11.8307 494.847 12.3685C484.092 12.3685 483.017 22.5859 482.479 29.039V403.319C483.017 417.839 492.696 424.83 503.452 425.905Z" className="fill-black dark:fill-white"/>
    <path d="M607.331 12.3685V0H687.458V12.3685C676.702 13.9817 666.485 20.4348 666.485 36.0298V402.244C666.485 417.301 676.702 424.292 687.458 425.905V438.273H607.331V425.905C618.087 424.292 628.304 417.301 628.304 402.244V36.0298C628.304 20.4348 618.087 13.9817 607.331 12.3685Z" className="fill-black dark:fill-white"/>
    <path d="M826.695 438.273H747.107V425.905C757.862 424.83 767.542 417.839 768.079 403.319V36.0298C768.079 20.4348 758.4 13.444 747.107 12.3685V0H878.858V99.4854H866.489C866.489 75.824 867.565 16.6705 821.317 12.3685C811.1 11.2929 806.26 18.2838 806.26 29.039V210.264C806.26 212.415 807.873 212.952 808.949 212.952C833.148 211.877 849.281 205.962 853.583 175.847H863.8V261.889H853.583C849.281 232.312 833.686 226.396 809.487 225.321C808.411 225.321 806.26 225.859 806.26 228.01V402.244C806.26 417.301 815.94 424.83 826.695 425.905V438.273Z" className="fill-black dark:fill-white"/>
  </svg>
)

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/inventory': 'Inventory',
  '/admin/settings': 'Settings',
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggle } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // Skip auth check on the login page itself
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }
    const token = sessionStorage.getItem('batif_admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${token}`,
      },
    }).then(r => r.json()).then(data => {
      if (data.id) {
        setUser(data)
        setLoading(false)
      } else {
        sessionStorage.removeItem('batif_admin_token')
        router.push('/admin/login')
      }
    }).catch(() => {
      sessionStorage.removeItem('batif_admin_token')
      router.push('/admin/login')
    })
  }, [router, pathname])

  const handleLogout = () => {
    sessionStorage.removeItem('batif_admin_token')
    sessionStorage.removeItem('batif_admin_user')
    document.cookie = 'sb-access-token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const pageTitle = PAGE_TITLES[pathname] || 'Admin'

  const isLoginPage = pathname === '/admin/login'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black flex items-center justify-center">
        <div className="w-4 h-4 border border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  // Login page: render children directly without sidebar/topbar
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex w-56 flex-col bg-white dark:bg-[#0a0a0a] border-r border-black/8 dark:border-white/8 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-black/8 dark:border-white/8">
          <div className="flex items-center gap-2">
            <BATIF_LOGO />
            <span className="text-[9px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.15em]">Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="mb-5">
              <p className="text-[9px] font-medium text-black/25 dark:text-white/25 uppercase tracking-[0.15em] px-2 mb-1.5">{section.label}</p>
              {section.items.map(item => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] transition-colors mb-0.5 ${
                      active
                        ? 'bg-black dark:bg-white text-white dark:text-black font-medium'
                        : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {item.name}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-black/8 dark:border-white/8 p-3 space-y-1">
          <button
            onClick={toggle}
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white w-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {theme === 'dark'
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              }
            </svg>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] text-black/40 dark:text-white/40 hover:text-[#FF5131] w-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
          <div className="px-2.5 pt-1">
            <p className="text-[10px] text-black/20 dark:text-white/20 truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-white dark:bg-[#0a0a0a] border-r border-black/8 dark:border-white/8">
            <div className="h-14 flex items-center px-5 border-b border-black/8 dark:border-white/8">
              <div className="flex items-center gap-2">
                <BATIF_LOGO />
                <span className="text-[9px] font-medium text-black/30 dark:text-white/30 uppercase tracking-[0.15em]">Admin</span>
              </div>
            </div>
            <nav className="py-4 px-3">
              {NAV_SECTIONS.map(section => (
                <div key={section.label} className="mb-5">
                  <p className="text-[9px] font-medium text-black/25 dark:text-white/25 uppercase tracking-[0.15em] px-2 mb-1.5">{section.label}</p>
                  {section.items.map(item => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] transition-colors mb-0.5 ${
                          active
                            ? 'bg-black dark:bg-white text-white dark:text-black font-medium'
                            : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>
            <div className="border-t border-black/8 dark:border-white/8 p-3 space-y-1">
              <button onClick={toggle} className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] text-black/40 dark:text-white/40 w-full">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {theme === 'dark'
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  }
                </svg>
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] text-black/40 dark:text-white/40 hover:text-[#FF5131] w-full">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-black/8 dark:border-white/8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1 -ml-1 text-black/50 dark:text-white/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm font-semibold text-black dark:text-white">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors uppercase tracking-[0.08em]"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View Store
            </a>
            <div className="w-px h-4 bg-black/8 dark:border-white/8 hidden sm:block" />
            <span className="text-[11px] text-black/40 dark:text-white/40 hidden sm:block">{user?.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ThemeProvider>
  )
}
