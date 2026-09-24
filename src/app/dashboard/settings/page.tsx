import { redirect } from 'next/navigation'
import { getMyRestaurant } from '@/app/actions/menu'
import SettingsForm from './SettingsForm'
import type { Restaurant } from '@/types/database.types'

export default async function SettingsPage() {
  const restaurant = await getMyRestaurant()

  if (!restaurant) {
    redirect('/dashboard')
  }

  return <SettingsForm restaurant={restaurant as Restaurant} />
}
