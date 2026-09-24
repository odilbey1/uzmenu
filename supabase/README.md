# Supabase Sozlamalari va Migratsiyalar (QRMenu)

Ushbu papkada QRMenu SaaS loyihasining PostgreSQL ma'lumotlar bazasi sxemasi va xavfsizlik (RLS) siyosatlari joylashgan.

## 1. Migratsiyani ishga tushirish (Run SQL)

1. [Supabase Dashboard](https://supabase.com/dashboard) ga kiring va o'z loyihangizni tanlang.
2. Chap paneldan **SQL Editor** bo'limiga o'ting.
3. Yangi so'rov oching (**New query**) va [`001_initial_schema.sql`](file:///c:/Users/user/Desktop/UZ%20MENU%201/supabase/migrations/001_initial_schema.sql) faylining to'liq tarkibini nusxalab, u yerga joylashtiring (paste).
4. **Run** tugmasini bosing.

## 2. Yaratilgan Jadvallar:

1. **`profiles`** — Foydalanuvchi ma'lumotlari (`auth.users` bilan sinxronlangan trigger orqali avtomatik to'ldiriladi).
2. **`restaurants`** — Restoranlar (nomi, slug, logotip, manzil, telefon, valyuta, tillar).
3. **`menus`** — Restoranga tegishli menyular (`is_active` holati bilan).
4. **`categories`** — Menyuning kategoriyalari (masalan: Ichimliklar, Issiq taomlar, Salatlar).
5. **`items`** — Taomlar va mahsulotlar (nomi, tavsifi, narxi, rasmi, mavjudligi).
6. **`qr_codes`** — Menyularning QR kodlari va skanerlashlar soni (`scans_count`).

## 3. Row Level Security (RLS) Qoidalari:

- **Restoran egalari:** Faqat o'zlari yaratgan restoranlar, menyular, kategoriyalar, taomlar va QR kodlarni to'liq boshqara (ko'rish, qo'shish, o'chirish, tahrirlash) oladi.
- **Mijozlar (Public / Mehmonlar):** Faol menyular (`is_active = true`) va ulardagi taomlarni erkin ko'ra oladi, lekin o'zgartira olmaydi.
- **QR Skanerlash:** `increment_qr_scan(p_qr_id)` xavfsiz RPC funksiyasi orqali anonim tashrif buyuruvchilar ham scan sonini 1 taga oshira oladi.
