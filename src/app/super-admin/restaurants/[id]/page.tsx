import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Globe,
  Calendar,
  ExternalLink,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react'
import { createAdminClient } from '@/utils/supabase/admin'
import { deleteRestaurantAndAdmin } from '@/app/actions/super-admin'
import AdminCredentialsCard from './AdminCredentialsCard'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { id } = await params
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

  // Fetch auth user metadata to retrieve password
  const { data: authUserData } = await adminSupabase.auth.admin.getUserById(restaurant.user_id)
  const adminPlainPassword = (authUserData?.user?.user_metadata?.plain_password as string) || ''

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
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Restoranlar ro&apos;yxati
      </Link>

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-stone-50 text-orange-600 flex items-center justify-center font-bold text-xl border border-stone-200">
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
            <h1 className="text-2xl break-words font-bold tracking-tight text-stone-900">
              {restaurant.name}
            </h1>
            <p className="text-sm text-stone-500 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              /r/{restaurant.slug}
            </p>
          </div>
        </div>

        <Link
          href={`/r/${restaurant.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Menyuni ko&apos;rish
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Store className="w-4 h-4 text-orange-600" />
          Restoran ma&apos;lumotlari
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-stone-500">Nom</span>
            <div className="text-stone-900 font-medium">{restaurant.name}</div>
          </div>
          <div>
            <span className="text-xs text-stone-500">Valyuta</span>
            <div className="text-stone-900 font-medium">{restaurant.currency}</div>
          </div>
          {restaurant.address && (
            <div>
              <span className="text-xs text-stone-500">Manzil</span>
              <div className="text-stone-900 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                {restaurant.address}
              </div>
            </div>
          )}
          {restaurant.phone && (
            <div>
              <span className="text-xs text-stone-500">Telefon</span>
              <div className="text-stone-900 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                {restaurant.phone}
              </div>
            </div>
          )}
          <div>
            <span className="text-xs text-stone-500">Yaratilgan sana</span>
            <div className="text-stone-900 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              {new Date(restaurant.created_at).toLocaleDateString('uz-UZ')}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Credentials & Info */}
      <AdminCredentialsCard
        adminUserId={restaurant.user_id}
        fullName={(adminProfile?.full_name as string) || ''}
        email={(adminProfile?.email as string) || (authUserData?.user?.email as string) || ''}
        initialPassword={adminPlainPassword}
        registeredAt={(adminProfile?.created_at as string) || restaurant.created_at}
        restaurantName={restaurant.name}
        restaurantSlug={restaurant.slug}
      />

      {/* Menus */}
      <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-amber-700" />
          Menyular ({menus?.length || 0} ta)
        </h2>

        {menus && menus.length > 0 ? (
          <div className="space-y-2">
            {menus.map((menu) => (
              <div
                key={menu.id as string}
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50/50 border border-stone-200/50"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${menu.is_active ? 'bg-emerald-400' : 'bg-stone-400'}`} />
                  <span className="text-sm text-stone-900 font-medium">{menu.name as string}</span>
                </div>
                <span className="text-xs text-stone-500">
                  {menu.is_active ? 'Faol' : 'Nofaol'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-500">Menyu topilmadi.</p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-red-600 mb-2">Xavfli zona</h2>
        <p className="text-xs text-stone-500 mb-4">
          Bu restoranni o&apos;chirsangiz, adminning hisobi ham birga o&apos;chiriladi. Bu amalni qaytarib bo&apos;lmaydi.
        </p>
        <form action={handleDelete}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-semibold border border-red-500/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Restoranni va adminni o&apos;chirish
          </button>
        </form>
      </div>
    </div>
  )
}
