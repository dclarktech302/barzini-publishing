import { createClient } from '@/lib/supabase/server'
import { validatePin } from '@/lib/pin-auth'

export async function POST(req: Request) {
  const { currentPin, newPin } = await req.json()

  if (!validatePin(currentPin) || !validatePin(newPin)) {
    return Response.json({ error: 'PIN must be 6-8 digits' }, { status: 400 })
  }
  if (currentPin === newPin) {
    return Response.json(
      { error: 'New PIN must be different from current PIN' },
      { status: 400 },
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user || !user.email) {
    return Response.json({ error: 'No active session' }, { status: 401 })
  }

  // Verify current PIN by re-authenticating
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPin,
  })
  if (verifyError) {
    return Response.json({ error: 'Current PIN is incorrect' }, { status: 401 })
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPin })
  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 400 })
  }

  return Response.json({ success: true })
}
