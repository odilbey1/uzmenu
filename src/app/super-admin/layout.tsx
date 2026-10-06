import { requireSuperAdmin } from '@/utils/supabase/authorization'
import PanelShell from '@/components/panel/PanelShell'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireSuperAdmin()

  const displayName = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'Super Admin'
  const displayEmail = user?.email || 'admin@uzmenu.uz'

  return (
    <PanelShell variant="super-admin" title="QRMenu" displayName={displayName} email={displayEmail}>
      {children}
    </PanelShell>
  )
}
