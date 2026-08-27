'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeProvider, useTheme } from '@/lib/theme-context'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { name: 'Products', href: '/admin/products', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { name: 'Orders', href: '/admin/orders', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
  { name: 'Inventory', href: '/admin/inventory', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { name: 'Settings', href: '/admin/settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
]

const BatifLogo = () => (
  <svg width="80" height="22" viewBox="0 0 879 439" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
    <path d="M79.0506 438.273H0V425.905C10.7552 424.292 20.9726 417.301 20.9726 402.244V36.0298C20.9726 20.4348 11.2929 12.9062 0 12.3685V0H79.0506C117.231 0 139.817 14.5195 139.817 47.3228V149.497C139.817 171.545 129.062 185.527 110.778 191.98C129.062 200.046 139.817 216.179 139.817 238.227V390.951C139.817 423.754 117.231 438.273 79.0506 438.273ZM59.1535 203.273V411.386C59.1535 418.914 60.229 426.443 72.5975 425.905H77.4373C91.9568 425.905 99.4854 412.999 99.4854 402.244V221.557C99.4854 210.801 91.9568 198.971 77.4373 198.971H63.4555C63.4555 198.971 59.1535 198.971 59.1535 203.273ZM59.1535 26.8879V182.3C59.1535 186.065 63.4555 186.602 63.4555 186.602H77.4373C91.9568 186.602 99.4854 173.696 99.4854 162.941V33.8788C99.4854 23.1236 91.9568 12.3685 77.4373 12.3685H72.5975C60.229 11.8307 59.1535 18.8215 59.1535 26.8879Z" className="fill-black dark:fill-white"/>
    <path d="M250.869 425.905V438.273H193.866V425.905C207.31 422.678 216.452 416.763 218.603 401.706L254.633 30.1145C254.633 20.4348 249.255 14.5195 240.114 12.3685V0H300.343L339.599 401.706C341.212 415.688 348.203 422.678 361.647 425.905V438.273H286.361V425.905C298.729 422.678 303.031 415.15 300.88 401.706L289.05 279.635C289.05 279.635 289.05 275.87 284.21 275.87H247.104C242.802 275.87 242.802 279.097 242.802 279.097L230.972 401.706C228.821 418.376 237.962 424.83 250.869 425.905ZM244.953 259.738C244.953 259.738 244.416 263.502 248.18 263.502H283.134C287.436 263.502 287.436 259.2 287.436 259.2L267.539 58.6157C267.001 57.5402 264.85 57.5402 264.313 58.6157L244.953 259.738Z" className="fill-black dark:fill-white"/>
    <path d="M503.452 425.905V438.273H423.863V425.905C434.618 424.83 444.298 417.301 444.298 402.244V29.039C444.298 22.5859 443.223 12.3685 432.467 12.3685C393.749 11.8307 395.9 75.824 395.9 99.4854H383.531V0H543.783V99.4854H531.415C531.415 75.824 533.566 11.8307 494.847 12.3685C484.092 12.3685 483.017 22.5859 482.479 29.039V403.319C483.017 417.839 492.696 424.83 503.452 425.905Z" className="fill-black dark:fill-white"/>
    <path d="M607.331 12.3685V0H687.458V12.3685C676.702 13.9817 666.485 20.4348 666.485 36.0298V402.244C666.485 417.301 676.702 424.292 687.458 425.905V438.273H607.331V425.905C618.087 424.292 628.304 417.301 628.304 402.244V36.0298C628.304 20.4348 618.087 13.9817 607.331 12.3685Z" className="fill-black dark:fill-white"/>
    <path d="M826.695 438.273H747.107V425.905C757.862 424.83 767.542 417.839 768.079 403.319V36.0298C768.079 20.4348 758.4 13.444 747.107 12.3685V0H878.858V99.4854H866.489C866.489 75.824 867.565 16.6705 821.317 12.3685C811.1 11.2929 806.26 18.2838 806.26 29.039V210.264C806.26 212.415 807.873 212.952 808.949 212.952C833.148 211.877 849.281 205.962 853.583 175.847H863.8V261.889H853.583C849.281 232.312 833.686 226.396 809.487 225.321C808.411 225.321 806.26 225.859 806.26 228.01V402.244C806.26 417.301 815.94 424.83 826.695 425.905V438.273Z" className="fill-black dark:fill-white"/>
  </svg>
)

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return }
    const storedUser = sessionStorage.getItem('batif_admin_user')
    const storedToken = sessionStorage.getItem('batif_admin_token')
    if (!storedUser || !storedToken) { router.push('/admin/login'); return }
    try { setUser(JSON.parse(storedUser)); } catch { router.push('/admin/login'); return }
    setLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    sessionStorage.removeItem('batif_admin_user')
    sessionStorage.removeItem('batif_admin_token')
    document.cookie = 'sb-access-token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Mobile header */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <BatifLogo />
        <button onClick={toggle} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          {theme === 'dark' ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl">
            <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggle} />
          </div>
        </div>
      )}

      {/* Desktop layout */}
      <div className="hidden lg:flex lg:min-h-screen">
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col sticky top-0 h-screen">
          <SidebarContent pathname={pathname} user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggle} />
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile content */}
      <div className="lg:hidden p-4">
        {children}
      </div>
    </div>
  )
}

function SidebarContent({ pathname, onClose, user, onLogout, theme, toggleTheme }: {
  pathname: string; onClose?: () => void; user: any; onLogout: () => void; theme: string; toggleTheme: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <BatifLogo />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#FF5131] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {/* User info */}
        <div className="px-3 py-2">
          <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
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
