import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Globe,
  Mail,
  User,
  Calendar,
  ExternalLink,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { deleteRestaurantAndAdmin } from '@/app/actions/super-admin'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Verify super admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') redirect('/dashboard')

  // Fetch restaurant with admin profile
  const adminSupabase = createAdminClient()
  const { data: restaurant } = await adminSupabase
    .from('restaurants')
    .select(`
      *,
      profiles:user_id (
        id,
        email,
        full_name,
        role,
        created_at
      ),
      menus (
        id,
        name,
        is_active,
        created_at
      )
    `)
    .eq('id', id)
    .single()

  if (!restaurant) {
    redirect('/super-admin/restaurants')
  }

  const adminProfile = restaurant.profiles as Record<string, unknown> | null
  const menus = restaurant.menus as Array<Record<string, unknown>> | undefined

  const restaurantId = id
  async function handleDelete() {
    'use server'
    await deleteRestaurantAndAdmin(restaurantId)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/super-admin/restaurants"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Restoranlar ro'yxati
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-violet-400 flex items-center justify-center font-bold text-xl border border-slate-700">
            {restaurant.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              restaurant.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {restaurant.name}
            </h1>
            <p className="text-sm text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              /r/{restaurant.slug}
            </p>
          </div>
        </div>

        <Link
          href={`/r/${restaurant.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Menyuni ko'rish
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Store className="w-4 h-4 text-violet-400" />
          Restoran ma'lumotlari
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-500">Nom</span>
            <div className="text-white font-medium">{restaurant.name}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Valyuta</span>
            <div className="text-white font-medium">{restaurant.currency}</div>
          </div>
          {restaurant.address && (
            <div>
              <span className="text-xs text-slate-500">Manzil</span>
              <div className="text-white font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {restaurant.address}
              </div>
            </div>
          )}
          {restaurant.phone && (
            <div>
              <span className="text-xs text-slate-500">Telefon</span>
              <div className="text-white font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {restaurant.phone}
              </div>
            </div>
          )}
          <div>
            <span className="text-xs text-slate-500">Yaratilgan sana</span>
            <div className="text-white font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {new Date(restaurant.created_at).toLocaleDateString('uz-UZ')}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      {adminProfile && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            Admin ma'lumotlari
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500">To'liq ism</span>
              <div className="text-white font-medium">
                {(adminProfile.full_name as string) || 'Kiritilmagan'}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Email</span>
              <div className="text-white font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {adminProfile.email as string}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Ro'yxatdan o'tgan</span>
              <div className="text-white font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {new Date(adminProfile.created_at as string).toLocaleDateString('uz-UZ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menus */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-amber-400" />
          Menyular ({menus?.length || 0} ta)
        </h2>

        {menus && menus.length > 0 ? (
          <div className="space-y-2">
            {menus.map((menu) => (
              <div
                key={menu.id as string}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${menu.is_active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span className="text-sm text-white font-medium">{menu.name as string}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {menu.is_active ? 'Faol' : 'Nofaol'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Menyu topilmadi.</p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-red-400 mb-2">Xavfli zona</h2>
        <p className="text-xs text-slate-500 mb-4">
          Bu restoranni o'chirsangiz, adminning hisobi ham birga o'chiriladi. Bu amalni qaytarib bo'lmaydi.
        </p>
        <form action={handleDelete}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Restoranni va adminni o'chirish
          </button>
        </form>
      </div>
    </div>
  )
}
