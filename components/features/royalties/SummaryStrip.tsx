import type { RoyaltySummary } from '@/lib/types'

interface SummaryStripProps {
  summary: RoyaltySummary
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

// Simple inline sparkline — 100x24 viewBox polyline, no fill
function Sparkline({
  color,
  points,
}: {
  color: string
  points: [number, number][]
}) {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const rangeX = maxX - minX || 1
  const rangeY = maxY - minY || 1
  const w = 100
  const h = 24
  const pad = 2

  const pts = points
    .map(([x, y]) => {
      const nx = ((x - minX) / rangeX) * (w - pad * 2) + pad
      const ny = h - pad - ((y - minY) / rangeY) * (h - pad * 2)
      return `${nx.toFixed(1)},${ny.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      style={{ height: '24px', overflow: 'visible' }}
      aria-hidden
    >
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

// Mock sparkline data — 7-point series, up/flat/down patterns
const SPARKLINES: Record<string, [number, number][]> = {
  revenue: [[0,18],[1,22],[2,20],[3,25],[4,23],[5,27],[6,29]],
  royalties: [[0,11],[1,13],[2,12],[3,15],[4,14],[5,17],[6,18]],
  payouts: [[0,4],[1,6],[2,5],[3,7],[4,6],[5,6],[6,6]],
  retained: [[0,7],[1,8],[2,8],[3,10],[4,9],[5,10],[6,11]],
}

const DELTA_MOCK = [
  { value: '+14.2%', positive: true },
  { value: '+8.6%', positive: true },
  { value: '0.0%', positive: null },
  { value: '+11.3%', positive: true },
]

export default function SummaryStrip({ summary }: SummaryStripProps) {
  const cells = [
    {
      label: 'Total Revenue',
      value: fmt(summary.totalRevenue),
      spark: 'revenue',
      sparkColor: 'var(--primary)',
      delta: DELTA_MOCK[0],
    },
    {
      label: 'Artist Royalties Owed',
      value: fmt(summary.artistRoyaltiesOwed),
      spark: 'royalties',
      sparkColor: 'var(--accent)',
      delta: DELTA_MOCK[1],
    },
    {
      label: 'Pending Payouts',
      value: fmt(summary.pendingPayouts),
      spark: 'payouts',
      sparkColor: 'var(--primary)',
      delta: DELTA_MOCK[2],
    },
    {
      label: 'Label Retained',
      value: fmt(summary.labelRetained),
      spark: 'retained',
      sparkColor: 'var(--primary)',
      delta: DELTA_MOCK[3],
    },
  ]

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      {/* Gold-to-teal gradient hairline — top edge only */}
      <div
        className="h-px w-full flex-shrink-0"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--accent) 20%, var(--primary) 80%, transparent)',
        }}
      />

      {/* Flat strip: 1-col mobile, 2-col sm, 4-col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cells.map(({ label, value, spark, sparkColor, delta }, i) => {
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
              style={{
                borderBottom: !isLast ? '1px solid var(--border)' : undefined,
                borderRight: undefined,
              }}
            >
              {/* Label */}
              <p
                className="text-[11px] uppercase tracking-widest font-medium"
                style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.08em' }}
              >
                {label}
              </p>

              {/* Value — DM Mono */}
              <p
                className="mt-2 text-[1.75rem] font-medium leading-none"
                style={{ fontFamily: 'var(--font-mono)', color: 'white' }}
              >
                {value}
              </p>

              {/* Sparkline */}
              <div className="mt-2 w-full">
                <Sparkline color={sparkColor} points={SPARKLINES[spark]} />
              </div>

              {/* Delta pill */}
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
