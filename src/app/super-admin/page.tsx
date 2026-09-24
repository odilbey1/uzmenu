import Link from 'next/link'
import {
  Store,
  Users,
  UtensilsCrossed,
  Layers,
  QrCode,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { getDashboardStats, getAllRestaurants } from '@/app/actions/super-admin'

export default async function SuperAdminDashboard() {
  const [stats, restaurants] = await Promise.all([
    getDashboardStats(),
    getAllRestaurants(),
  ])
  const recentRestaurants = restaurants.slice(0, 5)

  const statCards = [
    {
      label: 'Jami restoranlar',
      value: stats.total_restaurants,
      icon: Store,
      color: 'from-violet-500 to-indigo-600',
      shadow: 'shadow-violet-500/20',
    },
    {
      label: 'Adminlar',
      value: stats.total_admins,
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
    },
    {
      label: 'Menyular',
      value: stats.total_menus,
      icon: UtensilsCrossed,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
    },
    {
      label: 'Taomlar',
      value: stats.total_items,
      icon: Layers,
      color: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/20',
    },
    {
      label: 'Kategoriyalar',
      value: stats.total_categories,
      icon: Layers,
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/20',
    },
    {
      label: 'QR skanerlashlar',
      value: stats.total_qr_scans,
      icon: QrCode,
      color: 'from-fuchsia-500 to-purple-600',
      shadow: 'shadow-fuchsia-500/20',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Bosh sahifa
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Platformadagi barcha restoranlar va statistika
          </p>
        </div>
        <Link
          href="/super-admin/restaurants/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-violet-500/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi admin + restoran
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-3 shadow-lg ${stat.shadow}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Restaurants */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <h2 className="font-bold text-white text-sm">
              So'nggi qo'shilgan restoranlar
            </h2>
          </div>
          <Link
            href="/super-admin/restaurants"
            className="text-xs font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            Barchasini ko'rish
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentRestaurants.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-600 flex items-center justify-center mx-auto mb-3">
              <Store className="w-7 h-7" />
            </div>
            <p className="text-sm text-slate-500">
              Hozircha hech qanday restoran qo'shilmagan.
            </p>
            <Link
              href="/super-admin/restaurants/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Birinchi restoranni yaratish
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {recentRestaurants.map((restaurant: Record<string, unknown>) => {
              const profiles = restaurant.profiles as Record<string, unknown> | null
              const menus = restaurant.menus as Array<Record<string, unknown>> | undefined

              return (
                <Link
                  key={restaurant.id as string}
                  href={`/super-admin/restaurants/${restaurant.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-violet-400 flex items-center justify-center font-bold text-sm border border-slate-700 group-hover:border-violet-500/50 transition-colors shrink-0">
                      {(restaurant.name as string).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-white truncate group-hover:text-violet-300 transition-colors">
                        {restaurant.name as string}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {profiles
                          ? `${(profiles.full_name as string) || (profiles.email as string)}`
                          : 'Admin topilmadi'}
                        {' · '}
                        {(menus?.length || 0)} ta menyu
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
