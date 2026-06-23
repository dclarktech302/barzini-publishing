import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from "@/lib/supabase/admin"


export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json() as { userId?: string }
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ error: 'userId is required.' }, { status: 400 })
  }

  if (userId === user.id) {
    return NextResponse.json({ error: 'You cannot deactivate your own account.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: targetData, error: fetchError } = await admin.auth.admin.getUserById(userId)

  if (fetchError || !targetData.user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  const { error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...targetData.user.user_metadata,
      active: false,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
