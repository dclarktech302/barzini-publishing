'use client'

import { useState, useCallback } from 'react'
import type { DistributionChannel, SyncEvent } from '@/lib/types'
import ChannelList from '@/components/features/distribution/ChannelList'
import SyncLog from '@/components/features/distribution/SyncLog'

interface Props {
  channels: DistributionChannel[]
  events: SyncEvent[]
}

export default function DistributionClient({ channels: initial, events }: Props) {
  const [channels, setChannels] = useState<DistributionChannel[]>(initial)

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
      <ChannelList channels={channels} onReconnect={handleReconnect} />
      <SyncLog events={events} />
    </div>
  )
}
