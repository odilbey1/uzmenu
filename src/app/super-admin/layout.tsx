import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Shield,
  LayoutDashboard,
  Store,
  UserPlus,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/actions/auth'
import { Profile } from '@/types/database.types'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  let user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null = null

  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {}

  const displayName = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'Super Admin'
  const displayEmail = user?.email || 'admin@uzmenu.uz'

  const navItems = [
    { href: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/super-admin/restaurants', label: 'Restoranlar', icon: Store },
    { href: '/super-admin/restaurants/new', label: 'Yangi admin', icon: UserPlus },
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight">QRMenu</span>
            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 uppercase tracking-wider">
              Super Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
            >
              <item.icon className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
              {item.label}
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-600" />
            </Link>
          ))}
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-violet-500/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {displayName}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {displayEmail}
              </div>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Chiqish
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white">Super Admin</span>
        </div>
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </Link>
          ))}
          <form action={logout}>
            <button
              type="submit"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all cursor-pointer"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
