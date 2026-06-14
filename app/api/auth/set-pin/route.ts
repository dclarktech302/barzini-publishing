import { createClient } from '@/lib/supabase/server'
import { validatePin } from '@/lib/pin-auth'

export async function POST(req: Request) {
  const { pin, displayName } = await req.json() as { pin: string; displayName?: string }

  if (!validatePin(pin)) {
    return Response.json({ error: 'PIN must be 6-8 digits' }, { status: 400 })
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return Response.json({ error: 'No active session' }, { status: 401 })
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: pin })
  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 400 })
  }

  const metaUpdate: Record<string, unknown> = { pin_set: true }
  if (displayName?.trim()) metaUpdate.display_name = displayName.trim()

  const { error: metaError } = await supabase.auth.updateUser({ data: metaUpdate })
  if (metaError) {
    return Response.json({ error: metaError.message }, { status: 400 })
  }

  return Response.json({ success: true })
}
