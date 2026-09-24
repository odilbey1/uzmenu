'use client'

import { useState, useTransition } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Eye,
  EyeOff,
  Loader2,
  X,
  Check,
  Layers,
  UtensilsCrossed,
} from 'lucide-react'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem,
  toggleItemAvailability,
} from '@/app/actions/menu'
import type { Category, Item } from '@/types/database.types'

type CategoryWithItems = Category & {
  items: Item[]
}

export default function MenuManager({
  initialCategories,
  currency,
}: {
  initialCategories: CategoryWithItems[]
  currency: string
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    initialCategories.forEach((c) => (initial[c.id] = true))
    return initial
  })
  const [isPending, startTransition] = useTransition()

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  function toggleCategory(catId: string) {
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }))
  }

  function openAddCategory() {
    setEditingCategory(null)
    setShowCategoryModal(true)
    setError(null)
  }

  function openEditCategory(cat: Category) {
    setEditingCategory(cat)
    setShowCategoryModal(true)
    setError(null)
  }

  function openAddItem(categoryId: string) {
    setEditingItem(null)
    setSelectedCategoryId(categoryId)
    setShowItemModal(true)
    setError(null)
    setImagePreview(null)
  }

  function openEditItem(item: Item) {
    setEditingItem(item)
    setSelectedCategoryId(item.category_id)
    setShowItemModal(true)
    setError(null)
    setImagePreview(item.image_url || null)
  }

  async function handleCategorySubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      let result
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, formData)
      } else {
        result = await createCategory(formData)
      }
      if (result?.error) {
        setError(result.error)
      } else {
        setShowCategoryModal(false)
        window.location.reload()
      }
    })
  }

  async function handleDeleteCategory(catId: string) {
    if (!confirm('Bu kategoriya va undagi barcha taomlar o\'chiriladi. Davom etasizmi?')) return
    startTransition(async () => {
      await deleteCategory(catId)
      window.location.reload()
    })
  }

  async function handleItemSubmit(formData: FormData) {
    setError(null)
    formData.set('categoryId', selectedCategoryId)
    if (editingItem) {
      formData.set('isAvailable', String(editingItem.is_available))
    }
    startTransition(async () => {
      let result
      if (editingItem) {
        result = await updateItem(editingItem.id, formData)
      } else {
        result = await createItem(formData)
      }
      if (result?.error) {
        setError(result.error)
      } else {
        setShowItemModal(false)
        window.location.reload()
      }
    })
  }

  async function handleDeleteItem(itemId: string) {
    if (!confirm('Bu taomni o\'chirmoqchimisiz?')) return
    startTransition(async () => {
      await deleteItem(itemId)
      window.location.reload()
    })
  }

  async function handleToggleAvailability(itemId: string, current: boolean) {
    startTransition(async () => {
      await toggleItemAvailability(itemId, !current)
      window.location.reload()
    })
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Menyu boshqaruvi
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Kategoriyalar va taomlarni qo'shing, tahrirlang, o'chiring
          </p>
        </div>
        <button
          onClick={openAddCategory}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-all shadow-sm shadow-orange-500/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi kategoriya
        </button>
      </div>

      {/* Categories and Items */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white p-8 sm:p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-100">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            Hozircha kategoriya yo'q
          </h3>
          <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">
            Birinchi kategoriyangizni yarating va taomlarni qo'shishni boshlang.
          </p>
          <button
            onClick={openAddCategory}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Birinchi kategoriyani yaratish
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Category Header */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-stone-50 transition-all"
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{cat.name}</h3>
                    <span className="text-xs text-stone-400">
                      {cat.items.length} ta taom
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openAddItem(cat.id)
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 transition-all cursor-pointer"
                    title="Taom qo'shish"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditCategory(cat)
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCategory(cat.id)
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedCats[cat.id] ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </div>
              </div>

              {/* Items List */}
              {expandedCats[cat.id] && (
                <div className="border-t border-stone-100">
                  {cat.items.length === 0 ? (
                    <div className="px-5 py-6 text-center">
                      <p className="text-xs text-stone-400 mb-3">
                        Bu kategoriyada hali taom yo'q
                      </p>
                      <button
                        onClick={() => openAddItem(cat.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium hover:bg-orange-100 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Taom qo'shish
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {cat.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 px-5 py-3 hover:bg-stone-50 transition-all ${
                            !item.is_available ? 'opacity-50' : ''
                          }`}
                        >
                          {/* Image */}
                          <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UtensilsCrossed className="w-5 h-5 text-stone-300" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-stone-900 truncate">
                                {item.name}
                              </span>
                              {!item.is_available && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-600">
                                  Mavjud emas
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-stone-400 truncate mt-0.5">
                                {item.description}
                              </p>
                            )}
                            <div className="text-xs font-bold text-orange-600 mt-1">
                              {formatPrice(item.price)} {currency}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleToggleAvailability(item.id, item.is_available)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                              title={item.is_available ? 'Mavjud emas qilish' : 'Mavjud qilish'}
                            >
                              {item.is_available ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditItem(item)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                              title="Tahrirlash"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Item Button at Bottom */}
                  {cat.items.length > 0 && (
                    <div className="px-5 py-3 border-t border-stone-100">
                      <button
                        onClick={() => openAddItem(cat.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-600 hover:bg-orange-50 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Taom qo'shish
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ======= CATEGORY MODAL ======= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-900">
                {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleCategorySubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="catName" className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Kategoriya nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="catName"
                  name="name"
                  required
                  defaultValue={editingCategory?.name || ''}
                  placeholder="Masalan: Issiq taomlar"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editingCategory ? 'Saqlash' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======= ITEM MODAL ======= */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-stone-100 z-10">
              <h3 className="font-bold text-stone-900">
                {editingItem ? 'Taomni tahrirlash' : 'Yangi taom qo\'shish'}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleItemSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Rasm
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-stone-100 border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImagePlus className="w-6 h-6 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer transition-all">
                      <ImagePlus className="w-3.5 h-3.5" />
                      Rasm tanlash
                      <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-stone-400 mt-1">
                      JPG, PNG, WebP · Max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="itemName" className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Taom nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="itemName"
                  name="name"
                  required
                  defaultValue={editingItem?.name || ''}
                  placeholder="Masalan: Osh, Somsa, Lagmon"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="itemDesc" className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Tavsif
                </label>
                <textarea
                  id="itemDesc"
                  name="description"
                  defaultValue={editingItem?.description || ''}
                  placeholder="Taom haqida qisqacha..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="itemPrice" className="block text-xs font-semibold text-stone-500 mb-1.5">
                  Narx ({currency}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="itemPrice"
                  name="price"
                  required
                  min="0"
                  step="any"
                  defaultValue={editingItem?.price || ''}
                  placeholder="45000"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category selector (for editing) */}
              {editingItem && categories.length > 1 && (
                <div>
                  <label htmlFor="itemCategory" className="block text-xs font-semibold text-stone-500 mb-1.5">
                    Kategoriya
                  </label>
                  <select
                    id="itemCategory"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editingItem ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
