'use client'

import { useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import type { DistributionChannel, SyncEvent } from '@/lib/types'
import ChannelList from '@/components/features/distribution/ChannelList'
import SyncLog from '@/components/features/distribution/SyncLog'

interface Props {
  channels: DistributionChannel[]
  events: SyncEvent[]
}

export default function DistributionClient({ channels: initial, events }: Props) {
  const [channels, setChannels] = useState<DistributionChannel[]>(initial)
  const [syncState, setSyncState] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSyncAll = useCallback(async () => {
    setSyncState('loading')
    await new Promise((r) => setTimeout(r, 1200))
    setSyncState('done')
    setTimeout(() => setSyncState('idle'), 3500)
  }, [])

  const handleReconnect = useCallback(async (platform: string) => {
    await new Promise((r) => setTimeout(r, 1200))
    setChannels((prev) =>
      prev.map((c) =>
        c.platform === platform
          ? { ...c, connected: true, status: 'healthy' as const, errorMessage: undefined }
          : c,
      ),
    )
  }, [])

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {/* Sync all bar */}
      <div className="flex items-center justify-end gap-3">
        {syncState === 'done' && (
          <span className="text-xs" style={{ color: 'var(--primary)' }}>
            Sync requested
          </span>
        )}
        <button
          onClick={handleSyncAll}
          disabled={syncState === 'loading'}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-60 hover:opacity-80"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <RefreshCw
            size={14}
            strokeWidth={2}
            className={syncState === 'loading' ? 'animate-spin' : ''}
          />
          Sync all
        </button>
      </div>

      <ChannelList channels={channels} onReconnect={handleReconnect} />
      <SyncLog events={events} />
    </div>
  )
}
