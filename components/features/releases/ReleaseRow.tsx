'use client'

import { Music2 } from 'lucide-react'
import type { Release } from '@/lib/types'

interface ReleaseRowProps {
  release: Release
  onClick: () => void
}

const STATUS_COLOR: Record<Release['status'], string> = {
  live: 'var(--primary)',
  scheduled: 'var(--accent)',
  processing: 'rgba(255,255,255,0.45)',
  draft: 'rgba(255,255,255,0.2)',
}

const PLATFORM_COLOR: Record<string, string> = {
  live: 'var(--primary)',
  pending: 'var(--accent)',
  delivered: 'var(--primary)',
  error: 'var(--coral)',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

export default function ReleaseRow({ release, onClick }: ReleaseRowProps) {
  const dotColor = STATUS_COLOR[release.status]

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left rounded-lg px-3 py-2.5 transition-opacity hover:opacity-75 min-w-0"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      {/* Cover art placeholder */}
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <Music2 size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />
      </div>

      {/* Title + artist */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{release.title}</p>
        <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {release.artistName} · {release.type}
        </p>
      </div>

      {/* Date + status */}
      <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
        <span
          className="text-[11px] tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)' }}
        >
          {fmtDate(release.releaseDate)}
        </span>

        {/* Platform dots */}
        {release.platforms.length > 0 && (
          <div className="flex items-center gap-1">
            {release.platforms.slice(0, 4).map((p, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: PLATFORM_COLOR[p.status] ?? 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
        )}

        {/* Status dot when no platforms */}
        {release.platforms.length === 0 && (
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
        )}
      </div>
    </button>
  )
}
