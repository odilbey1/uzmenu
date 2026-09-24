'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Layers, Settings, QrCode, Store, UserPlus } from 'lucide-react'

export default function PanelNavigation({ variant }: { variant: 'admin' | 'super-admin' }) {
  const pathname = usePathname()
  const items = variant === 'admin' ? [
    { href: '/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
    { href: '/dashboard/menu', label: 'Menyu', icon: Layers },
    { href: '/dashboard/qr', label: 'QR kod', icon: QrCode },
    { href: '/dashboard/settings', label: 'Sozlamalar', icon: Settings },
  ] : [
    { href: '/super-admin', label: 'Bosh sahifa', icon: LayoutDashboard },
    { href: '/super-admin/restaurants', label: 'Restoranlar', icon: Store },
    { href: '/super-admin/restaurants/new', label: 'Yangi admin', icon: UserPlus },
  ]
  const activeHref = items.filter(item => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav aria-label="Panel bo‘limlari" className="flex items-center gap-1 overflow-x-auto py-1">
      {items.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} aria-current={activeHref === href ? 'page' : undefined}
          className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors sm:text-sm ${activeHref === href ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`}>
          <Icon aria-hidden="true" className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
