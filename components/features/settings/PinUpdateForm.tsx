'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validatePin } from '@/lib/pin-auth'

const inputStyle: React.CSSProperties = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'white',
}

export default function PinUpdateForm() {
  const router = useRouter()
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!validatePin(currentPin)) {
      setError('Current PIN must be 6-8 digits')
      return
    }
    if (!validatePin(newPin)) {
      setError('New PIN must be 6-8 digits')
      return
    }
    if (newPin !== confirmPin) {
      setError('New PINs do not match')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/update-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPin, newPin }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      return
    }

    // Sign out on the client side then redirect with message
    router.push('/login?message=PIN+updated.+Please+sign+in+with+your+new+PIN.')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="current-pin"
          className="block text-xs font-medium uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Current PIN
        </label>
        <input
          id="current-pin"
          type="password"
          inputMode="numeric"
          pattern="\d{6,8}"
          minLength={6}
          maxLength={8}
          required
          value={currentPin}
          onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
          style={inputStyle}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 tracking-widest"
          placeholder="6-8 digits"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="new-pin"
          className="block text-xs font-medium uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          New PIN
        </label>
        <input
          id="new-pin"
          type="password"
          inputMode="numeric"
          pattern="\d{6,8}"
          minLength={6}
          maxLength={8}
          required
          value={newPin}
          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
          style={inputStyle}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 tracking-widest"
          placeholder="6-8 digits"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="confirm-pin"
          className="block text-xs font-medium uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Confirm New PIN
        </label>
        <input
          id="confirm-pin"
          type="password"
          inputMode="numeric"
          pattern="\d{6,8}"
          minLength={6}
          maxLength={8}
          required
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
          style={inputStyle}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 tracking-widest"
          placeholder="6-8 digits"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50 transition-opacity"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        {loading ? 'Updating…' : 'Update PIN'}
      </button>

      <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
        <Link
          href="/forgot-pin"
          className="underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: 'var(--primary)' }}
        >
          Forgot your current PIN?
        </Link>
      </p>
    </form>
  )
}
