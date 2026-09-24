'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UtensilsCrossed, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function fillSuperAdmin() {
    setEmail('admin@uzmenu.uz')
    setPassword('Admin123456!')
  }

  function fillRestaurantAdmin() {
    setEmail('test@gmail.com')
    setPassword('test1password')
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)

    try {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // On success, the action redirects based on role
    } catch {
      setError('Kutilmagan xatolik yuz berdi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4ef] flex flex-col items-center justify-center p-4 overflow-x-clip">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-stone-900">
            QRMenu<span className="text-orange-600">.ai</span>
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/20 p-6 sm:p-9">
          <div className="text-center mb-6">
            <h1 className="text-3xl tracking-tight font-semibold text-stone-900">Tizimga kirish</h1>
            <p className="text-sm text-stone-500 mt-1">
              Admin paneliga kirish uchun ma’lumotlaringizni kiriting
            </p>
          </div>

          {/* Quick Helper Boxes */}
          <div className="mb-5 space-y-2.5">
            {/* Super Admin */}
            <div className="p-3 bg-violet-50/80 border border-violet-200/80 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
                  👑 Super Admin:
                </span>
                <button
                  type="button"
                  onClick={fillSuperAdmin}
                  className="text-[11px] font-bold text-violet-700 bg-violet-100 hover:bg-violet-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                >
                  1-bosishda to‘ldirish ⚡
                </button>
              </div>
              <div className="mt-1 text-[11px] text-violet-700 font-mono flex items-center justify-between">
                <span>admin@uzmenu.uz</span>
                <span>Admin123456!</span>
              </div>
            </div>

            {/* Restaurant Admin */}
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  🍽 Restoran Admini (test 1):
                </span>
                <button
                  type="button"
                  onClick={fillRestaurantAdmin}
                  className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                >
                  1-bosishda to‘ldirish ⚡
                </button>
              </div>
              <div className="mt-1 text-[11px] text-amber-800 font-mono flex items-center justify-between">
                <span>test@gmail.com</span>
                <span>test1password</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-stone-500 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  autoComplete="username"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@restoran.uz"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-stone-500 mb-1.5">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white font-mono"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kirilmoqda...
                </>
              ) : (
                <>
                  Kirish
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 mt-6">
          Kirish ma’lumotlaringiz yo‘qmi? Super admin bilan bog‘laning.
        </p>
      </div>
    </div>
  )
}
