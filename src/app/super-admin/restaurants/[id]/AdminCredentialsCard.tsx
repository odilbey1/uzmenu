'use client'

import { useState } from 'react'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  KeyRound,
  RefreshCw,
  Send,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { updateAdminPassword } from '@/app/actions/super-admin'

interface AdminCredentialsCardProps {
  adminUserId: string
  fullName: string
  email: string
  initialPassword: string
  registeredAt: string
  restaurantName: string
  restaurantSlug: string
}

export default function AdminCredentialsCard({
  adminUserId,
  fullName,
  email,
  initialPassword,
  registeredAt,
  restaurantName,
  restaurantSlug,
}: AdminCredentialsCardProps) {
  const [password, setPassword] = useState(initialPassword || '')
  const [showPassword, setShowPassword] = useState(false)
  const [copiedType, setCopiedType] = useState<'email' | 'password' | 'all' | null>(null)

  // Password edit state
  const [isEditing, setIsEditing] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)

  function copyToClipboard(text: string, type: 'email' | 'password' | 'all') {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => {
      setCopiedType(null)
    }, 2500)
  }

  function generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
    let generated = ''
    for (let i = 0; i < 8; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    generated += '!'
    setNewPassword(generated)
  }

  async function handleSaveNewPassword() {
    if (!newPassword || newPassword.length < 6) {
      setUpdateError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak.')
      return
    }

    setUpdateError(null)
    setIsUpdating(true)

    try {
      const res = await updateAdminPassword(adminUserId, newPassword)
      if (res?.error) {
        setUpdateError(res.error)
      } else {
        setPassword(newPassword)
        setUpdateSuccess('Parol muvaffaqiyatli yangilandi!')
        setIsEditing(false)
        setNewPassword('')
        setTimeout(() => setUpdateSuccess(null), 3500)
      }
    } catch {
      setUpdateError('Kutilmagan xatolik yuz berdi.')
    } finally {
      setIsUpdating(false)
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uzmenu.vercel.app'
  const fullCredentialsText = `🍽 Restoran: ${restaurantName}
🌐 Menyu havolasi: ${origin}/r/${restaurantSlug}
🔐 Admin panel: ${origin}/login
👤 Login: ${email}
🔑 Parol: ${password || '(parol o\'rnatilmagan)'}`

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-6 space-y-6 relative overflow-hidden">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              Admin ma&apos;lumotlari & Kirish kalitlari
            </h2>
            <p className="text-xs text-stone-500">
              Ushbu restoran adminining login va maxfiy paroli
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => copyToClipboard(fullCredentialsText, 'all')}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-700 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          {copiedType === 'all' ? (
            <>
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Nusxalandi! (Mijozga jo&apos;nating)</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Login & Parolni nusxalash</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {updateSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{updateSuccess}</span>
        </div>
      )}

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="bg-stone-50/40 border border-stone-200 p-4 rounded-xl space-y-1">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-500" />
            To&apos;liq ism
          </span>
          <div className="text-stone-900 font-medium text-sm pt-0.5">
            {fullName || 'Kiritilmagan'}
          </div>
        </div>

        {/* Registered At */}
        <div className="bg-stone-50/40 border border-stone-200 p-4 rounded-xl space-y-1">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            Ro&apos;yxatdan o&apos;tgan sana
          </span>
          <div className="text-stone-900 font-medium text-sm pt-0.5">
            {registeredAt ? new Date(registeredAt).toLocaleDateString('uz-UZ') : 'Noma\'lum'}
          </div>
        </div>

        {/* Email / Login */}
        <div className="bg-stone-50/60 border border-stone-200/60 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-orange-600" />
              Login (Email)
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(email, 'email')}
              className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedType === 'email' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span className="text-emerald-700">Nusxalandi</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Nusxa olish</span>
                </>
              )}
            </button>
          </div>
          <div className="text-stone-900 font-mono text-sm bg-white/80 px-3 py-2 rounded-lg border border-stone-200 truncate select-all">
            {email}
          </div>
        </div>

        {/* Password */}
        <div className="bg-stone-50/60 border border-stone-200/60 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              Parol
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Yashirish</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ko&apos;rsatish</span>
                  </>
                )}
              </button>

              {password && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(password, 'password')}
                  className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedType === 'password' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span className="text-emerald-700">Nusxalandi</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Nusxa olish</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/80 px-3 py-2 rounded-lg border border-stone-200">
            <span className="font-mono text-sm text-emerald-700 font-semibold select-all">
              {password ? (showPassword ? password : '••••••••••••') : '(parol saqlanmagan)'}
            </span>

            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing)
                setUpdateError(null)
              }}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium ml-2 cursor-pointer transition-colors"
            >
              {isEditing ? 'Bekor qilish' : 'O\'zgartirish'}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Panel */}
      {isEditing && (
        <div className="bg-stone-50/70 border border-orange-300/30 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Yangi parol o&apos;rnatish
            </h3>
            <button
              type="button"
              onClick={generateRandomPassword}
              className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Tasodifiy parol generatsiya
            </button>
          </div>

          {updateError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{updateError}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-label="Yangi parol"
                placeholder="Yangi parolni kiriting (kamida 6 ta belgi)"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-stone-200 text-sm text-stone-900 placeholder:text-stone-500 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveNewPassword}
              disabled={isUpdating || !newPassword}
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Yangi parolni saqlash</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
