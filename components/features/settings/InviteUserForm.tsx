'use client'

import { useState } from 'react'
import Sheet from '@/components/ui/Sheet'
import type { UserRole } from '@/lib/types'

interface InviteUserFormProps {
  open: boolean
  onClose: () => void
  onSuccess: (tempPin: string, displayName: string) => void
}

export default function InviteUserForm({ open, onClose, onSuccess }: InviteUserFormProps) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('user')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, role }),
      })
      const data = await res.json() as { error?: string; tempPin?: string }
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }
      setDisplayName('')
      setEmail('')
      setRole('user')
      onSuccess(data.tempPin!, displayName)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
  }

  return (
    <Sheet open={open} onClose={onClose} title="Invite user">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Full name
          </label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Alex Brooks"
            className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none"
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none"
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none appearance-none"
            style={inputStyle}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && (
          <p className="text-sm" style={{ color: 'var(--coral)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {loading ? 'Sending invite…' : 'Send invite'}
        </button>
      </form>
    </Sheet>
  )
}
