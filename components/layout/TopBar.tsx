'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface TopBarProps {
  email?: string
}

export default function TopBar({ email }: TopBarProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = email
    ? email.split('@')[0].slice(0, 2).toUpperCase()
    : 'BP'

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 h-14 flex-shrink-0"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left: page context — hidden on mobile */}
      <div className="hidden md:block">
        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
          Label admin
        </p>
      </div>

      {/* Mobile: wordmark */}
      <div className="md:hidden">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'var(--accent)' }}
        >
          Barzini Publishing
        </span>
      </div>

      {/* Right: avatar + sign out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-opacity hover:opacity-70"
        title={`Sign out (${email ?? ''})`}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0"
          style={{
            background: 'color-mix(in oklch, var(--primary) 20%, transparent)',
            color: 'var(--primary)',
          }}
        >
          {initials}
        </div>
        <span className="hidden sm:block text-xs text-white/50 truncate max-w-[120px]">
          {email}
        </span>
      </button>
    </header>
  )
}
