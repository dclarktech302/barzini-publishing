'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  date: string
  streams: number
}

function fmtStreams(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'k'
  return String(n)
}

function fmtLabel(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function StreamsChart({ data }: { data: DataPoint[] }) {
  // Sparse ticks: show ~6 labels regardless of range
  const tickCount = 6
  const step = Math.max(1, Math.floor(data.length / tickCount))
  const ticks = data.filter((_, i) => i % step === 0 || i === data.length - 1).map((d) => d.date)

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
        <h3 className="text-sm font-semibold text-white mb-4">Daily streams</h3>
        <div className="h-[200px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                ticks={ticks}
                tickFormatter={fmtLabel}
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                tickFormatter={fmtStreams}
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div
                      className="rounded-lg px-3 py-2 text-xs"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      }}
                    >
                      <p style={{ color: 'rgba(255,255,255,0.45)' }}>{fmtLabel(label as string)}</p>
                      <p
                        className="mt-0.5 font-medium tabular-nums"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}
                      >
                        {(payload[0].value as number).toLocaleString()} streams
                      </p>
                    </div>
                  )
                }}
              />
              <Line
                type="monotone"
                dataKey="streams"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: 'var(--primary)', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
