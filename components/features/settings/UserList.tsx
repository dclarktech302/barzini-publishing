'use client'

import type { UserRecord } from '@/lib/types'

interface UserListProps {
  users: UserRecord[]
  currentUserId: string
  onDeactivate: (userId: string) => void
  onResendInvite: (userId: string) => void
  loadingId: string | null
}

function StatusBadge({ status }: { status: UserRecord['status'] }) {
  const styles: Record<UserRecord['status'], { color: string; background: string; label: string }> = {
    active: { color: 'var(--primary)', background: 'rgba(61,219,184,0.1)', label: 'Active' },
    pending: { color: 'var(--accent)', background: 'rgba(185,157,90,0.12)', label: 'Pending' },
    inactive: { color: 'rgba(255,255,255,0.35)', background: 'var(--surface-2)', label: 'Inactive' },
  }
  const s = styles[status]
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ color: s.color, background: s.background }}
    >
      {s.label}
    </span>
  )
}

function RoleBadge({ role }: { role: UserRecord['role'] }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{
        color: role === 'admin' ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
        background: role === 'admin' ? 'rgba(185,157,90,0.1)' : 'var(--surface-2)',
      }}
    >
      {role}
    </span>
  )
}

export default function UserList({ users, currentUserId, onDeactivate, onResendInvite, loadingId }: UserListProps) {
  if (users.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
        No users found.
      </p>
    )
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((u) => (
          <div
            key={u.id}
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{u.displayName}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {u.email}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <RoleBadge role={u.role} />
                <StatusBadge status={u.status} />
              </div>
            </div>
            <div className="flex gap-2">
              {u.status === 'pending' && (
                <button
                  onClick={() => onResendInvite(u.id)}
                  disabled={loadingId === u.id}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--surface-2)', color: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)' }}
                >
                  {loadingId === u.id ? 'Sending…' : 'Resend invite'}
                </button>
              )}
              {u.status !== 'inactive' && u.id !== currentUserId && (
                <button
                  onClick={() => onDeactivate(u.id)}
                  disabled={loadingId === u.id}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--coral-dim)', color: 'var(--coral)', border: '1px solid transparent' }}
                >
                  {loadingId === u.id ? 'Working…' : 'Deactivate'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div
        className="hidden md:block rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Email', 'Role', 'Status', 'Last sign in', ''].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.id}
                style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
              >
                <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{u.displayName}</td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {u.email}
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={u.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    {u.status === 'pending' && (
                      <button
                        onClick={() => onResendInvite(u.id)}
                        disabled={loadingId === u.id}
                        className="rounded-lg px-3 py-1 text-xs font-medium transition-opacity disabled:opacity-40"
                        style={{ background: 'var(--surface-2)', color: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)' }}
                      >
                        {loadingId === u.id ? 'Sending…' : 'Resend invite'}
                      </button>
                    )}
                    {u.status !== 'inactive' && u.id !== currentUserId && (
                      <button
                        onClick={() => onDeactivate(u.id)}
                        disabled={loadingId === u.id}
                        className="rounded-lg px-3 py-1 text-xs font-medium transition-opacity disabled:opacity-40"
                        style={{ background: 'var(--coral-dim)', color: 'var(--coral)' }}
                      >
                        {loadingId === u.id ? 'Working…' : 'Deactivate'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
