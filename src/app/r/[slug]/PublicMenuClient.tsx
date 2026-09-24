'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Flame,
  Star,
  Sparkles,
  Users,
  Smile,
  Soup,
  ChevronRight,
  UtensilsCrossed,
  Globe,
} from 'lucide-react'
import { VISUAL_CATEGORIES, VisualCategory, MenuItem } from './menuData'

export interface PublicRestaurantData {
  id: string
  name: string
  slug: string
  logo_url?: string | null
  address?: string | null
  phone?: string | null
  currency: string
  categories?: Array<{
    id: string
    name: string
    sort_order?: number
    items: MenuItem[]
  }>
}

export default function PublicMenuClient({
  restaurant,
}: {
  restaurant: PublicRestaurantData
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  const currencySymbol = restaurant.currency === 'UZS' ? "so'm" : restaurant.currency

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ` ${currencySymbol}`
  }

  // Active category object
  const activeCategory = useMemo(() => {
    if (!activeCategoryId) return null
    return VISUAL_CATEGORIES.find((c) => c.id === activeCategoryId) || null
  }, [activeCategoryId])

  // Search results across all categories
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    const results: { categoryName: string; item: MenuItem }[] = []

    VISUAL_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        if (
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        ) {
          results.push({ categoryName: cat.name.replace('\n', ' '), item })
        }
      })
    })

    return results
  }, [searchQuery])

  const handleCardClick = (cat: VisualCategory) => {
    if (cat.id === 'about-us') {
      setIsAboutModalOpen(true)
      return
    }
    setActiveCategoryId(cat.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-orange-500 selection:text-white pb-20 font-sans">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-neutral-800/80">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          {activeCategory ? (
            <button
              onClick={() => setActiveCategoryId(null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-orange-500" />
              <span>Kategoriyalar</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-orange-600/30">
                {restaurant.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                    {restaurant.name}
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                    Ochiq
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate max-w-[200px] sm:max-w-md">
                  {restaurant.address || 'Toshkent sh., Chilonzor 9-mavze'}
                </p>
              </div>
            </div>
          )}

          {/* Quick contact button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Biz haqimizda</span>
            </button>
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Qo‘ng‘iroq</span>
              </a>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Taom, lavash, burger yoki ichimlik qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-900/90 border border-neutral-800 focus:border-orange-500 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        {/* If Searching, show search results */}
        {searchQuery.trim() ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-neutral-200">
                Qidiruv natijalari: «{searchQuery}»
              </h2>
              <span className="text-xs text-neutral-500">
                {searchResults.length} ta topildi
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900/60 rounded-3xl border border-neutral-800/80 p-8">
                <Search className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-300 font-semibold">Hech qanday taom topilmadi</p>
                <p className="text-xs text-neutral-500 mt-1">Boshqa so‘z bilan qidirib ko‘ring</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.map(({ categoryName, item }) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemForModal(item)}
                    className="group bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 flex gap-3.5 hover:border-orange-500/50 transition-all cursor-pointer shadow-lg"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0 relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🍲</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block truncate">
                          {categoryName}
                        </span>
                        <h3 className="font-bold text-sm text-white leading-snug truncate mt-0.5">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 text-sm font-extrabold text-orange-500">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeCategory ? (
          /* =========================================================================
             A. CATEGORY DISHES VIEW (When user clicks into a category)
             ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Category Hero Banner */}
            <div className="relative h-44 sm:h-56 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
              <img
                src={activeCategory.image}
                alt={activeCategory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                {activeCategory.badge && (
                  <span className="inline-block mb-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-orange-600 text-white uppercase tracking-wider shadow">
                    {activeCategory.badge.icon} {activeCategory.badge.text}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeCategory.name.replace('\n', ' ')}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {activeCategory.items.length} xil saralangan taomlar va takliflar
                </p>
              </div>
            </div>

            {/* Quick Category Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {VISUAL_CATEGORIES.filter((c) => c.id !== 'about-us').map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategoryId(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryId === c.id
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {c.name.replace('\n', ' ')}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {activeCategory.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemForModal(item)}
                  className="group bg-neutral-900/90 border border-neutral-800 rounded-3xl p-3.5 flex gap-3.5 hover:border-neutral-700 hover:bg-neutral-900 transition-all cursor-pointer shadow-lg relative"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-800 shrink-0 relative">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🍲</div>
                    )}
                    {item.is_popular && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-black flex items-center gap-0.5 shadow">
                        <Flame className="w-2.5 h-2.5 fill-black" />
                        Hit
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-orange-400 transition-colors leading-snug">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between pt-1">
                      <span className="font-extrabold text-orange-500 text-base sm:text-lg">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-white transition-colors">
                        Batafsil →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* =========================================================================
             B. EXACT 24-CARD VISUAL GRID (PIXEL-PERFECT MATCH TO SCREENSHOT)
             ========================================================================= */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in duration-200">
            {VISUAL_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat)}
                className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800/90 bg-neutral-900 group cursor-pointer shadow-xl hover:border-neutral-600 hover:shadow-2xl transition-all duration-300 select-none"
              >
                {/* Background Food Photo */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Vignette Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />

                {/* Top Badges */}
                {cat.badge && (
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                    {cat.badge.type === 'top' && (
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-md uppercase tracking-wider">
                        <Flame className="w-3 h-3 fill-white" />
                        TOP
                      </span>
                    )}
                    {cat.badge.type === 'chef' && (
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-neutral-700 text-amber-300 font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-md uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        CHEF
                      </span>
                    )}
                    {cat.badge.type === 'aksiya' && (
                      <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-md uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 fill-white" />
                        AKSIYA
                      </span>
                    )}
                    {cat.badge.type === 'yangi' && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-md uppercase tracking-wider">
                        🌱 YANGI
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom Content Area */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex items-end justify-between gap-2 z-10">
                  <div className="min-w-0 flex-1">
                    {/* Optional Special Icons */}
                    {cat.iconType === 'child' && (
                      <div className="mb-1 text-amber-400">
                        <Smile className="w-5 h-5" />
                      </div>
                    )}
                    {cat.iconType === 'family' && (
                      <div className="mb-1 text-amber-400">
                        <Users className="w-5 h-5" />
                      </div>
                    )}
                    {cat.iconType === 'sauce' && (
                      <div className="mb-1 text-orange-400">
                        <Soup className="w-5 h-5" />
                      </div>
                    )}
                    {cat.iconType === 'about' && (
                      <div className="mb-1 text-white">
                        <MapPin className="w-5 h-5 text-orange-500 fill-orange-500" />
                      </div>
                    )}

                    <h3 className="text-white font-extrabold text-sm sm:text-base leading-tight drop-shadow-md whitespace-pre-line">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Circular Arrow Button (->) */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-black transition-all shadow-md">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 3. DISH DETAIL MODAL */}
      {selectedItemForModal && (
        <div
          onClick={() => setSelectedItemForModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121215] border border-neutral-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col"
          >
            <div className="relative h-64 bg-neutral-900 shrink-0">
              {selectedItemForModal.image_url ? (
                <img
                  src={selectedItemForModal.image_url}
                  alt={selectedItemForModal.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🍲</div>
              )}
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {selectedItemForModal.name}
                </h3>
                <p className="mt-1.5 text-2xl font-black text-orange-500">
                  {formatPrice(selectedItemForModal.price)}
                </p>
              </div>

              {selectedItemForModal.description && (
                <div className="text-sm text-neutral-300 leading-relaxed bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800">
                  <div className="font-bold text-[11px] text-neutral-400 uppercase tracking-wider mb-1.5">
                    Tarkibi va tavsif
                  </div>
                  {selectedItemForModal.description}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-800 bg-[#0c0c0e]">
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm cursor-pointer transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. "BIZ HAQIMIZDA" MODAL */}
      {isAboutModalOpen && (
        <div
          onClick={() => setIsAboutModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121215] border border-neutral-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col"
          >
            <div className="relative h-48 bg-neutral-900 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"
                alt="Restoran zali"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/40" />
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4">
                <h3 className="text-xl font-black text-white">{restaurant.name}</h3>
                <p className="text-xs text-neutral-400">Shinam muhit va halol taomlar</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="space-y-3 text-xs sm:text-sm text-neutral-300">
                <div className="flex items-start gap-3 p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-xs">Manzilimiz:</div>
                    <div className="text-neutral-400 mt-0.5">
                      {restaurant.address || 'Toshkent sh., Chilonzor 9-mavze, 24-uy'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-xs">Ish vaqti:</div>
                    <div className="text-neutral-400 mt-0.5">Har kuni: 09:00 — 23:00 gacha</div>
                  </div>
                </div>

                {restaurant.phone && (
                  <div className="flex items-start gap-3 p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800">
                    <Phone className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-xs">Aloqa / Bron:</div>
                      <a
                        href={`tel:${restaurant.phone}`}
                        className="text-orange-400 hover:text-orange-300 font-semibold mt-0.5 block"
                      >
                        {restaurant.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 bg-[#0c0c0e]">
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm cursor-pointer transition-colors"
              >
                Tushunarli
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER */}
      <footer className="mt-16 text-center text-xs text-neutral-500 pb-8">
        <p>© {restaurant.name} — Raqamli interaktiv menyu</p>
      </footer>
    </div>
  )
}
