import { getArtists, getReleases } from '@/lib/labelgrid'
import RosterGrid from '@/components/features/artists/RosterGrid'

const GENRE_FILTERS = ['All', 'Indie Folk', 'Dream Pop', 'Electronic', 'Americana', 'Noise Pop']
const STATUS_FILTERS = ['All', 'Active', 'Inactive']

export default async function ArtistsPage() {
  const [artists, releases] = await Promise.all([getArtists(), getReleases()])

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {/* Page header */}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider font-medium"
           style={{ color: 'var(--accent)' }}>
          Artists
        </p>
        <h1 className="mt-0.5 text-2xl font-semibold text-white">Artist Roster</h1>
      </div>

      {/* Filter bar — horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 flex-nowrap">
        {GENRE_FILTERS.map((g, i) => (
          <button
            key={g}
            className="rounded-full px-3 py-1 text-xs font-medium flex-shrink-0 transition-colors"
            style={{
              background: i === 0 ? 'var(--primary)' : 'var(--surface-2)',
              color: i === 0 ? 'var(--primary-foreground)' : 'rgba(255,255,255,0.55)',
              border: `1px solid ${i === 0 ? 'transparent' : 'var(--border)'}`,
            }}
          >
            {g}
          </button>
        ))}
        <div
          className="w-px flex-shrink-0 self-stretch my-0.5"
          style={{ background: 'var(--border)' }}
        />
        {STATUS_FILTERS.map((s, i) => (
          <button
            key={s}
            className="rounded-full px-3 py-1 text-xs font-medium flex-shrink-0"
            style={{
              background: i === 0 ? 'var(--surface-2)' : 'transparent',
              color: i === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
              border: `1px solid var(--border)`,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Roster grid */}
      <RosterGrid artists={artists} releases={releases} />
    </div>
  )
}
