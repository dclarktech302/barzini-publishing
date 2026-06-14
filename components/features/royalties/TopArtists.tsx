import type { ArtistRoyalty } from '@/lib/types'

interface TopArtistsProps {
  artists: ArtistRoyalty[]
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function TopArtists({ artists }: TopArtistsProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col min-w-0"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-sm font-semibold text-white mb-4">Top Artists</h3>
      <div className="flex flex-col gap-1 min-w-0">
        {artists.map((artist, i) => {
          const isPositive = artist.deltaPercent >= 0
          return (
            <div
              key={artist.artistId}
              className="flex items-center gap-3 py-2.5 min-w-0"
              style={{ borderBottom: i < artists.length - 1 ? '1px solid var(--border)' : undefined }}
            >
              {/* Rank */}
              <span className="text-xs text-white/30 w-4 flex-shrink-0 text-center font-medium">
                {i + 1}
              </span>

              {/* Avatar */}
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
                  color: 'var(--accent)',
                }}
              >
                {artist.initials}
              </div>

              {/* Name + meta — min-w-0 to allow truncation */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{artist.artistName}</p>
                <p className="text-[11px] text-white/40">
                  <span>{artist.splitPercentage}% split</span>
                  <span className="mx-1">·</span>
                  <span className="hidden sm:inline">{artist.releaseCount} releases</span>
                  <span className="sm:hidden">{artist.releaseCount} rel.</span>
                </p>
              </div>

              {/* Amount + delta */}
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-semibold text-white tabular-nums">
                  {fmt(artist.royaltyOwed)}
                </p>
                <p
                  className="text-[11px] tabular-nums font-medium"
                  style={{ color: isPositive ? 'var(--primary)' : '#f87171' }}
                >
                  {isPositive ? '+' : ''}{artist.deltaPercent.toFixed(1)}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
