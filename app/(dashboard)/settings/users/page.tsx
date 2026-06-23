import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersClient from '@/components/features/settings/UsersClient'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="min-w-0">
        <p
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'var(--accent)' }}
        >
          Settings
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-white">User management</h1>
      </div>

      <UsersClient currentUserId={user.id} />
    </div>
  )
}
