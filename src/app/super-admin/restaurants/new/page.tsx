'use client'

import { useState } from 'react'
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
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { createAdminWithRestaurant } from '@/app/actions/super-admin'

export default function NewAdminRestaurantPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [generatedSlug, setGeneratedSlug] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
    let generated = ''
    for (let i = 0; i < 8; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    generated += '!'
    setPassword(generated)
  }

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
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Restoranlar ro&apos;yxatiga qaytish
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Yangi admin va restoran yaratish
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Yangi admin foydalanuvchi yarating va unga restoran biriktiring. Bir formada ikkalasi yaratiladi.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        {/* Admin Section */}
        <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900 mb-1">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            Admin ma&apos;lumotlari
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-stone-500 mb-1.5">
                To&apos;liq ism
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Abdullayev Jasur"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-stone-500 mb-1.5">
                Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="admin@restoran.uz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-stone-500">
                  Parol <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Tasodifiy parol generatsiya
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 font-mono placeholder:font-sans placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko?rsatish"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Section */}
        <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            Restoran ma&apos;lumotlari
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="restaurantName" className="block text-xs font-semibold text-stone-500 mb-1.5">
                Restoran nomi <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  required
                  placeholder="Rayhon Restoran"
                  onChange={(e) => setGeneratedSlug(generateSlug(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="slug" className="block text-xs font-semibold text-stone-500 mb-1.5">
                Havola (slug)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  placeholder={generatedSlug || 'avtomatik yaratiladi'}
                  defaultValue=""
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              {generatedSlug && (
                <p className="mt-1 text-xs text-stone-500">
                  Menyu havolasi: <code className="text-orange-600">/r/{generatedSlug}</code>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Manzil
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Toshkent sh., Amir Temur ko'chasi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Telefon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="currency" className="block text-xs font-semibold text-stone-500 mb-1.5">
                Valyuta
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <select
                  id="currency"
                  name="currency"
                  defaultValue="UZS"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="UZS">UZS — O&apos;zbek so&apos;mi</option>
                  <option value="USD">USD — AQSh dollari</option>
                  <option value="EUR">EUR — Yevro</option>
                  <option value="RUB">RUB — Rossiya rubli</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-orange-50 border border-orange-300/20 rounded-xl px-4 py-3 text-xs text-orange-700 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-orange-600 shrink-0" />
          <div>
            <strong>Yaratilgandan keyin:</strong> Admin yuqoridagi email va parol bilan tizimga kiradi va faqat o&apos;z restoranini boshqaradi. Avtomatik ravishda &quot;Asosiy menyu&quot; yaratiladi.
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-all shadow-sm shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
