'use client'

import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Menu } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'

interface TopBarProps {
  user: User
  displayName: string
  onMenuClick?: () => void
}

export default function TopBar({ user: _user, displayName, onMenuClick }: TopBarProps) {
  const router = useRouter()
  const initials = getInitials(displayName)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const avatar = (
    <div
      className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0"
      style={{
        background: 'color-mix(in oklch, var(--primary) 20%, transparent)',
        color: 'var(--primary)',
      }}
    >
      {initials}
    </div>
  )

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 h-14 flex-shrink-0"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Mobile: hamburger button */}
      <button
        className="md:hidden rounded-lg p-1.5 transition-opacity hover:opacity-70"
        style={{ color: 'rgba(255,255,255,0.55)' }}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop: left placeholder keeps avatar right-aligned */}
      <div className="hidden md:block" />

      {/* Right: avatar dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 outline-none transition-opacity hover:opacity-80"
            aria-label="User menu"
          >
            {avatar}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 min-w-[160px] rounded-xl py-1 outline-none"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <DropdownMenu.Item asChild>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm outline-none cursor-pointer transition-colors"
                style={{ color: 'rgba(255,255,255,0.75)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                }}
              >
                Sign out
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
