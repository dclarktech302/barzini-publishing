import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from "@/lib/supabase/admin"
import { generateTempPin, getDisplayName, isAdminOrAbove, isOwner } from '@/lib/utils'
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
  const body = await request.json() as { userId?: string }
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ error: 'userId is required.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: targetData, error: fetchError } = await admin.auth.admin.getUserById(userId)

  if (fetchError || !targetData.user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  const targetUser = targetData.user
  const targetRole = targetUser.user_metadata?.role as string | undefined

  if (targetRole === 'owner') {
    return NextResponse.json({ error: 'Owner accounts are managed outside the app.' }, { status: 403 })
  }

  if (targetRole === 'admin' && !isOwner(callerRole)) {
    return NextResponse.json({ error: 'Only an owner can resend an admin invite.' }, { status: 403 })
  }

  const tempPin = generateTempPin()

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password: tempPin,
    user_metadata: { ...targetUser.user_metadata, force_pin_change: true },
  })

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  const displayName = targetUser.user_metadata?.display_name ?? targetUser.email?.split('@')[0] ?? ''
  const email = targetUser.email ?? ''
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Barzini Publishing <noreply@barzinipublishing.com>',
    to: email,
    subject: `Your new temporary PIN for Barzini Publishing`,
    react: InviteEmail({ displayName, email, tempPin, inviterName, appUrl }),
  })

  if (emailError) {
    console.error('Resend invite email failed:', emailError)
    return NextResponse.json({
      ok: true,
      tempPin,
      emailWarning: 'PIN updated but invite email failed to send. Share the PIN manually.',
    })
  }

  return NextResponse.json({ ok: true, tempPin })
}
