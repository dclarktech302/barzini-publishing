import type { RoyaltyStatement } from '@/lib/types'

interface PayoutTableProps {
  statements: RoyaltyStatement[]
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function fmtPeriod(start: string, end: string) {
  const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const e = new Date(end).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return `${s} – ${e}`
}

// paid → teal, pending → gold, processing → neutral
const STATUS_STYLES: Record<
  RoyaltyStatement['status'],
  { label: string; color: string; bg: string }
> = {
  paid: {
    label: 'Paid',
    color: 'var(--primary)',
    bg: 'rgba(61,219,184,0.1)',
  },
  pending: {
    label: 'Pending',
    color: 'var(--accent)',
    bg: 'color-mix(in oklch, var(--accent) 12%, transparent)',
  },
  processing: {
    label: 'Processing',
    color: 'rgba(255,255,255,0.5)',
    bg: 'var(--surface-2)',
  },
}

function StatusPill({ status }: { status: RoyaltyStatement['status'] }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  )
}

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

export default function PayoutTable({ statements }: PayoutTableProps) {
  const nextPayout = statements.find((s) => s.scheduledPayoutDate)

  return (
    <div
      className="rounded-xl overflow-hidden min-w-0"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      {/* Gradient hairline */}
      <div
        className="h-px w-full flex-shrink-0"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--accent) 20%, var(--primary) 80%, transparent)',
        }}
      />

      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold text-white">Payout History</h3>
      </div>

      {/* ── MOBILE: card list (< md) ── */}
      <div className="block md:hidden">
        {statements.map((s) => (
          <div
            key={s.id}
            className="mx-4 mb-3 rounded-lg p-4 flex flex-col gap-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {/* Row 1: artist + status */}
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-sm font-semibold text-white truncate">{s.artistName}</span>
              <StatusPill status={s.status} />
            </div>
            {/* Row 2: period + royalty */}
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>
                {fmtPeriod(s.periodStart, s.periodEnd)}
              </span>
              <span
                className="text-base font-medium text-white tabular-nums flex-shrink-0"
                style={mono}
              >
                {fmt(s.royaltyOwed)}
              </span>
            </div>
            {/* Row 3: gross + split + date */}
            <div
              className="flex items-center gap-3 text-[11px]"
              style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-mono)' }}
            >
              <span>Gross {fmt(s.grossRevenue)}</span>
              <span>·</span>
              <span>{s.splitPercentage}%</span>
              {s.paidAt && (
                <>
                  <span>·</span>
                  <span>{fmtDate(s.paidAt)}</span>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="h-1" />
      </div>

      {/* ── DESKTOP: table (md+) ── */}
      <div className="hidden md:block min-w-0">
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                background: 'var(--surface-2)',
                borderTop: '1px solid var(--border)',
              }}
            >
              {['Artist', 'Period', 'Gross Revenue', 'Split', 'Royalty Owed', 'Status', 'Date'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {statements.map((s) => (
              <tr key={s.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td className="px-5 py-4 font-medium text-white max-w-[140px] truncate">
                  {s.artistName}
                </td>
                <td
                  className="px-5 py-4 whitespace-nowrap"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {fmtPeriod(s.periodStart, s.periodEnd)}
                </td>
                <td
                  className="px-5 py-4 tabular-nums"
                  style={{ ...mono, color: 'rgba(255,255,255,0.7)' }}
                >
                  {fmt(s.grossRevenue)}
                </td>
                <td
                  className="px-5 py-4 tabular-nums"
                  style={{ ...mono, color: 'rgba(255,255,255,0.5)' }}
                >
                  {s.splitPercentage}%
                </td>
                <td
                  className="px-5 py-4 font-medium text-white tabular-nums"
                  style={mono}
                >
                  {fmt(s.royaltyOwed)}
                </td>
                <td className="px-5 py-4">
                  <StatusPill status={s.status} />
                </td>
                <td
                  className="px-5 py-4 whitespace-nowrap"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {s.paidAt
                    ? fmtDate(s.paidAt)
                    : s.scheduledPayoutDate
                      ? fmtDate(s.scheduledPayoutDate)
                      : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Showing {statements.length} of {statements.length} statements
        </span>
        {nextPayout?.scheduledPayoutDate && (
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Next payout:{' '}
            <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              {fmtDate(nextPayout.scheduledPayoutDate)}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
