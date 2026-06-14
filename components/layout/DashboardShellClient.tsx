'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

interface DashboardShellClientProps {
  user?: {
    email?: string
    user_metadata?: { display_name?: string }
  }
  children: React.ReactNode
}

export default function DashboardShellClient({ user, children }: DashboardShellClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      className="flex min-h-screen flex-col md:flex-row"
      style={{ background: 'var(--background)' }}
    >
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
