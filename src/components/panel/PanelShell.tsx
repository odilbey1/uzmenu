import Link from 'next/link'
import { LogOut, UtensilsCrossed } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import PanelNavigation from './PanelNavigation'

type PanelShellProps = {
  variant: 'admin' | 'super-admin'
  title: string
  displayName: string
  email?: string
  children: React.ReactNode
}

export default function PanelShell({ variant, title, displayName, email, children }: PanelShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href={variant === 'admin' ? '/dashboard' : '/super-admin'} className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm">
              <UtensilsCrossed aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block max-w-40 truncate text-sm font-bold tracking-tight text-stone-900 sm:max-w-56">{title}</span>
              <span className="block text-xs text-stone-500">{variant === 'admin' ? 'Admin panel' : 'Super admin panel'}</span>
            </div>
          </Link>
          <div className="hidden lg:block"><PanelNavigation variant={variant} /></div>
          <div className="flex shrink-0 items-center gap-2 border-l border-stone-200 pl-3">
            <div className="hidden h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-orange-100 text-xs font-semibold text-orange-700 sm:flex">{displayName.charAt(0).toUpperCase()}</div>
            <div className="hidden xl:block">
              <div className="max-w-36 truncate text-xs font-semibold text-stone-900">{displayName}</div>
              <div className="max-w-36 truncate text-xs text-stone-500">{email}</div>
            </div>
            <form action={logout}>
              <button type="submit" aria-label="Hisobdan chiqish" title="Chiqish" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900">
                <LogOut aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-stone-100 px-4 sm:px-6 lg:hidden"><PanelNavigation variant={variant} /></div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <footer className="border-t border-stone-200 bg-white px-4 py-4 text-center text-xs text-stone-500">QRMenu &copy; {new Date().getFullYear()} — Raqamli QR menyu platformasi</footer>
    </div>
  )
}
