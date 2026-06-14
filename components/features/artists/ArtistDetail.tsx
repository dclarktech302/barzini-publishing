'use client'

import type { Artist, Release } from '@/lib/types'
import Sheet from '@/components/ui/Sheet'

interface ArtistDetailProps {
  artist: Artist
  releases: Release[]
  onClose: () => void
}

const STATUS_DOT: Record<Release['status'], string> = {
  live: 'var(--primary)',
  scheduled: 'var(--accent)',
  processing: 'rgba(255,255,255,0.4)',
  draft: 'rgba(255,255,255,0.2)',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function fmtListeners(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}

export default function ArtistDetail({ artist, releases, onClose }: ArtistDetailProps) {
  const artistSplit = artist.splitPercentage
  const labelSplit = 100 - artistSplit

  return (
    <Sheet open title={artist.name} onClose={onClose}>
      {/* Avatar + meta */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold"
          style={{
            background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
            color: 'var(--accent)',
          }}
        >
          {artist.initials}
        </div>
        <div className="min-w-0">
          <p className="text-base font-semibold text-white">{artist.name}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {artist.genres.join(' · ')}
          </p>
          {artist.monthlyListeners != null && (
            <p
              className="text-xs tabular-nums mt-0.5"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}
            >
              {fmtListeners(artist.monthlyListeners)} monthly listeners
            </p>
          )}
        </div>
      </div>

      {/* Royalty split bar */}
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest font-medium mb-2"
           style={{ color: 'rgba(255,255,255,0.38)' }}>
          Royalty Split
        </p>
        <div className="flex rounded-full overflow-hidden h-2.5" style={{ background: 'var(--surface-2)' }}>
          <div
            style={{ width: `${artistSplit}%`, background: 'var(--accent)' }}
            className="h-full"
          />
          <div
            style={{ width: `${labelSplit}%`, background: 'var(--primary)' }}
            className="h-full"
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ color: 'var(--accent)' }}>Artist {artistSplit}%</span>
          <span style={{ color: 'var(--primary)' }}>Label {labelSplit}%</span>
        </div>
      </div>

      {/* Release history */}
      <div>
        <p className="text-[11px] uppercase tracking-widest font-medium mb-3"
           style={{ color: 'rgba(255,255,255,0.38)' }}>
          Releases ({releases.length})
        </p>
        {releases.length === 0 ? (
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No releases yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {releases.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-lg px-3 py-3 min-w-0"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
              >
                <div
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ background: STATUS_DOT[r.status] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.title}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    {r.type.charAt(0).toUpperCase() + r.type.slice(1)} · {fmtDate(r.releaseDate)}
                  </p>
                </div>
                <span
                  className="text-[11px] flex-shrink-0 capitalize"
                  style={{ color: STATUS_DOT[r.status] }}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  )
}
