'use client'

import { useState } from 'react'
import type { Release } from '@/lib/types'
import ReleaseRow from './ReleaseRow'
import ReleaseDetail from './ReleaseDetail'

interface PipelineBoardProps {
  releases: Release[]
}

type StatusGroup = {
  key: Release['status']
  label: string
  color: string
}

const GROUPS: StatusGroup[] = [
  { key: 'live', label: 'Live', color: 'var(--primary)' },
  { key: 'scheduled', label: 'Scheduled', color: 'var(--accent)' },
  { key: 'processing', label: 'Processing', color: 'rgba(255,255,255,0.45)' },
  { key: 'draft', label: 'Draft', color: 'rgba(255,255,255,0.2)' },
]

export default function PipelineBoard({ releases }: PipelineBoardProps) {
  const [selected, setSelected] = useState<Release | null>(null)

  return (
    <>
      {/* Mobile / tablet: stacked sections (<lg) */}
      <div className="flex flex-col gap-6 lg:hidden">
        {GROUPS.map(({ key, label, color }) => {
          const group = releases.filter((r) => r.status === key)
          return (
            <section key={key} className="min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
                  {label}
                </h2>
                <span
                  className="text-[11px] rounded-full px-1.5 py-0.5"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {group.length}
                </span>
              </div>
              {group.length === 0 ? (
                <p className="text-xs pl-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  No releases
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {group.map((r) => (
                    <ReleaseRow key={r.id} release={r} onClick={() => setSelected(r)} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Desktop: 4-column kanban (lg+) */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4 min-w-0">
        {GROUPS.map(({ key, label, color }) => {
          const group = releases.filter((r) => r.status === key)
          return (
            <div key={key} className="flex flex-col min-w-0">
              {/* Column header */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-t-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderBottom: 'none' }}
              >
                <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider flex-1" style={{ color }}>
                  {label}
                </h2>
                <span
                  className="text-[11px] rounded-full px-1.5 py-0.5"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {group.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="flex flex-col gap-2 p-3 rounded-b-lg flex-1"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  minHeight: '120px',
                }}
              >
                {group.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    Empty
                  </p>
                ) : (
                  group.map((r) => (
                    <ReleaseRow key={r.id} release={r} onClick={() => setSelected(r)} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <ReleaseDetail release={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
