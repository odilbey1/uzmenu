import Link from 'next/link'
import {
  Store,
  Layers,
  UtensilsCrossed,
  QrCode,
  ExternalLink,
  ArrowRight,
  MapPin,
  Phone,
  Settings,
} from 'lucide-react'
import { getMyRestaurant } from '@/app/actions/menu'

export default async function DashboardPage() {
  const restaurant = await getMyRestaurant()

  if (!restaurant) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white p-8 sm:p-14 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-sm">
          <Store className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-900">
          Restoran topilmadi
        </h3>
        <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">
          Sizga restoran biriktirilmagan. Iltimos, super admin bilan bog'laning.
        </p>
      </div>
    )
  }

  const menus = (restaurant as Record<string, unknown>).menus as Array<Record<string, unknown>> | undefined
  const menuCount = menus?.length || 0
  const activeMenus = menus?.filter((m) => m.is_active)?.length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Bosh sahifa
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {restaurant.name} — admin boshqaruv paneli
          </p>
        </div>
        <Link
          href={`/r/${restaurant.slug}`}
          target="_blank"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-all shadow-sm shadow-orange-500/25 cursor-pointer self-start sm:self-auto"
        >
          <ExternalLink className="w-4 h-4" />
          Ommaviy menyuni ko'rish
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{menuCount}</div>
          <div className="text-xs text-stone-500 mt-0.5">Menyular</div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{activeMenus}</div>
          <div className="text-xs text-stone-500 mt-0.5">Faol menyular</div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{restaurant.currency}</div>
          <div className="text-xs text-stone-500 mt-0.5">Valyuta</div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <Store className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-stone-900 truncate text-lg">
            {restaurant.slug}
          </div>
          <div className="text-xs text-stone-500 mt-0.5">Havola</div>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-600" />
            Restoran ma'lumotlari
          </h2>
          <Link
            href="/dashboard/settings"
            className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Tahrirlash
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-stone-400 font-medium">Nom</span>
            <div className="text-stone-900 font-semibold mt-0.5">{restaurant.name}</div>
          </div>
          {restaurant.address && (
            <div>
              <span className="text-xs text-stone-400 font-medium">Manzil</span>
              <div className="text-stone-900 font-semibold mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {restaurant.address}
              </div>
            </div>
          )}
          {restaurant.phone && (
            <div>
              <span className="text-xs text-stone-400 font-medium">Telefon</span>
              <div className="text-stone-900 font-semibold mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {restaurant.phone}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/menu"
          className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            Menyuni boshqarish
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Kategoriya va taomlarni qo'shing, tahrirlang
          </p>
          <div className="mt-3 text-xs font-semibold text-orange-600 flex items-center gap-1">
            Ochish <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          href="/dashboard/qr"
          className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            QR kod
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            QR kodni yarating va yuklab oling
          </p>
          <div className="mt-3 text-xs font-semibold text-orange-600 flex items-center gap-1">
            Ochish <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          href="/dashboard/settings"
          className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            Sozlamalar
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Restoran ma'lumotlarini yangilang
          </p>
          <div className="mt-3 text-xs font-semibold text-orange-600 flex items-center gap-1">
            Ochish <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>
    </div>
  )
}
