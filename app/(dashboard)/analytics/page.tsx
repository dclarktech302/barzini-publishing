import { getAnalyticsStreams, getStreamsTimeseries } from '@/lib/labelgrid'
import AnalyticsSummary from '@/components/features/analytics/AnalyticsSummary'
import StreamsChart from '@/components/features/analytics/StreamsChart'
import PlatformRevenueTable from '@/components/features/analytics/PlatformRevenueTable'
import PeriodPills from '@/components/features/analytics/PeriodPills'

export default async function AnalyticsPage() {
  const [platforms, timeseries] = await Promise.all([
    getAnalyticsStreams(90),
    getStreamsTimeseries(90),
  ])

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap min-w-0">
        <div className="min-w-0">
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Analytics
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Streaming analytics</h1>
        </div>
        <PeriodPills active="90d" />
      </div>

      <AnalyticsSummary platforms={platforms} timeseries={timeseries} />
      <StreamsChart data={timeseries} />
      <PlatformRevenueTable platforms={platforms} />
    </div>
  )
}
