'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Store,
  MapPin,
  Phone,
  Globe,
  Link2,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { createAdminWithRestaurant } from '@/app/actions/super-admin'

export default function NewAdminRestaurantPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [generatedSlug, setGeneratedSlug] = useState('')

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)

    try {
      const result = await createAdminWithRestaurant(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // On success, the action redirects
    } catch {
      setError('Kutilmagan xatolik yuz berdi.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/super-admin/restaurants"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Restoranlar ro'yxatiga qaytish
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Yangi admin va restoran yaratish
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Yangi admin foydalanuvchi yarating va unga restoran biriktiring. Bir formada ikkalasi yaratiladi.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        {/* Admin Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            Admin ma'lumotlari
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-400 mb-1.5">
                To'liq ism
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Abdullayev Jasur"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="admin@restoran.uz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Parol <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            Restoran ma'lumotlari
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="restaurantName" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Restoran nomi <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  required
                  placeholder="Rayhon Restoran"
                  onChange={(e) => setGeneratedSlug(generateSlug(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="slug" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Havola (slug)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  placeholder={generatedSlug || 'avtomatik yaratiladi'}
                  defaultValue=""
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              {generatedSlug && (
                <p className="mt-1 text-xs text-slate-500">
                  Menyu havolasi: <code className="text-violet-400">/r/{generatedSlug}</code>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Manzil
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Toshkent sh., Amir Temur ko'chasi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Telefon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="currency" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Valyuta
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  id="currency"
                  name="currency"
                  defaultValue="UZS"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="UZS">UZS — O'zbek so'mi</option>
                  <option value="USD">USD — AQSh dollari</option>
                  <option value="EUR">EUR — Yevro</option>
                  <option value="RUB">RUB — Rossiya rubli</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-xs text-violet-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
          <div>
            <strong>Yaratilgandan keyin:</strong> Admin yuqoridagi email va parol bilan tizimga kiradi va faqat o'z restoranini boshqaradi. Avtomatik ravishda "Asosiy menyu" yaratiladi.
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Yaratilmoqda...
            </>
          ) : (
            <>
              <User className="w-4 h-4" />
              Admin va restoranni yaratish
            </>
          )}
        </button>
      </form>
    </div>
  )
}
