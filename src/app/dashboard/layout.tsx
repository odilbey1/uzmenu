import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Profile } from '@/types/database.types'
import PanelShell from '@/components/panel/PanelShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null

  // Super admin should go to their panel
  if (profile?.role === 'super_admin') {
    redirect('/super-admin')
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Foydalanuvchi'

  // Get admin's restaurant name
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, slug')
    .eq('user_id', user.id)
    .single()

  const restaurantName = restaurant?.name || 'Restoran'

  return (
    <PanelShell variant="admin" title={restaurantName} displayName={displayName} email={user.email}>
      {children}
    </PanelShell>
  )
}
