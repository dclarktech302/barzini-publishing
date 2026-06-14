import type { PlatformRevenue } from '@/lib/types'

interface PlatformBreakdownProps {
  platforms: PlatformRevenue[]
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function PlatformBreakdown({ platforms }: PlatformBreakdownProps) {
  const max = Math.max(...platforms.map((p) => p.revenue))
  // Gold highlight on the highest-volume platform row
  const topPlatform = platforms.reduce((a, b) => (a.revenue > b.revenue ? a : b)).platform

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col min-w-0"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Gradient hairline */}
      <div
        className="h-px w-full flex-shrink-0"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--accent) 20%, var(--primary) 80%, transparent)',
        }}
      />

      <div className="p-5 flex flex-col gap-4 min-w-0">
        <h3 className="text-sm font-semibold text-white">Revenue by Platform</h3>

        <div className="flex flex-col gap-3 min-w-0">
          {platforms.map(({ platform, revenue }) => {
            const pct = max > 0 ? (revenue / max) * 100 : 0
            const isTop = platform === topPlatform
            const barColor = isTop ? 'var(--accent)' : 'var(--primary)'
            const labelColor = isTop ? 'var(--accent)' : 'rgba(255,255,255,0.55)'

            return (
              <div
                key={platform}
                className="grid items-center gap-3 min-w-0"
                style={{ gridTemplateColumns: 'minmax(0,80px) 1fr minmax(0,70px)' }}
              >
                <span
                  className="text-xs truncate font-medium"
                  style={{ color: labelColor }}
                >
                  {platform}
                </span>
                <div
                  className="h-1.5 rounded-full overflow-hidden min-w-0"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: barColor,
                      minWidth: pct > 0 ? '4px' : undefined,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-medium text-right tabular-nums"
                  style={{ fontFamily: 'var(--font-mono)', color: 'white' }}
                >
                  {fmt(revenue)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
