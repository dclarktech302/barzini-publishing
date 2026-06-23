'use client'

import { useEffect, useState, useCallback } from 'react'
import type { UserRecord } from '@/lib/types'
import UserList from '@/components/features/settings/UserList'
import InviteUserForm from '@/components/features/settings/InviteUserForm'
import { UserPlus, X } from 'lucide-react'

interface TempPinDisplay {
  pin: string
  displayName: string
}

interface UsersClientProps {
  currentUserId: string
}

export default function UsersClient({ currentUserId }: UsersClientProps) {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [tempPin, setTempPin] = useState<TempPinDisplay | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/get-users')
      const data = await res.json() as { users?: UserRecord[]; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Failed to load users.')
      } else {
        setUsers(data.users ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function handleDeactivate(userId: string) {
    setLoadingId(userId)
    try {
      const res = await fetch('/api/admin/deactivate-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? { ...u, status: 'inactive' as const } : u)
        )
      }
    } finally {
      setLoadingId(null)
    }
  }

  async function handleResendInvite(userId: string) {
    setLoadingId(userId)
    try {
      const res = await fetch('/api/admin/resend-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json() as { tempPin?: string; error?: string }
      if (res.ok && data.tempPin) {
        const u = users.find((x) => x.id === userId)
        setTempPin({ pin: data.tempPin, displayName: u?.displayName ?? '' })
      }
    } finally {
      setLoadingId(null)
    }
  }

  function handleInviteSuccess(pin: string, displayName: string) {
    setShowInvite(false)
    setTempPin({ pin, displayName })
    fetchUsers()
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 min-w-0">
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {loading ? 'Loading…' : `${users.length} user${users.length !== 1 ? 's' : ''}`}
        </p>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <UserPlus size={15} />
          Invite user
        </button>
      </div>

      {tempPin && (
        <div
          className="rounded-xl p-5 flex flex-col gap-3 relative"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setTempPin(null)}
            className="absolute top-4 right-4 rounded-md p-1 transition-opacity hover:opacity-60"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              Temporary PIN
            </p>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Share this PIN with {tempPin.displayName}. It will not be shown again.
            </p>
          </div>
          <p
            className="text-4xl font-medium tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}
          >
            {tempPin.pin}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm" style={{ color: 'var(--coral)' }}>{error}</p>
      )}

      {!loading && (
        <UserList
          users={users}
          currentUserId={currentUserId}
          onDeactivate={handleDeactivate}
          onResendInvite={handleResendInvite}
          loadingId={loadingId}
        />
      )}

      <InviteUserForm
        open={showInvite}
        onClose={() => setShowInvite(false)}
        onSuccess={handleInviteSuccess}
      />
    </>
  )
}
