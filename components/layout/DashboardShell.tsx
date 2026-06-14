import { createClient } from '@/lib/supabase/server'
import DashboardShellClient from '@/components/layout/DashboardShellClient'

export default async function DashboardShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const topBarUser = user
    ? { email: user.email ?? undefined, user_metadata: user.user_metadata ?? undefined }
    : undefined

  return (
    <DashboardShellClient user={topBarUser}>
      {children}
    </DashboardShellClient>
  )
}
