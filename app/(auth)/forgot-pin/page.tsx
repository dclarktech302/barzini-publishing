'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPinPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    // Fire-and-forget — do not reveal account existence
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-pin`,
    })
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div
      style={{ background: 'var(--background)' }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="mb-8 text-center">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Barzini Publishing
          </span>
          <h1 className="mt-2 text-xl font-semibold text-white">Forgot PIN</h1>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              If an account exists for this email, you&apos;ll receive a reset link shortly.
            </p>
            <Link
              href="/login"
              className="text-xs underline underline-offset-2"
              style={{ color: 'var(--primary)' }}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'white',
                }}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50 transition-opacity"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>

            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <Link
                href="/login"
                className="underline underline-offset-2"
                style={{ color: 'var(--primary)' }}
              >
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
