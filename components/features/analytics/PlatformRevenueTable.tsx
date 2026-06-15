import type { PlatformRevenue } from '@/lib/types'

function fmtRevenue(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtStreams(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'k'
  return String(n)
}

export default function PlatformRevenueTable({ platforms }: { platforms: PlatformRevenue[] }) {
  const maxRevenue = Math.max(...platforms.map((p) => p.revenue))
  const top = platforms.reduce((a, b) => (a.revenue > b.revenue ? a : b)).platform

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--accent) 20%, var(--primary) 80%, transparent)',
        }}
      />
      <div className="p-4 md:p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Revenue by platform</h3>

        <div className="flex flex-col gap-3">
          {platforms.map(({ platform, revenue, streams }) => {
            const pct = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0
            const isTop = platform === top
            const barColor = isTop ? 'var(--accent)' : 'var(--primary)'
            const labelColor = isTop ? 'var(--accent)' : 'rgba(255,255,255,0.55)'

            return (
              <div key={platform} className="flex flex-col gap-1 min-w-0">
                {/* Mobile: name + secondary streams line */}
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <span
                      className="text-xs font-medium truncate block"
                      style={{ color: labelColor }}
                    >
                      {platform}
                    </span>
                    {/* Streams as secondary on mobile, hidden on md+ where it's in the grid */}
                    <span
                      className="md:hidden text-[10px] tabular-nums"
                      style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' }}
                    >
                      {fmtStreams(streams)} streams
                    </span>
                  </div>
                  {/* Desktop: streams column inline */}
                  <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                    <span
                      className="text-xs tabular-nums"
                      style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}
                    >
                      {fmtStreams(streams)}
                    </span>
                    <span
                      className="text-xs font-medium tabular-nums w-16 text-right"
                      style={{ fontFamily: 'var(--font-mono)', color: 'white' }}
                    >
                      {fmtRevenue(revenue)}
                    </span>
                  </div>
                  {/* Mobile: revenue only */}
                  <span
                    className="md:hidden text-xs font-medium tabular-nums flex-shrink-0"
                    style={{ fontFamily: 'var(--font-mono)', color: 'white' }}
                  >
                    {fmtRevenue(revenue)}
                  </span>
                </div>
                {/* Bar */}
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: barColor,
                      minWidth: pct > 0 ? '4px' : undefined,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
