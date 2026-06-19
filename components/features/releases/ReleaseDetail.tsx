'use client'

import { Music2 } from 'lucide-react'
import type { Platform, Release } from '@/lib/types'
import Sheet from '@/components/ui/Sheet'

interface ReleaseDetailProps {
  release: Release
  onClose: () => void
}

const STATUS_LABEL: Record<Release['status'], string> = {
  live: 'Live',
  scheduled: 'Scheduled',
  processing: 'Processing',
  draft: 'Draft',
}

const STATUS_COLOR: Record<Release['status'], string> = {
  live: 'var(--primary)',
  scheduled: 'var(--accent)',
  processing: 'rgba(255,255,255,0.45)',
  draft: 'rgba(255,255,255,0.2)',
}

const PLATFORM_DISPLAY: Record<string, string> = {
  spotify: 'Spotify',
  apple_music: 'Apple Music',
  youtube_music: 'YouTube Music',
  tidal: 'Tidal',
  amazon_music: 'Amazon Music',
  other: 'Other',
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

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ReleaseDetail({ release, onClose }: ReleaseDetailProps) {
  const statusColor = STATUS_COLOR[release.status]
  const isDraftOrProcessing = release.status === 'draft' || release.status === 'processing'
  const platformMap = new Map(release.platforms.map((p) => [p.name, p]))

  return (
    <Sheet open title={release.title} onClose={onClose}>
      {/* Cover art + meta */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <Music2 size={20} style={{ color: 'rgba(255,255,255,0.2)' }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-white truncate">{release.title}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {release.artistName} · {release.type.charAt(0).toUpperCase() + release.type.slice(1)}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: statusColor }} />
            <span className="text-[11px] font-medium capitalize" style={{ color: statusColor }}>
              {STATUS_LABEL[release.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-medium mb-1"
             style={{ color: 'rgba(255,255,255,0.35)' }}>
            Release Date
          </p>
          <p className="text-sm text-white" style={{ fontFamily: 'var(--font-mono)' }}>
            {fmtDate(release.releaseDate)}
          </p>
        </div>
        {release.labelgridId && (
          <div>
            <p className="text-[11px] uppercase tracking-wider font-medium mb-1"
               style={{ color: 'rgba(255,255,255,0.35)' }}>
              LabelGrid ID
            </p>
            <p className="text-sm text-white" style={{ fontFamily: 'var(--font-mono)' }}>
              {release.labelgridId}
            </p>
          </div>
        )}
      </div>

      {/* Platform checklist */}
      <div>
        <p className="text-[11px] uppercase tracking-wider font-medium mb-3"
           style={{ color: 'rgba(255,255,255,0.35)' }}>
          Platforms
        </p>

        {release.platforms.length === 0 ? (
          <div
            className="rounded-lg px-4 py-4 text-sm"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.4)' }}
          >
            {isDraftOrProcessing
              ? 'Distribution managed via LabelGrid — connect API to enable.'
              : 'No platforms configured.'}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {KNOWN_PLATFORMS.map(({ key, abbr }) => {
              const p = platformMap.get(key)
              const displayName = PLATFORM_DISPLAY[key] ?? key
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <PlatformBadge abbr={abbr} status={p?.status ?? null} />
                  <span className="flex-1 text-sm text-white">{displayName}</span>
                  <span
                    className="text-[11px] capitalize flex-shrink-0"
                    style={{
                      color: p
                        ? (BADGE_STYLE[p.status]?.color ?? 'rgba(255,255,255,0.3)')
                        : 'rgba(255,255,255,0.2)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {p ? p.status : 'not set'}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {isDraftOrProcessing && release.platforms.length > 0 && (
          <p className="mt-3 text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Distribution managed via LabelGrid — connect API to enable delivery tracking.
          </p>
        )}
      </div>
    </Sheet>
  )
}
