import { getRoyaltySummary, getRoyaltyStatements } from '@/lib/labelgrid'
import SummaryStrip from '@/components/features/royalties/SummaryStrip'
import PlatformBreakdown from '@/components/features/royalties/PlatformBreakdown'
import TopArtists from '@/components/features/royalties/TopArtists'
import PayoutTable from '@/components/features/royalties/PayoutTable'

const PERIOD_PILLS: { label: string; days: 30 | 90 | 365 }[] = [
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
]

export default async function RoyaltiesPage() {
  const [summary, statements] = await Promise.all([
    getRoyaltySummary(90),
    getRoyaltyStatements(),
  ])

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-xs text-white/40 uppercase tracking-wider font-medium">
            Label overview
          </p>
          <h1 className="mt-0.5 text-2xl font-semibold text-white">Royalties</h1>
        </div>

        {/* Period pills — scrollable on very small screens as fallback */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-shrink-0">
          {PERIOD_PILLS.map(({ label, days }) => {
            const active = days === summary.periodDays
            return (
              <button
                key={label}
                className="rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0 transition-colors"
                style={{
                  background: active
                    ? 'var(--primary)'
                    : 'color-mix(in oklch, var(--primary) 10%, transparent)',
                  color: active ? 'var(--primary-foreground)' : 'var(--primary)',
                  border: '1px solid color-mix(in oklch, var(--primary) 30%, transparent)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary strip */}
      <SummaryStrip summary={summary} />

      {/* Two-column: platform breakdown + top artists */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 min-w-0">
        <PlatformBreakdown platforms={summary.revenueByPlatform} />
        <TopArtists artists={summary.topArtists} />
      </div>

      {/* Payout table */}
      <PayoutTable statements={statements} />
    </div>
  )
}
