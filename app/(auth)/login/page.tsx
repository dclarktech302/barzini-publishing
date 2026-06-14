'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { validatePin } from '@/lib/pin-auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!validatePin(pin)) {
      setError('PIN must be 6-8 digits')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    })
    setLoading(false)

    if (authError) {
      setError('Invalid email or PIN')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div
      style={{ background: 'var(--background)' }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        className="w-full max-w-sm rounded-xl p-8"
      >
        <div className="mb-8 text-center">
          <span
            style={{ color: 'var(--accent)' }}
            className="text-xs font-semibold tracking-widest uppercase"
          >
            Barzini Publishing
          </span>
          <h1 className="mt-2 text-xl font-semibold text-white">Sign in</h1>
        </div>

        {/* Success/info message from query param */}
        {message && (
          <div
            className="mb-5 rounded-lg px-4 py-3 text-sm"
            style={{
              background: 'rgba(61,219,184,0.1)',
              border: '1px solid rgba(61,219,184,0.2)',
              color: 'var(--primary)',
            }}
          >
            {decodeURIComponent(message)}
          </div>
        )}

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

          <div className="space-y-1">
            <label
              htmlFor="pin"
              className="block text-xs font-medium uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              PIN
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              pattern="\d{6,8}"
              minLength={6}
              maxLength={8}
              autoComplete="current-password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'white',
              }}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 tracking-widest"
              placeholder="••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <Link
              href="/forgot-pin"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: 'var(--primary)' }}
            >
              Forgot PIN?
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
