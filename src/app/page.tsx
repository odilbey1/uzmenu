import Link from 'next/link'
import {
  UtensilsCrossed,
  Sparkles,
  QrCode,
  Smartphone,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe2,
  TrendingUp,
  Camera,
  Layers,
  ChefHat,
  Star,
  ShieldCheck,
  Coffee,
  Flame,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 selection:bg-orange-500 selection:text-white">
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-stone-900">
              QRMenu<span className="text-orange-600">.ai</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#how-it-works" className="hover:text-orange-600 transition-colors">
              Qanday ishlaydi?
            </a>
            <a href="#features" className="hover:text-orange-600 transition-colors">
              Imkoniyatlar
            </a>
            <Link href="/r/demo" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Menyu namunasi (Jonli)
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/r/demo"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-sm font-semibold transition-all border border-orange-200"
            >
              Menyuni ko‘rish
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-sm font-semibold transition-all shadow-sm shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5 cursor-pointer"
            >
              Admin panel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Warm Ambient Glow Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-orange-400/20 via-amber-300/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Feature Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold shadow-xs mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
              <span>Yangi: GPT-4o Vision orqali qog'oz menyuni o'qish</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.12]">
              Eski qog'oz menyuni{' '}
              <span className="gradient-orange-text">AI yordamida</span>{' '}
              interaktiv QR menyuga aylantiring
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Menyuning fotosuratini yuklang — sun'iy intellekt taomlar, narxlar va bo'limlarni bir zumda ajratib oladi. 
              Chiroyli, mobilga mos va cheksiz tahrirlanuvchi raqamli menyu.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/r/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-base transition-all shadow-md shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Jonli menyuni sinab ko‘rish
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold text-base transition-all shadow-xs"
              >
                Admin panelga kirish
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs font-medium text-stone-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Karta talab qilinmaydi
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                2 daqiqada tayyor
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                3 xil tilda
              </div>
            </div>
          </div>

          {/* Interactive UI Mockup Showcase (FineDine Style) */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-stone-200 to-stone-100 shadow-2xl border border-stone-200/80">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-inner overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Left: Interactive Menu Preview mockup */}
                  <div className="w-full lg:w-1/2 bg-stone-50 rounded-2xl p-4 sm:p-6 border border-stone-200/80">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                      <div>
                        <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                          Mijoz ko'rinishi
                        </div>
                        <h4 className="font-bold text-stone-900 text-base">Rayhon Restoran</h4>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs font-semibold">
                        <QrCode className="w-3.5 h-3.5" />
                        Stol #7
                      </div>
                    </div>

                    {/* Category tabs */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
                      <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-medium shrink-0">
                        Barchasi
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-600 text-xs font-medium shrink-0">
                        Issiq taomlar
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-600 text-xs font-medium shrink-0">
                        Ichimliklar
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-600 text-xs font-medium shrink-0">
                        Desertlar
                      </span>
                    </div>

                    {/* Dish cards mockup */}
                    <div className="mt-4 space-y-3">
                      <div className="p-3 rounded-xl bg-white border border-stone-200/70 shadow-2xs flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-900">To‘y Oshi (Choyxona)</span>
                            <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-semibold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> Top
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1">
                            Lazer guruch, mayin go'sht, qazi, noxot va kishmish
                          </p>
                          <div className="text-xs font-bold text-orange-600">45 000 UZS</div>
                        </div>
                        <div className="w-14 h-14 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                          🍲
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-stone-200/70 shadow-2xs flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-sm font-bold text-stone-900">Qozon Kabob (Qo'zichoq)</span>
                          <p className="text-[11px] text-stone-500 line-clamp-1">
                            Qovurilgan tillarang kartoshkalar va ziravorlar
                          </p>
                          <div className="text-xs font-bold text-orange-600">62 000 UZS</div>
                        </div>
                        <div className="w-14 h-14 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                          🍖
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI OCR Scan feature highlight */}
                  <div className="w-full lg:w-1/2 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs font-semibold">
                      <Camera className="w-4 h-4" />
                      1 daqiqali AI Migratsiya
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
                      Qo'lda yozishga vaqt sarflamang. Rasmni oling, qolganini AI hal qiladi.
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Restoraningizdagi mavjud qog'oz menyu varag'ini suratga olib tizimga yuklaysiz. 
                      Bizning ilg'or sun'iy intellektimiz taomlarning nomi, narxi, tavsifi va bo'limlarini 
                      100% aniqlik bilan raqamli bazaga o'tkazib beradi.
                    </p>

                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-amber-900">
                        <strong>Avtomatik tarjima:</strong> Menyuingiz darhol O‘zbek, Rus va Ingliz tillariga moslashishga tayyor holatda shakllanadi.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works" className="py-20 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Oddiy jarayon
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2 tracking-tight">
              3 ta qadamda raqamli menyuga ega bo'ling
            </h2>
            <p className="mt-3 text-stone-500 text-base">
              Hech qanday murakkab sozlamalarsiz o'z restoraningiz brendini yarating
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 relative group hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-sm shadow-orange-500/20">
                1
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                Menyu rasmini yuklang
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Eski menyuingiz fotosurati yoki PDF faylini bir zumda yuklang.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 relative group hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-sm shadow-orange-500/20">
                2
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                AI tahlili va tahrirlash
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Sun'iy intellekt taomlar va narxlarni ajratadi. Xohlagan narxingizni qulay boshqaruv panelida o'zgartiring.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 relative group hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-sm shadow-orange-500/20">
                3
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                QR kodni stollarga qo'ying
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Chop etishga tayyor sifatli QR kodni yuklab oling. Mijozlar o'z telefonlarida darhol menyuni ko'rishadi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Afzalliklar
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2 tracking-tight">
              Zamonaviy restoranlar nima uchun QRMenu'ni tanlaydi?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-base mb-1.5">Tezkor narx o'zgarishi</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Qayta chop etish uchun pul va vaqt sarflamang. Narxlar yoki taom mavjudligini 1 soniyada o'zgartiring.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-base mb-1.5">Ilova o'rnatish shart emas</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Mijoz kamerasi orqali QR kodni skaner qilganda brauzerda to'g'ridan-to'g'ri va chaqmoqdek tez ochiladi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-base mb-1.5">Ko'p tilli menyu</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Chet ellik sayyohlar va mehmonlar o'z tillarida taomlar tarkibi va narxlarini qiyinchiliksiz tushunishadi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-base mb-1.5">Skanerlash tahlili</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Har kuni qancha mijoz menyuni ochganini va qaysi taomlar eng ko'p ko'rilayotganini kuzatib boring.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-base mb-1.5">Ishonchli va xavfsiz</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Supabase Row Level Security orqali ma'lumotlaringiz to'liq himoyalangan va doimiy 99.9% uptime.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <ChefHat className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-base mb-1.5">Premium dizayn</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                FineDine uslubidagi zamonaviy interfeys restoraningiz obro'si va mijozlar tajribasini yangi bosqichga olib chiqadi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-xl shadow-orange-500/20">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Bugunoq restoraningizni raqamlashtiring
              </h2>
              <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
                Hech qanday to'lovsiz ro'yxatdan o'ting va birinchi AI QR menyuingizni hoziroq ishga tushiring.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-orange-600 font-bold text-base transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  Admin panelga kirish
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-stone-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
              Q
            </div>
            <span className="font-bold text-stone-900">QRMenu Platformasi</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} QRMenu. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  )
}
