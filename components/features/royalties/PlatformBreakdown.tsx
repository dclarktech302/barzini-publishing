import type { PlatformRevenue } from '@/lib/types'

interface PlatformBreakdownProps {
  platforms: PlatformRevenue[]
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function PlatformBreakdown({ platforms }: PlatformBreakdownProps) {
  const max = Math.max(...platforms.map((p) => p.revenue))

  return (
    <div
      className="rounded-xl p-5 flex flex-col min-w-0"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-sm font-semibold text-white mb-4">Revenue by Platform</h3>
      <div className="flex flex-col gap-3 min-w-0">
        {platforms.map(({ platform, revenue }) => {
          const pct = max > 0 ? (revenue / max) * 100 : 0
          return (
            <div
              key={platform}
              className="grid items-center gap-3 min-w-0"
              style={{
                gridTemplateColumns: 'minmax(0, 80px) 1fr minmax(0, 70px)',
              }}
            >
              <span className="text-xs text-white/60 truncate">{platform}</span>
              <div
                className="h-1.5 rounded-full overflow-hidden min-w-0"
                style={{ background: 'var(--surface-2)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: 'var(--primary)',
                    minWidth: pct > 0 ? '4px' : undefined,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-white tabular-nums text-right">
                {fmt(revenue)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
