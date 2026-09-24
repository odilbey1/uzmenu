import { createClient } from '@/utils/supabase/server'
import PanelShell from '@/components/panel/PanelShell'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  let user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null = null

  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {}

  const displayName = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'Super Admin'
  const displayEmail = user?.email || 'admin@uzmenu.uz'

  return (
    <PanelShell variant="super-admin" title="QRMenu" displayName={displayName} email={displayEmail}>
      {children}
    </PanelShell>
  )
}
