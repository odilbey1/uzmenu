'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Store,
  MapPin,
  Phone,
  Globe,
  ImagePlus,
  Loader2,
  Check,
  Save,
  ArrowLeft,
  UtensilsCrossed,
} from 'lucide-react'
import { updateMyRestaurant } from '@/app/actions/menu'
import type { Restaurant } from '@/types/database.types'

export default function SettingsForm({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(restaurant.logo_url)

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await updateMyRestaurant(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 600)
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Boshqaruv paneliga qaytish
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Sozlamalar
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Restoran ma'lumotlarini yangilang
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          Muvaffaqiyatli saqlandi!
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        {/* Logo */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-orange-600" />
            Restoran logosi
          </h2>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-stone-100 border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-8 h-8 text-stone-300" />
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium cursor-pointer transition-all">
                <ImagePlus className="w-4 h-4" />
                Logo tanlash
                <input
                  type="file"
                  name="logo"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-stone-400 mt-1.5">
                JPG, PNG, WebP · Max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-stone-900 mb-1 flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-600" />
            Asosiy ma'lumotlar
          </h2>

          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-stone-500 mb-1.5">
              Restoran nomi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={restaurant.name}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address" className="block text-xs font-semibold text-stone-500 mb-1.5">
                Manzil
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={restaurant.address || ''}
                  placeholder="Toshkent sh."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-stone-500 mb-1.5">
                Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  defaultValue={restaurant.phone || ''}
                  placeholder="+998 90 123 45 67"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="currency" className="block text-xs font-semibold text-stone-500 mb-1.5">
              Valyuta
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <select
                id="currency"
                name="currency"
                defaultValue={restaurant.currency}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="UZS">UZS — O'zbek so'mi</option>
                <option value="USD">USD — AQSh dollari</option>
                <option value="EUR">EUR — Yevro</option>
                <option value="RUB">RUB — Rossiya rubli</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/25 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saqlanmoqda va yo‘naltirilmoqda...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saqlandi! Bosh sahifaga o‘tilmoqda...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Saqlash va Bosh sahifaga o‘tish</span>
              </>
            )}
          </button>

          <Link
            href="/dashboard/menu"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-all cursor-pointer border border-stone-200/80"
          >
            <UtensilsCrossed className="w-4 h-4 text-orange-600" />
            <span>Menyuni boshqarish →</span>
          </Link>
        </div>
      </form>
    </div>
  )
}
