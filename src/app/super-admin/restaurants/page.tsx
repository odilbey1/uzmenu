import Link from 'next/link'
import {
  Store,
  Plus,
  MapPin,
  Phone,
  ArrowRight,
  Mail,
  User,
  Lock,
} from 'lucide-react'
import { getAllRestaurants } from '@/app/actions/super-admin'

export default async function RestaurantsListPage() {
  const restaurants = await getAllRestaurants()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Restoranlar
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Barcha restoranlar va ularning adminlari — jami {restaurants.length} ta
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

      {/* Restaurant List or Empty State */}
      {restaurants.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white p-8 sm:p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 text-stone-500 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            Hozircha hech qanday restoran yo&apos;q
          </h3>
          <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">
            Birinchi admin yarating va unga restoran biriktiring.
          </p>
          <div className="mt-6">
            <Link
              href="/super-admin/restaurants/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Birinchi restoranni yaratish
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {restaurants.map((restaurant: Record<string, unknown>) => {
            const profiles = restaurant.profiles as Record<string, unknown> | null
            const menus = restaurant.menus as Array<Record<string, unknown>> | undefined
            const menuCount = menus?.length || 0
            const activeMenus = menus?.filter((m) => m.is_active)?.length || 0

            return (
              <div
                key={restaurant.id as string}
                className="rounded-2xl bg-white border border-stone-200 hover:border-orange-300/40 p-6 flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Restaurant Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-50 text-orange-600 flex items-center justify-center font-bold text-lg border border-stone-200 group-hover:border-orange-300/50 transition-colors">
                      {restaurant.logo_url ? (
                        <img
                          src={restaurant.logo_url as string}
                          alt={restaurant.name as string}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        (restaurant.name as string).charAt(0).toUpperCase()
                      )}
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-50 text-stone-700 flex items-center gap-1.5 border border-stone-200">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeMenus > 0 ? 'bg-emerald-400' : 'bg-stone-400'}`} />
                      {activeMenus > 0 ? `${activeMenus} faol` : 'Nofaol'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-stone-900 group-hover:text-orange-700 transition-colors">
                    {restaurant.name as string}
                  </h3>

                  {/* Admin Info & Credentials */}
                  {profiles && (
                    <div className="mt-3 p-3 rounded-xl bg-stone-50/60 border border-stone-200/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-stone-700 font-medium truncate">
                          <User className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span className="truncate">
                            {(profiles.full_name as string) || 'Ism kiritilmagan'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-white/80 px-2.5 py-1.5 rounded-lg border border-stone-200">
                        <div className="flex items-center gap-1.5 text-stone-500 min-w-0">
                          <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                          <span className="text-stone-700 truncate font-mono">
                            {profiles.email as string}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-white/80 px-2.5 py-1.5 rounded-lg border border-stone-200">
                        <div className="flex items-center gap-1.5 text-stone-500 min-w-0">
                          <Lock className="w-3 h-3 text-amber-700 shrink-0" />
                          <span className="text-stone-500">Parol:</span>
                          <span className="text-emerald-700 font-semibold font-mono truncate">
                            {(profiles.plain_password as string) || '••••••••'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Restaurant Details */}
                  <div className="mt-3 space-y-1.5 text-xs text-stone-500">
                    {Boolean(restaurant.address) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{restaurant.address as string}</span>
                      </div>
                    )}
                    {Boolean(restaurant.phone) && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span>{restaurant.phone as string}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                    <span>Valyuta: <strong className="text-stone-700">{restaurant.currency as string}</strong></span>
                    <span>Menyular: <strong className="text-stone-700">{menuCount} ta</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-stone-200">
                  <Link
                    href={`/super-admin/restaurants/${restaurant.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-orange-600/20 hover:text-orange-700 text-stone-700 text-xs font-semibold transition-all border border-stone-200 hover:border-orange-300/40"
                  >
                    Batafsil ko&apos;rish
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
