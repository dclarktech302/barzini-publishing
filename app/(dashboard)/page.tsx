import { createClient } from '@/lib/supabase/server'
import { getDisplayName } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const displayName = user ? getDisplayName({ email: user.email ?? undefined, user_metadata: user.user_metadata }) : null

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">
        {displayName ? `Welcome back, ${displayName}.` : 'Dashboard'}
      </h1>
      <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Full dashboard overview coming in a future PR.
      </p>
    </div>
  )
}
