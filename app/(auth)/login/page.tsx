'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { validatePin } from '@/lib/pin-auth'

const CONCERT_IMAGE =
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80'

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (pin.length === 6 && email.trim()) {
      formRef.current?.requestSubmit()
    }
  }, [pin, email])

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

  const formContent = (
    <div className="w-full max-w-[360px]">
      <p
        className="uppercase"
        style={{ color: 'var(--primary)', fontSize: '11px', letterSpacing: '0.15em' }}
      >
        Secure Access
      </p>
      <h1
        className="mt-1 text-white"
        style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '2rem' }}
      >
        Sign in
      </h1>

      {message && (
        <div
          className="mb-6 rounded-lg px-4 py-3 text-sm"
          style={{
            background: 'rgba(61,219,184,0.1)',
            border: '1px solid rgba(61,219,184,0.2)',
            color: 'var(--primary)',
          }}
        >
          {decodeURIComponent(message)}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="uppercase"
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '0.08em' }}
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
            placeholder="you@example.com"
            className="w-full rounded-lg px-4 py-3 text-white outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary)]"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '16px' }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="pin"
            className="uppercase"
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '0.08em' }}
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
            placeholder="••••••"
            className="w-full rounded-lg px-4 py-3 text-white outline-none tracking-widest transition-shadow focus:ring-2 focus:ring-[var(--primary)]"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '16px' }}
          />
        </div>

        {error && (
          <p style={{ color: 'var(--coral)', fontSize: '13px', marginTop: '-8px' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all disabled:opacity-50"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.filter = 'brightness(1.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = '' }}
        >
          {loading && <Spinner />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-center" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
          <Link
            href="/forgot-pin"
            className="underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Forgot PIN?
          </Link>
        </p>
      </form>
    </div>
  )

  return (
    <>
      {/* ── Mobile / tablet: full-screen background image, form centered over it ── */}
      <div
        className="relative flex min-h-screen w-full items-center justify-center px-6 py-12 md:hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CONCERT_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Dark overlay so form is readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)' }}
        />
        {/* Brand name top-left */}
        <div className="absolute top-8 left-6 select-none">
          <p className="leading-none text-white" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Barzini Family
          </p>
          <p className="leading-none" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--accent)' }}>
            Music Group
          </p>
        </div>
        {/* Form */}
        <div className="relative z-10 w-full max-w-[360px]">
          {formContent}
        </div>
      </div>

      {/* ── Desktop: diagonal split ── */}
      <div className="hidden md:flex h-screen w-full overflow-hidden" style={{ background: 'var(--background)' }}>
        {/* Left: image panel with diagonal clip */}
        <div
          className="relative flex-shrink-0 h-full"
          style={{
            width: '55%',
            clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CONCERT_IMAGE}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)' }}
          />
          <div className="absolute bottom-10 left-10 select-none">
            <p className="leading-none text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>
              Barzini Family
            </p>
            <p className="leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--accent)' }}>
              Music Group
            </p>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              Artist management. Publishing. Distribution.
            </p>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 overflow-y-auto">
          {formContent}
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
