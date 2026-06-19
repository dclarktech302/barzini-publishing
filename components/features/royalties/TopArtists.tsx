'use client'

import type { ArtistRoyalty } from '@/lib/types'

interface TopArtistsProps {
  artists: ArtistRoyalty[]
  onArtistClick?: (artistId: string) => void
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function TopArtists({ artists, onArtistClick }: TopArtistsProps) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col min-w-0"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div
        className="h-px w-full flex-shrink-0"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--accent) 20%, var(--primary) 80%, transparent)',
        }}
      />

      <div className="p-5 flex flex-col gap-0 min-w-0">
        <h3 className="text-sm font-semibold text-white mb-3">Top Artists</h3>

        {artists.map((artist, i) => {
          const isPositive = artist.deltaPercent > 0
          const isNegative = artist.deltaPercent < 0
          const deltaColor = isPositive ? 'var(--primary)' : isNegative ? 'var(--coral)' : 'rgba(255,255,255,0.4)'
          const deltaBg = isPositive
            ? 'rgba(61,219,184,0.1)'
            : isNegative
              ? 'var(--coral-dim)'
              : 'var(--surface-2)'

          const row = (
            <div className="flex items-center gap-3 min-w-0 w-full">
              <span
                className="text-xs w-4 flex-shrink-0 text-center font-medium"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}
              >
                {i + 1}
              </span>
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
                  color: 'var(--accent)',
                }}
              >
                {artist.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{artist.artistName}</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <span>{artist.splitPercentage}% split</span>
                  <span className="mx-1">·</span>
                  <span className="hidden sm:inline">{artist.releaseCount} releases</span>
                  <span className="sm:hidden">{artist.releaseCount} rel.</span>
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p
                  className="text-sm font-medium text-white tabular-nums"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {fmt(artist.royaltyOwed)}
                </p>
                <span
                  className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
                  style={{ color: deltaColor, background: deltaBg, fontFamily: 'var(--font-mono)' }}
                >
                  {isPositive ? '+' : ''}{artist.deltaPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          )

          return onArtistClick ? (
            <button
              key={artist.artistId}
              onClick={() => onArtistClick(artist.artistId)}
              className="flex items-center gap-3 py-3 min-w-0 w-full text-left transition-opacity hover:opacity-75"
              style={{
                borderBottom: i < artists.length - 1 ? '1px solid var(--border)' : undefined,
              }}
            >
              {row}
            </button>
          ) : (
            <div
              key={artist.artistId}
              className="flex items-center gap-3 py-3 min-w-0"
              style={{
                borderBottom: i < artists.length - 1 ? '1px solid var(--border)' : undefined,
              }}
            >
              {row}
            </div>
          )
        })}
      </div>
    </div>
  )
}
