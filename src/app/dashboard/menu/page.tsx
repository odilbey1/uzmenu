import { getCategories, getMyRestaurant } from '@/app/actions/menu'
import MenuManager from './MenuManager'

export default async function MenuPage() {
  const [categories, restaurant] = await Promise.all([
    getCategories(),
    getMyRestaurant(),
  ])

  const currency = restaurant?.currency || 'UZS'

  return (
    <MenuManager
      initialCategories={categories as never}
      currency={currency}
    />
  )
}
