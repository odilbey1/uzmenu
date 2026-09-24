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
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Adminlar',
      value: stats.total_admins,
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Menyular',
      value: stats.total_menus,
      icon: UtensilsCrossed,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Taomlar',
      value: stats.total_items,
      icon: Layers,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Kategoriyalar',
      value: stats.total_categories,
      icon: Layers,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'QR skanerlashlar',
      value: stats.total_qr_scans,
      icon: QrCode,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Bosh sahifa
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Platformadagi barcha restoranlar va statistika
          </p>
        </div>
        <Link
          href="/super-admin/restaurants/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-all shadow-sm shadow-orange-500/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi admin + restoran
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-5 hover:border-stone-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500 mt-0.5 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Restaurants */}
      <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <h2 className="font-bold text-stone-900 text-sm">
              So&apos;nggi qo&apos;shilgan restoranlar
            </h2>
          </div>
          <Link
            href="/super-admin/restaurants"
            className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
          >
            Barchasini ko&apos;rish
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentRestaurants.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-500 flex items-center justify-center mx-auto mb-3">
              <Store className="w-7 h-7" />
            </div>
            <p className="text-sm text-stone-500">
              Hozircha hech qanday restoran qo&apos;shilmagan.
            </p>
            <Link
              href="/super-admin/restaurants/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Birinchi restoranni yaratish
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {recentRestaurants.map((restaurant: Record<string, unknown>) => {
              const profiles = restaurant.profiles as Record<string, unknown> | null
              const menus = restaurant.menus as Array<Record<string, unknown>> | undefined

              return (
                <Link
                  key={restaurant.id as string}
                  href={`/super-admin/restaurants/${restaurant.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50/50 transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 text-orange-600 flex items-center justify-center font-bold text-sm border border-stone-200 group-hover:border-orange-300/50 transition-colors shrink-0">
                      {(restaurant.name as string).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-stone-900 truncate group-hover:text-orange-700 transition-colors">
                        {restaurant.name as string}
                      </div>
                      <div className="text-xs text-stone-500 truncate">
                        {profiles
                          ? `${(profiles.full_name as string) || (profiles.email as string)}`
                          : 'Admin topilmadi'}
                        {' · '}
                        {(menus?.length || 0)} ta menyu
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-orange-600 transition-colors shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
