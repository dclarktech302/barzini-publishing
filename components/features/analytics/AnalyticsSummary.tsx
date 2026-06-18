import type { PlatformRevenue } from '@/lib/types'

interface AnalyticsSummaryProps {
  platforms: PlatformRevenue[]
  timeseries: { date: string; streams: number }[]
  days?: number
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const w = 100
  const h = 24
  const pad = 2
  const pts = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * (w - pad * 2) + pad
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: '24px' }} aria-hidden>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

export default function AnalyticsSummary({ platforms, timeseries, days = 90 }: AnalyticsSummaryProps) {
  const totalStreams = platforms.reduce((s, p) => s + p.streams, 0)
  const totalRevenue = platforms.reduce((s, p) => s + p.revenue, 0)
  const avgDaily = timeseries.length > 0 ? Math.round(totalStreams / days) : 0
  const newListeners = Math.round(totalStreams * 0.18)

  const streamPoints = timeseries.map((d) => d.streams)
  // Downsample sparkline to ~12 points
  const step = Math.max(1, Math.floor(streamPoints.length / 12))
  const spark = streamPoints.filter((_, i) => i % step === 0)

  const cells = [
    {
      label: 'Total streams',
      value: (totalStreams / 1_000_000).toFixed(2) + 'M',
      spark,
      sparkColor: 'var(--primary)',
      delta: { value: '+9.4%', positive: true as boolean | null },
    },
    {
      label: 'Total revenue',
      value: '$' + totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      spark: spark.map((v) => v * 0.000012),
      sparkColor: 'var(--primary)',
      delta: { value: '+11.8%', positive: true as boolean | null },
    },
    {
      label: 'Avg daily streams',
      value: (avgDaily / 1_000).toFixed(0) + 'k',
      spark: spark.map((v, i) => v + i * 10),
      sparkColor: 'var(--primary)',
      delta: { value: '+6.2%', positive: true as boolean | null },
    },
    {
      label: 'Est. new listeners',
      value: (newListeners / 1_000).toFixed(0) + 'k',
      spark: spark.map((v) => v * 0.18),
      sparkColor: 'var(--accent)',
      delta: { value: '+3.1%', positive: true as boolean | null },
    },
  ]

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--accent) 20%, var(--primary) 80%, transparent)',
        }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cells.map(({ label, value, spark: sparkPts, sparkColor, delta }, i) => {
          const isLast = i === cells.length - 1
          const deltaStyle =
            delta.positive === true
              ? { color: 'var(--primary)', background: 'rgba(61,219,184,0.1)' }
              : delta.positive === false
                ? { color: 'var(--coral)', background: 'var(--coral-dim)' }
                : { color: 'rgba(255,255,255,0.4)', background: 'var(--surface-2)' }

          return (
            <div
              key={label}
              className="px-5 pt-5 pb-4 flex flex-col gap-0 min-w-0"
              style={{ borderBottom: !isLast ? '1px solid var(--border)' : undefined }}
            >
              <p
                className="text-[11px] uppercase tracking-widest font-medium"
                style={{ color: 'rgba(255,255,255,0.38)' }}
              >
                {label}
              </p>
              <p
                className="mt-2 text-[1.75rem] font-medium leading-none"
                style={{ fontFamily: 'var(--font-mono)', color: 'white' }}
              >
                {value}
              </p>
              <div className="mt-2 w-full">
                <Sparkline points={sparkPts} color={sparkColor} />
              </div>
              <div className="mt-1.5">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={deltaStyle}
                >
                  {delta.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
