'use client'

import { useState } from 'react'

const PERIODS = ['30d', '90d', 'YTD', 'All time'] as const
type Period = (typeof PERIODS)[number]

export default function PeriodPills({ active: initialActive }: { active: Period }) {
  const [active, setActive] = useState<Period>(initialActive)

  return (
    <div
      className="flex items-center gap-1 rounded-lg p-1 flex-shrink-0"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => setActive(p)}
          className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            background: active === p ? 'var(--surface-2)' : 'transparent',
            color: active === p ? 'var(--primary)' : 'rgba(255,255,255,0.45)',
          }}
        >
          {p}
        </button>
      ))}
    </div>
  )
}
