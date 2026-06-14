import type { RoyaltySummary } from '@/lib/types'

interface SummaryStripProps {
  summary: RoyaltySummary
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function SummaryStrip({ summary }: SummaryStripProps) {
  const cells = [
    { label: 'Total Revenue', value: fmt(summary.totalRevenue) },
    { label: 'Artist Royalties Owed', value: fmt(summary.artistRoyaltiesOwed) },
    { label: 'Pending Payouts', value: fmt(summary.pendingPayouts) },
    { label: 'Label Retained', value: fmt(summary.labelRetained) },
  ]

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      {/* Gold-to-teal gradient top line */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(to right, var(--accent), var(--primary))' }}
      />
      {/* 1-col mobile, 2-col sm, 4-col lg */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{ borderColor: 'var(--border)' }}
      >
        {cells.map(({ label, value }, i) => (
          <div
            key={label}
            className="px-5 py-5"
            style={{
              borderBottom: i < cells.length - 1 ? '1px solid var(--border)' : undefined,
            }}
          >
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium leading-none">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
