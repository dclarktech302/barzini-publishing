'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { validatePin } from '@/lib/pin-auth'

type Stage = 'loading' | 'invalid' | 'form' | 'submitting'

function ResetPinContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stage, setStage] = useState<Stage>('loading')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (!tokenHash || type !== 'recovery') {
      setStage('invalid')
      return
    }

    const supabase = createClient()
    supabase.auth
      .verifyOtp({ token_hash: tokenHash, type: 'recovery' })
      .then(({ error }) => {
        setStage(error ? 'invalid' : 'form')
      })
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!validatePin(newPin)) {
      setError('PIN must be 6-8 digits (numbers only)')
      return
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match')
      return
    }

    setStage('submitting')
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password: newPin })

    if (updateError) {
      setError(updateError.message)
      setStage('form')
      return
    }

    await supabase.auth.signOut()
    router.push('/login?message=PIN+reset.+Please+sign+in+with+your+new+PIN.')
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
  }
  const inputStyle: React.CSSProperties = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'white',
    fontSize: '16px',
  }

  return (
    <div
      style={{ background: 'var(--background)' }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div style={cardStyle} className="w-full max-w-sm rounded-xl p-8">
        <div className="mb-8 text-center">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Barzini Publishing
          </span>
          <h1 className="mt-2 text-xl font-semibold text-white">Reset PIN</h1>
        </div>

        {stage === 'loading' && (
          <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Verifying reset link…
          </p>
        )}

        {stage === 'invalid' && (
          <div className="text-center space-y-4">
            <p className="text-sm text-red-400">
              This reset link is invalid or has expired. Request a new one from the login page.
            </p>
            <Link
              href="/forgot-pin"
              className="text-xs underline underline-offset-2"
              style={{ color: 'var(--primary)' }}
            >
              Request new link
            </Link>
          </div>
        )}

        {(stage === 'form' || stage === 'submitting') && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50 transition-opacity"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              {stage === 'submitting' ? 'Resetting…' : 'Set new PIN'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPinPage() {
  return (
    <Suspense>
      <ResetPinContent />
    </Suspense>
  )
}
