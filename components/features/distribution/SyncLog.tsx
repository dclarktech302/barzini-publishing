import { Upload, RefreshCw, AlertCircle, Banknote } from 'lucide-react'
import type { SyncEvent } from '@/lib/types'

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function EventIcon({ eventType }: { eventType: SyncEvent['eventType'] }) {
  const props = { size: 14, strokeWidth: 1.8 }
  if (eventType === 'delivery') return <Upload {...props} style={{ color: 'var(--primary)' }} />
  if (eventType === 'sync') return <RefreshCw {...props} style={{ color: 'rgba(255,255,255,0.45)' }} />
  if (eventType === 'error') return <AlertCircle {...props} style={{ color: 'var(--coral)' }} />
  return <Banknote {...props} style={{ color: 'var(--accent)' }} />
}

export default function SyncLog({ events }: { events: SyncEvent[] }) {
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
        <h3 className="text-sm font-semibold text-white mb-4">Activity log</h3>
        <div className="flex flex-col">
          {events.map((event, i) => (
            <div key={event.id} className="flex gap-3 min-w-0">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <EventIcon eventType={event.eventType} />
                </div>
                {i < events.length - 1 && (
                  <div className="w-px flex-1 my-1" style={{ background: 'var(--border)' }} />
                )}
              </div>
              <div className="pb-4 min-w-0 flex-1">
                <p
                  className="text-sm leading-snug"
                  style={{
                    color: event.eventType === 'error' ? 'var(--coral)' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  {event.message}
                </p>
                <p
                  className="text-xs mt-0.5 tabular-nums"
                  style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)' }}
                >
                  {relativeTime(event.occurredAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
