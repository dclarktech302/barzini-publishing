import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export default async function DashboardShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const topBarUser = user
    ? { email: user.email ?? undefined, user_metadata: user.user_metadata ?? undefined }
    : undefined

  return (
    <div
      className="flex min-h-screen flex-col md:flex-row"
      style={{ background: 'var(--background)' }}
    >
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar user={topBarUser} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
