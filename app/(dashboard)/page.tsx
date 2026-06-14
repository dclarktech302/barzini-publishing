import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      {user?.email && (
        <p className="mt-1 text-sm text-white/50">Signed in as {user.email}</p>
      )}
      <p className="mt-4 text-sm text-white/40">
        Full dashboard overview coming in a future PR.
      </p>
    </div>
  )
}
