'use client'

import { useState } from 'react'
import type { DistributionChannel } from '@/lib/types'

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function StatusDot({ status }: { status: DistributionChannel['status'] }) {
  const color =
    status === 'healthy'
      ? 'var(--primary)'
      : status === 'warning'
        ? 'var(--accent)'
        : 'var(--coral)'
  return (
    <span
      className="inline-block h-2 w-2 rounded-full flex-shrink-0"
      style={{ background: color }}
    />
  )
}

function PlatformInitial({ name }: { name: string }) {
  return (
    <div
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
      style={{
        background: 'var(--surface-2)',
        color: 'rgba(255,255,255,0.6)',
        border: '1px solid var(--border)',
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

function ExpandedError({
  message,
  platform,
  onReconnect,
}: {
  message: string
  platform: string
  onReconnect: (platform: string) => void
}) {
  return (
    <div
      className="rounded-lg p-3 flex items-start justify-between gap-3"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs leading-relaxed" style={{ color: 'var(--coral)' }}>
        {message}
      </p>
      <button
        onClick={() => onReconnect(platform)}
        className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        Reconnect
      </button>
    </div>
  )
}

function ChannelRow({
  channel,
  onReconnect,
}: {
  channel: DistributionChannel
  onReconnect: (platform: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isActionable = channel.status === 'warning' || channel.status === 'error'

  return (
    <div>
      {/* Mobile card */}
      <div
        className="md:hidden rounded-xl p-4 flex flex-col gap-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <PlatformInitial name={channel.platform} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{channel.platform}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {relativeTime(channel.lastSyncAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-xs font-medium tabular-nums"
              style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.5)' }}
            >
              {channel.deliveryCount} live
            </span>
            <StatusDot status={channel.status} />
          </div>
        </div>
        {isActionable && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-left text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            {expanded ? 'Hide details' : 'Show details'}
          </button>
        )}
        {expanded && channel.errorMessage && (
          <ExpandedError
            message={channel.errorMessage}
            platform={channel.platform}
            onReconnect={onReconnect}
          />
        )}
      </div>

      {/* Desktop row */}
      <div className="hidden md:block">
        <div
          className="grid items-center gap-4 px-5 py-3.5"
          style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <PlatformInitial name={channel.platform} />
            <span className="text-sm font-medium text-white truncate">{channel.platform}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status={channel.status} />
            <span
              className="text-xs capitalize"
              style={{
                color:
                  channel.status === 'healthy'
                    ? 'var(--primary)'
                    : channel.status === 'warning'
                      ? 'var(--accent)'
                      : 'var(--coral)',
              }}
            >
              {channel.status}
            </span>
          </div>
          <span
            className="text-xs tabular-nums"
            style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}
          >
            {relativeTime(channel.lastSyncAt)}
          </span>
          <div className="flex items-center gap-4">
            <span
              className="text-xs font-medium tabular-nums"
              style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.55)' }}
            >
              {channel.deliveryCount} live
            </span>
            {isActionable && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-xs font-medium transition-opacity hover:opacity-70 flex-shrink-0"
                style={{ color: 'var(--accent)' }}
              >
                {expanded ? 'Hide' : 'Details'}
              </button>
            )}
          </div>
        </div>
        {expanded && channel.errorMessage && (
          <div className="px-5 pb-4">
            <ExpandedError
              message={channel.errorMessage}
              platform={channel.platform}
              onReconnect={onReconnect}
            />
          </div>
        )}
        <div className="h-px mx-5" style={{ background: 'var(--border)' }} />
      </div>
    </div>
  )
}

export default function ChannelList({
  channels,
  onReconnect,
}: {
  channels: DistributionChannel[]
  onReconnect: (platform: string) => void
}) {
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
      {/* Desktop header */}
      <div
        className="hidden md:grid items-center gap-4 px-5 py-3"
        style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}
      >
        {['Platform', 'Status', 'Last sync', 'Deliveries'].map((h) => (
          <span
            key={h}
            className="text-[11px] uppercase tracking-wider font-medium"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {h}
          </span>
        ))}
      </div>
      <div className="hidden md:block h-px" style={{ background: 'var(--border)' }} />

      <div className="flex flex-col gap-3 p-3 md:p-0 md:gap-0">
        {channels.map((channel) => (
          <ChannelRow key={channel.platform} channel={channel} onReconnect={onReconnect} />
        ))}
      </div>
    </div>
  )
}
