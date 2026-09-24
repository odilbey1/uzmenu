import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  UtensilsCrossed,
  LogOut,
  LayoutDashboard,
  Layers,
  Settings,
  QrCode,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/actions/auth'
import { Profile } from '@/types/database.types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null

  // Super admin should go to their panel
  if (profile?.role === 'super_admin') {
    redirect('/super-admin')
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Foydalanuvchi'

  // Get admin's restaurant name
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, slug')
    .eq('user_id', user.id)
    .single()

  const restaurantName = restaurant?.name || 'Restoran'

  const navItems = [
    { href: '/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
    { href: '/dashboard/menu', label: 'Menyu', icon: Layers },
    { href: '/dashboard/qr', label: 'QR kod', icon: QrCode },
    { href: '/dashboard/settings', label: 'Sozlamalar', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm shadow-orange-500/30">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sm text-stone-900 tracking-tight block leading-tight">
                  {restaurantName}
                </span>
                <span className="text-[10px] text-stone-400 leading-tight">
                  Admin panel
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:text-orange-600 hover:bg-orange-50 flex items-center gap-2 transition-all"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* User info & Sign out */}
            <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 text-orange-700 flex items-center justify-center font-semibold text-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-stone-900 truncate max-w-[140px]">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate max-w-[140px]">
                    {user.email}
                  </div>
                </div>
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  title="Chiqish"
                  className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-stone-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-all whitespace-nowrap"
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-400">
        QRMenu &copy; {new Date().getFullYear()} — Raqamli QR menyu platformasi
      </footer>
    </div>
  )
}
