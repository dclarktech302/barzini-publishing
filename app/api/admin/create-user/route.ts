import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from "@/lib/supabase/admin"
import { generateTempPin, getDisplayName, isAdminOrAbove } from '@/lib/utils'
import { Resend } from 'resend'
import InviteEmail from '@/components/emails/InviteEmail'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const callerRole = user?.user_metadata?.role as string | undefined
  if (!user || !isAdminOrAbove(callerRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const inviterName = getDisplayName({ email: user.email ?? undefined, user_metadata: user.user_metadata })
  const body = await request.json() as { email?: string; displayName?: string; role?: string }
  const { email, displayName, role = 'user' } = body

  if (!email || !displayName) {
    return NextResponse.json({ error: 'email and displayName are required.' }, { status: 400 })
  }

  if (role !== 'admin' && role !== 'user') {
    return NextResponse.json({ error: 'Invalid role. Must be admin or user.' }, { status: 400 })
  }

  const tempPin = generateTempPin()
  const admin = createAdminClient()

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPin,
    user_metadata: {
      display_name: displayName,
      role,
      pin_set: false,
      force_pin_change: true,
      active: true,
    },
    email_confirm: true,
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Barzini Publishing <noreply@barzinipublishing.com>',
    to: email,
    subject: `You've been invited to Barzini Publishing`,
    react: InviteEmail({ displayName, email, tempPin, inviterName, appUrl }),
  })

  if (emailError) {
    console.error('Resend invite email failed:', emailError)
    return NextResponse.json({
      ok: true,
      userId: created.user.id,
      tempPin,
      emailWarning: 'User created but invite email failed to send. Share the PIN manually and use Resend invite to retry.',
    })
  }

  return NextResponse.json({ ok: true, userId: created.user.id, tempPin })
}
