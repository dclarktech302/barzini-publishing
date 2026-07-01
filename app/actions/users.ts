'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminOrAbove, isOwner } from '@/lib/utils'

export async function deactivateUser(userId: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const callerRole = user?.user_metadata?.role as string | undefined
  if (!user || !isAdminOrAbove(callerRole)) return { error: 'Forbidden' }
  if (userId === user.id) return { error: 'Cannot deactivate your own account.' }

  const admin = createAdminClient()
  const { data: target, error: fetchError } = await admin
    .from('profiles').select('role').eq('id', userId).single()
  if (fetchError || !target) return { error: 'User not found.' }
  if (target.role === 'owner') return { error: 'Owner accounts cannot be deactivated.' }
  if (target.role === 'admin' && !isOwner(callerRole)) {
    return { error: 'Only an owner can deactivate an admin account.' }
  }

  const { error } = await admin.from('profiles').update({ status: 'inactive' }).eq('id', userId)
  if (error) return { error: error.message }
  await admin.auth.admin.updateUserById(userId, { user_metadata: { active: false } })
  return { ok: true }
}

export async function reactivateUser(userId: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const callerRole = user?.user_metadata?.role as string | undefined
  if (!user || !isOwner(callerRole)) return { error: 'Forbidden' }

  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update({ status: 'active' }).eq('id', userId)
  if (error) return { error: error.message }
  await admin.auth.admin.updateUserById(userId, { user_metadata: { active: true } })
  return { ok: true }
}
