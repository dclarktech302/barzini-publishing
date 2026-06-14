'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { validatePin } from '@/lib/pin-auth'

type Stage = 'loading' | 'invalid' | 'setup' | 'submitting'

function VerifyPinContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stage, setStage] = useState<Stage>('loading')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (!tokenHash || type !== 'invite') {
      setStage('invalid')
      return
    }

    const supabase = createClient()
    supabase.auth
      .verifyOtp({ token_hash: tokenHash, type: 'invite' })
      .then(({ error }) => {
        if (error) {
          setStage('invalid')
        } else {
          setStage('setup')
        }
      })
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!validatePin(pin)) {
      setError('PIN must be 6-8 digits (numbers only)')
      return
    }
    if (pin !== confirmPin) {
      setError('PINs do not match')
      return
    }

    setStage('submitting')
    const res = await fetch('/api/auth/set-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setStage('setup')
      return
    }

    router.push('/')
  }

  const cardStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
  }

  const inputStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'white',
  }

  return (
    <div
      style={{ background: 'var(--background)' }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div style={cardStyle} className="w-full max-w-sm rounded-xl p-8">
        <div className="mb-8 text-center">
          <span
            style={{ color: 'var(--accent)' }}
            className="text-xs font-semibold tracking-widest uppercase"
          >
            Barzini Publishing
          </span>
          <h1 className="mt-2 text-xl font-semibold text-white">Set your PIN</h1>
        </div>

        {stage === 'loading' && (
          <p className="text-center text-sm text-white/50">Verifying invite…</p>
        )}

        {stage === 'invalid' && (
          <p className="text-center text-sm text-red-400">
            This invite link is invalid or has expired. Contact your admin for a new invite.
          </p>
        )}

        {(stage === 'setup' || stage === 'submitting') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="pin"
                className="block text-xs font-medium text-white/60 uppercase tracking-wider"
              >
                Choose a PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="\d{6,8}"
                minLength={6}
                maxLength={8}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                style={inputStyle}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 tracking-widest"
                placeholder="6-8 digits"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirm-pin"
                className="block text-xs font-medium text-white/60 uppercase tracking-wider"
              >
                Confirm PIN
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
              disabled={stage === 'submitting'}
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50 transition-opacity"
            >
              {stage === 'submitting' ? 'Setting PIN…' : 'Set PIN and continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function VerifyPinPage() {
  return (
    <Suspense>
      <VerifyPinContent />
    </Suspense>
  )
}
