'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getDisplayName } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

interface DashboardShellProps {
  children: React.ReactNode
  user: User
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const role = user.user_metadata?.role as string | undefined
  const displayName = getDisplayName({ email: user.email ?? undefined, user_metadata: user.user_metadata })

  return (
    <div
      className="flex min-h-screen flex-col md:flex-row"
      style={{ background: 'var(--background)' }}
    >
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} role={role} />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar user={user} displayName={displayName} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
