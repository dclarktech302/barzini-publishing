'use client'

import { useState } from 'react'
import type { UserRecord, UserRole } from '@/lib/types'
import { isOwner } from '@/lib/utils'

interface UserListProps {
  users: UserRecord[]
  currentUserId: string
  callerRole: UserRole
  onDeactivate: (userId: string) => Promise<string | undefined>
  onResendInvite: (userId: string) => Promise<string | undefined>
  loadingId: string | null
}

type RowAction = 'none' | 'deactivate' | 'resend' | 'both'

function getRowActions(row: UserRecord, callerRole: UserRole, currentUserId: string): RowAction {
  if (row.id === currentUserId) return 'none'
  if (row.role === 'owner') return 'none'
  if (row.role === 'admin' && !isOwner(callerRole)) return 'none'
  if (row.status === 'inactive') return 'none'
  if (row.status === 'pending') return 'both'
  return 'deactivate'
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
  const elevated = role === 'owner' || role === 'admin'
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{
        color: elevated ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
        background: elevated ? 'rgba(185,157,90,0.1)' : 'var(--surface-2)',
      }}
    >
      {role}
    </span>
  )
}

function RowActions({
  user,
  callerRole,
  currentUserId,
  onDeactivate,
  onResendInvite,
  loadingId,
  size,
}: {
  user: UserRecord
  callerRole: UserRole
  currentUserId: string
  onDeactivate: (id: string) => Promise<string | undefined>
  onResendInvite: (id: string) => Promise<string | undefined>
  loadingId: string | null
  size: 'sm' | 'xs'
}) {
  const [rowError, setRowError] = useState<string | null>(null)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const action = getRowActions(user, callerRole, currentUserId)

  if (action === 'none') return null

  const px = size === 'sm' ? 'px-3 py-1.5' : 'px-3 py-1'

  async function handleDeactivate() {
    setRowError(null)
    const err = await onDeactivate(user.id)
    if (err) {
      setRowError(err)
      setConfirmDeactivate(false)
    }
  }

  async function handleResend() {
    setRowError(null)
    const err = await onResendInvite(user.id)
    if (err) setRowError(err)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        {(action === 'both' || action === 'resend') && (
          <button
            onClick={handleResend}
            disabled={loadingId === user.id}
            className={`rounded-lg ${px} text-xs font-medium transition-opacity disabled:opacity-40`}
            style={{ background: 'var(--surface-2)', color: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)' }}
          >
            {loadingId === user.id ? 'Sending…' : 'Resend invite'}
          </button>
        )}
        {(action === 'both' || action === 'deactivate') && !confirmDeactivate && (
          <button
            onClick={() => setConfirmDeactivate(true)}
            disabled={loadingId === user.id}
            className={`rounded-lg ${px} text-xs font-medium transition-opacity disabled:opacity-40`}
            style={{ background: 'var(--coral-dim)', color: 'var(--coral)' }}
          >
            Deactivate
          </button>
        )}
        {confirmDeactivate && (
          <>
            <button
              onClick={handleDeactivate}
              disabled={loadingId === user.id}
              className={`rounded-lg ${px} text-xs font-medium transition-opacity disabled:opacity-40`}
              style={{ background: 'var(--coral)', color: '#fff' }}
            >
              {loadingId === user.id ? 'Working…' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirmDeactivate(false)}
              className={`rounded-lg ${px} text-xs font-medium`}
              style={{ background: 'var(--surface-2)', color: 'rgba(255,255,255,0.55)', border: '1px solid var(--border)' }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {rowError && (
        <p className="text-[11px]" style={{ color: 'var(--coral)' }}>{rowError}</p>
      )}
    </div>
  )
}

export default function UserList({ users, currentUserId, callerRole, onDeactivate, onResendInvite, loadingId }: UserListProps) {
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
            <RowActions
              user={u}
              callerRole={callerRole}
              currentUserId={currentUserId}
              onDeactivate={onDeactivate}
              onResendInvite={onResendInvite}
              loadingId={loadingId}
              size="sm"
            />
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
                  <div className="flex justify-end">
                    <RowActions
                      user={u}
                      callerRole={callerRole}
                      currentUserId={currentUserId}
                      onDeactivate={onDeactivate}
                      onResendInvite={onResendInvite}
                      loadingId={loadingId}
                      size="xs"
                    />
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
