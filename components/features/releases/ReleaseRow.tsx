'use client'

import { Music2 } from 'lucide-react'
import type { Platform, Release } from '@/lib/types'

interface ReleaseRowProps {
  release: Release
  onClick: () => void
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

const KNOWN_PLATFORMS: { key: Platform['name']; abbr: string }[] = [
  { key: 'spotify', abbr: 'Sp' },
  { key: 'apple_music', abbr: 'Ap' },
  { key: 'youtube_music', abbr: 'YT' },
  { key: 'tidal', abbr: 'Td' },
  { key: 'amazon_music', abbr: 'Az' },
]

const BADGE_STYLE: Record<string, { color: string; bg: string }> = {
  live:      { color: 'var(--primary)', bg: 'rgba(61,219,184,0.12)' },
  delivered: { color: 'var(--primary)', bg: 'rgba(61,219,184,0.12)' },
  pending:   { color: 'var(--accent)',  bg: 'color-mix(in oklch, var(--accent) 12%, transparent)' },
  error:     { color: 'var(--coral)',   bg: 'var(--coral-dim)' },
}

function PlatformBadge({ abbr, status }: { abbr: string; status: string | null }) {
  const s = status ? (BADGE_STYLE[status] ?? null) : null
  return (
    <span
      className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
      style={{
        fontFamily: 'var(--font-mono)',
        color: s?.color ?? 'rgba(255,255,255,0.2)',
        background: s?.bg ?? 'var(--surface-2)',
      }}
    >
      {abbr}
    </span>
  )
}

export default function ReleaseRow({ release, onClick }: ReleaseRowProps) {
  const platformMap = new Map(release.platforms.map((p) => [p.name, p.status]))

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left rounded-lg px-3 py-2.5 transition-opacity hover:opacity-75 min-w-0"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <Music2 size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{release.title}</p>
        <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {release.artistName} · {release.type}
        </p>
      </div>

      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        <span
          className="text-[11px] tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)' }}
        >
          {fmtDate(release.releaseDate)}
        </span>
        <div className="flex items-center gap-1">
          {KNOWN_PLATFORMS.map(({ key, abbr }) => (
            <PlatformBadge key={key} abbr={abbr} status={platformMap.get(key) ?? null} />
          ))}
        </div>
      </div>
    </button>
  )
}
