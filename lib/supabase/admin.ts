import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createAdminClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
// Used only for: invite creation (admin.inviteUserByEmail) and any
// admin-only operations. Never import this in a Client Component.
