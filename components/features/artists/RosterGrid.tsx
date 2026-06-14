'use client'

import { useState } from 'react'
import type { Artist, Release } from '@/lib/types'
import ArtistDetail from './ArtistDetail'

interface RosterGridProps {
  artists: Artist[]
  releases: Release[]
}

function fmtListeners(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}

export default function RosterGrid({ artists, releases }: RosterGridProps) {
  const [selected, setSelected] = useState<Artist | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <button
            key={artist.id}
            onClick={() => setSelected(artist)}
            className="text-left rounded-xl p-5 flex flex-col gap-3 transition-opacity hover:opacity-80 min-w-0"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {/* Avatar + name */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
                  color: 'var(--accent)',
                }}
              >
                {artist.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{artist.name}</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {artist.splitPercentage}% split
                </p>
              </div>
            </div>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-1.5">
              {artist.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between min-w-0">
              <span
                className="text-xs tabular-nums"
                style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}
              >
                {artist.releaseCount} rel.
              </span>
              {artist.monthlyListeners != null && (
                <span
                  className="text-xs tabular-nums font-medium"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}
                >
                  {fmtListeners(artist.monthlyListeners)}/mo
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <ArtistDetail
          artist={selected}
          releases={releases.filter((r) => r.artistId === selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
