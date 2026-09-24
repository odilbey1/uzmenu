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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-violet-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Admin ma'lumotlari & Kirish kalitlari
            </h2>
            <p className="text-xs text-slate-400">
              Ushbu restoran adminining login va maxfiy paroli
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => copyToClipboard(fullCredentialsText, 'all')}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          {copiedType === 'all' ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Nusxalandi! (Mijozga jo'nating)</span>
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
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{updateSuccess}</span>
        </div>
      )}

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            To'liq ism
          </span>
          <div className="text-white font-medium text-sm pt-0.5">
            {fullName || 'Kiritilmagan'}
          </div>
        </div>

        {/* Registered At */}
        <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Ro'yxatdan o'tgan sana
          </span>
          <div className="text-white font-medium text-sm pt-0.5">
            {registeredAt ? new Date(registeredAt).toLocaleDateString('uz-UZ') : 'Noma\'lum'}
          </div>
        </div>

        {/* Email / Login */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              Login (Email)
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(email, 'email')}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedType === 'email' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Nusxalandi</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Nusxa olish</span>
                </>
              )}
            </button>
          </div>
          <div className="text-white font-mono text-sm bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 truncate select-all">
            {email}
          </div>
        </div>

        {/* Password */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Parol
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Yashirish</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ko'rsatish</span>
                  </>
                )}
              </button>

              {password && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(password, 'password')}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedType === 'password' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Nusxalandi</span>
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

          <div className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
            <span className="font-mono text-sm text-emerald-400 font-semibold select-all">
              {password ? (showPassword ? password : '••••••••••••') : '(parol saqlanmagan)'}
            </span>

            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing)
                setUpdateError(null)
              }}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium ml-2 cursor-pointer transition-colors"
            >
              {isEditing ? 'Bekor qilish' : 'O\'zgartirish'}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Panel */}
      {isEditing && (
        <div className="bg-slate-950/70 border border-violet-500/30 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Yangi parol o'rnatish
            </h3>
            <button
              type="button"
              onClick={generateRandomPassword}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Tasodifiy parol generatsiya
            </button>
          </div>

          {updateError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{updateError}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yangi parolni kiriting (kamida 6 ta belgi)"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-600 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveNewPassword}
              disabled={isUpdating || !newPassword}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
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
