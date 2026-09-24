import { redirect } from 'next/navigation'
import { getMyRestaurant } from '@/app/actions/menu'
import QRCodeGenerator from './QRCodeGenerator'

export default async function QRPage() {
  const restaurant = await getMyRestaurant()

  if (!restaurant) {
    redirect('/dashboard')
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <QRCodeGenerator
      slug={restaurant.slug}
      restaurantName={restaurant.name}
      baseUrl={baseUrl}
    />
  )
}
