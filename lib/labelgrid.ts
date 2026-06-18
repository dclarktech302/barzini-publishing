import type {
  Artist,
  DistributionChannel,
  Platform,
  PlatformRevenue,
  Release,
  ReleaseInsight,
  RoyaltyStatement,
  RoyaltySummary,
  SyncEvent,
} from '@/lib/types'

const LABELGRID_BASE = process.env.LABELGRID_API_URL ?? 'https://api.labelgrid.com'
const LABELGRID_KEY = process.env.LABELGRID_API_KEY ?? ''

class LabelGridError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'LabelGridError'
  }
}

async function lgFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${LABELGRID_BASE}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${LABELGRID_KEY}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new LabelGridError(res.status, text)
  }
  return res.json() as Promise<T>
}

// TODO: GET /releases — see groups/releases
export async function getReleases(): Promise<Release[]> {
  void lgFetch // will be used once wired
  return [
    {
      id: 'release-001',
      title: 'Midnight Tide',
      artistId: 'artist-001',
      artistName: 'Theo Marsh',
      type: 'single',
      status: 'live',
      releaseDate: '2025-02-14',
      smartLinkUrl: 'https://labelgrid.link/midnight-tide',
      platforms: [
        { name: 'spotify', status: 'live', lastSyncAt: '2025-02-14T10:00:00Z' },
        { name: 'apple_music', status: 'live', lastSyncAt: '2025-02-14T10:00:00Z' },
        { name: 'tidal', status: 'live', lastSyncAt: '2025-02-14T11:00:00Z' },
      ],
      labelgridId: 'lg-0101',
    },
    {
      id: 'release-002',
      title: 'Shoreline Sessions',
      artistId: 'artist-002',
      artistName: 'Coral & Vine',
      type: 'ep',
      status: 'scheduled',
      releaseDate: '2025-08-01',
      smartLinkUrl: 'https://labelgrid.link/shoreline-sessions',
      platforms: [
        { name: 'spotify', status: 'pending' },
        { name: 'apple_music', status: 'pending' },
        { name: 'youtube_music', status: 'pending' },
      ],
    },
    {
      id: 'release-003',
      title: 'Static Bloom',
      artistId: 'artist-003',
      artistName: 'Nine Rivers',
      type: 'album',
      status: 'draft',
      releaseDate: '2025-10-15',
      platforms: [],
    },
    {
      id: 'release-004',
      title: 'Harbour Lights',
      artistId: 'artist-001',
      artistName: 'Theo Marsh',
      type: 'ep',
      status: 'live',
      releaseDate: '2024-11-08',
      smartLinkUrl: 'https://labelgrid.link/harbour-lights',
      platforms: [
        { name: 'spotify', status: 'live', lastSyncAt: '2024-11-08T12:00:00Z' },
        { name: 'apple_music', status: 'live', lastSyncAt: '2024-11-08T12:00:00Z' },
        { name: 'amazon_music', status: 'live', lastSyncAt: '2024-11-09T08:00:00Z' },
      ],
      labelgridId: 'lg-0102',
    },
    {
      id: 'release-005',
      title: 'Undertow',
      artistId: 'artist-003',
      artistName: 'Nine Rivers',
      type: 'single',
      status: 'live',
      releaseDate: '2025-03-22',
      smartLinkUrl: 'https://labelgrid.link/undertow',
      platforms: [
        { name: 'spotify', status: 'live', lastSyncAt: '2025-03-22T09:00:00Z' },
        { name: 'tidal', status: 'live', lastSyncAt: '2025-03-22T10:00:00Z' },
      ],
      labelgridId: 'lg-0103',
    },
    {
      id: 'release-006',
      title: 'Reverie',
      artistId: 'artist-004',
      artistName: 'Lena Kade',
      type: 'single',
      status: 'processing',
      releaseDate: '2025-07-10',
      platforms: [
        { name: 'spotify', status: 'pending' },
        { name: 'apple_music', status: 'pending' },
      ],
    },
    {
      id: 'release-007',
      title: 'Delta Run',
      artistId: 'artist-005',
      artistName: 'Driftwood Sons',
      type: 'album',
      status: 'scheduled',
      releaseDate: '2025-09-05',
      platforms: [
        { name: 'spotify', status: 'pending' },
        { name: 'apple_music', status: 'pending' },
        { name: 'youtube_music', status: 'pending' },
        { name: 'tidal', status: 'pending' },
      ],
    },
    {
      id: 'release-008',
      title: 'Pale Signal',
      artistId: 'artist-006',
      artistName: 'Static Bloom',
      type: 'single',
      status: 'draft',
      releaseDate: '2025-11-01',
      platforms: [],
    },
    {
      id: 'release-009',
      title: 'Low Country',
      artistId: 'artist-005',
      artistName: 'Driftwood Sons',
      type: 'single',
      status: 'live',
      releaseDate: '2025-01-18',
      smartLinkUrl: 'https://labelgrid.link/low-country',
      platforms: [
        { name: 'spotify', status: 'live', lastSyncAt: '2025-01-18T10:00:00Z' },
        { name: 'apple_music', status: 'live', lastSyncAt: '2025-01-18T10:00:00Z' },
      ],
      labelgridId: 'lg-0104',
    },
  ]
}

// TODO: GET /releases/{release} — see groups/releases
export async function getRelease(id: string): Promise<Release> {
  void lgFetch
  const all = await getReleases()
  return all.find((r) => r.id === id) ?? all[0]
}

// TODO: POST /releases — see groups/releases
export async function createRelease(data: Partial<Release>): Promise<Release> {
  void lgFetch
  return {
    id: `rel-${Date.now()}`,
    title: data.title ?? 'Untitled',
    artistId: data.artistId ?? '',
    artistName: data.artistName ?? '',
    type: data.type ?? 'single',
    status: 'draft',
    releaseDate: data.releaseDate ?? new Date().toISOString(),
    platforms: data.platforms ?? [],
  }
}

// TODO: GET /releases/{release}/insight — see groups/releases
export async function getReleaseInsight(releaseId: string): Promise<ReleaseInsight> {
  void lgFetch
  const MOCK: Record<string, ReleaseInsight> = {
    'release-001': {
      releaseId: 'release-001',
      totalStreams: 620000,
      totalRevenue: 7440,
      platformBreakdown: [
        { platform: 'Spotify', revenue: 4100, streams: 380000 },
        { platform: 'Apple Music', revenue: 2800, streams: 190000 },
        { platform: 'Tidal', revenue: 540, streams: 50000 },
      ],
    },
    'release-004': {
      releaseId: 'release-004',
      totalStreams: 480000,
      totalRevenue: 5760,
      platformBreakdown: [
        { platform: 'Spotify', revenue: 3200, streams: 300000 },
        { platform: 'Apple Music', revenue: 2100, streams: 145000 },
        { platform: 'Amazon Music', revenue: 460, streams: 35000 },
      ],
    },
    'release-005': {
      releaseId: 'release-005',
      totalStreams: 310000,
      totalRevenue: 3720,
      platformBreakdown: [
        { platform: 'Spotify', revenue: 2800, streams: 240000 },
        { platform: 'Tidal', revenue: 920, streams: 70000 },
      ],
    },
    'release-009': {
      releaseId: 'release-009',
      totalStreams: 195000,
      totalRevenue: 2340,
      platformBreakdown: [
        { platform: 'Spotify', revenue: 1400, streams: 120000 },
        { platform: 'Apple Music', revenue: 940, streams: 75000 },
      ],
    },
  }
  return (
    MOCK[releaseId] ?? {
      releaseId,
      totalStreams: 42000,
      totalRevenue: 504,
      platformBreakdown: [{ platform: 'Spotify', revenue: 504, streams: 42000 }],
    }
  )
}

// TODO: aggregate from /statements — see groups/statements
export async function getRoyaltySummary(days: 30 | 90 | 365): Promise<RoyaltySummary> {
  void lgFetch
  if (days === 30) {
    return {
      totalRevenue: 8820,
      artistRoyaltiesOwed: 5640,
      pendingPayouts: 2100,
      labelRetained: 3180,
      periodDays: 30,
      revenueByPlatform: [
        { platform: 'Spotify', revenue: 4050, streams: 560000 },
        { platform: 'Apple Music', revenue: 2620, streams: 280000 },
        { platform: 'YouTube Music', revenue: 1300, streams: 190000 },
        { platform: 'Tidal', revenue: 850, streams: 65000 },
      ],
      topArtists: [
        {
          artistId: 'artist-001',
          artistName: 'Theo Marsh',
          initials: 'TM',
          splitPercentage: 70,
          releaseCount: 4,
          royaltyOwed: 3410,
          deltaPercent: 7.2,
        },
        {
          artistId: 'artist-003',
          artistName: 'Nine Rivers',
          initials: 'NR',
          splitPercentage: 70,
          releaseCount: 3,
          royaltyOwed: 2230,
          deltaPercent: -1.8,
        },
      ],
    }
  }

  if (days === 365) {
    return {
      totalRevenue: 98200,
      artistRoyaltiesOwed: 62400,
      pendingPayouts: 18600,
      labelRetained: 35800,
      periodDays: 365,
      revenueByPlatform: [
        { platform: 'Spotify', revenue: 45100, streams: 6200000 },
        { platform: 'Apple Music', revenue: 29300, streams: 3100000 },
        { platform: 'YouTube Music', revenue: 14800, streams: 2050000 },
        { platform: 'Tidal', revenue: 9000, streams: 710000 },
      ],
      topArtists: [
        {
          artistId: 'artist-001',
          artistName: 'Theo Marsh',
          initials: 'TM',
          splitPercentage: 70,
          releaseCount: 4,
          royaltyOwed: 38200,
          deltaPercent: 22.1,
        },
        {
          artistId: 'artist-003',
          artistName: 'Nine Rivers',
          initials: 'NR',
          splitPercentage: 70,
          releaseCount: 3,
          royaltyOwed: 24200,
          deltaPercent: 11.4,
        },
        {
          artistId: 'artist-002',
          artistName: 'Coral & Vine',
          initials: 'CV',
          splitPercentage: 65,
          releaseCount: 2,
          royaltyOwed: 0,
          deltaPercent: 0,
        },
      ],
    }
  }

  // 90d — existing approved figures
  return {
    totalRevenue: 28940,
    artistRoyaltiesOwed: 18402,
    pendingPayouts: 6180,
    labelRetained: 10538,
    periodDays: 90,
    revenueByPlatform: [
      { platform: 'Spotify', revenue: 13240, streams: 1840000 },
      { platform: 'Apple Music', revenue: 8610, streams: 920000 },
      { platform: 'YouTube Music', revenue: 4320, streams: 610000 },
      { platform: 'Tidal', revenue: 2770, streams: 210000 },
    ],
    topArtists: [
      {
        artistId: 'artist-001',
        artistName: 'Theo Marsh',
        initials: 'TM',
        splitPercentage: 70,
        releaseCount: 4,
        royaltyOwed: 11200,
        deltaPercent: 12.4,
      },
      {
        artistId: 'artist-003',
        artistName: 'Nine Rivers',
        initials: 'NR',
        splitPercentage: 70,
        releaseCount: 3,
        royaltyOwed: 7202,
        deltaPercent: -3.1,
      },
    ],
  }
}

// TODO: GET /statements — see groups/statements
export async function getRoyaltyStatements(artistId?: string): Promise<RoyaltyStatement[]> {
  void lgFetch
  const statements: RoyaltyStatement[] = [
    {
      id: 'stmt-001',
      artistId: 'artist-001',
      artistName: 'Theo Marsh',
      periodStart: '2025-01-01',
      periodEnd: '2025-03-31',
      grossRevenue: 26300,
      splitPercentage: 70,
      royaltyOwed: 18410,
      status: 'paid',
      paidAt: '2025-04-15',
      platforms: [
        { platform: 'Spotify', revenue: 14000, streams: 1100000 },
        { platform: 'Apple Music', revenue: 12300, streams: 740000 },
      ],
    },
    {
      id: 'stmt-002',
      artistId: 'artist-003',
      artistName: 'Nine Rivers',
      periodStart: '2025-01-01',
      periodEnd: '2025-03-31',
      grossRevenue: 14200,
      splitPercentage: 65,
      royaltyOwed: 9230,
      status: 'pending',
      scheduledPayoutDate: '2025-07-15',
      platforms: [
        { platform: 'Spotify', revenue: 8100, streams: 620000 },
        { platform: 'YouTube Music', revenue: 6100, streams: 490000 },
      ],
    },
  ]
  if (artistId) return statements.filter((s) => s.artistId === artistId)
  return statements
}

// TODO: GET /artists — see groups/artists
export async function getArtists(): Promise<Artist[]> {
  void lgFetch
  return [
    {
      id: 'artist-001',
      name: 'Theo Marsh',
      initials: 'TM',
      genres: ['Indie Folk', 'Acoustic'],
      releaseCount: 4,
      splitPercentage: 70,
      status: 'active',
      monthlyListeners: 48200,
    },
    {
      id: 'artist-002',
      name: 'Coral & Vine',
      initials: 'CV',
      genres: ['Dream Pop', 'Shoegaze'],
      releaseCount: 2,
      splitPercentage: 65,
      status: 'active',
      monthlyListeners: 21400,
    },
    {
      id: 'artist-003',
      name: 'Nine Rivers',
      initials: 'NR',
      genres: ['Electronic', 'Ambient'],
      releaseCount: 3,
      splitPercentage: 70,
      status: 'active',
      monthlyListeners: 33800,
    },
    {
      id: 'artist-004',
      name: 'Lena Kade',
      initials: 'LK',
      genres: ['Singer-Songwriter'],
      releaseCount: 1,
      splitPercentage: 60,
      status: 'active',
      monthlyListeners: 7200,
    },
    {
      id: 'artist-005',
      name: 'Driftwood Sons',
      initials: 'DS',
      genres: ['Americana', 'Country'],
      releaseCount: 2,
      splitPercentage: 65,
      status: 'active',
      monthlyListeners: 14600,
    },
    {
      id: 'artist-006',
      name: 'Static Bloom',
      initials: 'SB',
      genres: ['Noise Pop', 'Indie'],
      releaseCount: 1,
      splitPercentage: 70,
      status: 'active',
      monthlyListeners: 2900,
    },
  ]
}

// TODO: GET /analytics — see groups/analytics
export async function getAnalyticsStreams(days: 30 | 90 | 365): Promise<PlatformRevenue[]> {
  void lgFetch
  if (days === 30) {
    return [
      { platform: 'Spotify', revenue: 7200, streams: 600000 },
      { platform: 'Apple Music', revenue: 4600, streams: 300000 },
      { platform: 'YouTube Music', revenue: 2300, streams: 200000 },
      { platform: 'Tidal', revenue: 1400, streams: 68000 },
      { platform: 'Amazon Music', revenue: 640, streams: 30000 },
      { platform: 'Other DSPs', revenue: 290, streams: 13000 },
    ]
  }
  if (days === 365) {
    return [
      { platform: 'Spotify', revenue: 76200, streams: 6400000 },
      { platform: 'Apple Music', revenue: 49400, streams: 3200000 },
      { platform: 'YouTube Music', revenue: 24800, streams: 2100000 },
      { platform: 'Tidal', revenue: 15900, streams: 730000 },
      { platform: 'Amazon Music', revenue: 7200, streams: 340000 },
      { platform: 'Other DSPs', revenue: 3400, streams: 148000 },
    ]
  }
  // 90d — existing approved figures
  return [
    { platform: 'Spotify', revenue: 22100, streams: 1840000 },
    { platform: 'Apple Music', revenue: 14300, streams: 920000 },
    { platform: 'YouTube Music', revenue: 7200, streams: 610000 },
    { platform: 'Tidal', revenue: 4600, streams: 210000 },
    { platform: 'Amazon Music', revenue: 2100, streams: 98000 },
    { platform: 'Other DSPs', revenue: 980, streams: 42000 },
  ]
}

function buildTimeseries(
  days: number,
  base: number,
  trendTotal: number,
): { date: string; streams: number }[] {
  const seed = [0.2, -0.3, 0.5, 0.1, -0.1, 0.6, -0.2, 0.4, 0.3, -0.4,
                0.7, 0.1, -0.2, 0.5, 0.2, -0.1, 0.8, 0.3, 0.1, -0.3,
                0.4, 0.6, -0.1, 0.3, 0.5, 0.2, -0.2, 0.7, 0.4, 0.1,
                0.3, -0.1, 0.6, 0.2, 0.4, -0.3, 0.8, 0.1, 0.5, 0.3,
                -0.2, 0.7, 0.2, 0.4, 0.1, -0.1, 0.5, 0.3, 0.6, 0.2]
  const now = new Date('2026-06-15')
  const result: { date: string; streams: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const trend = ((days - 1 - i) / (days - 1)) * trendTotal
    const noise = Math.round((seed[i % seed.length]) * (base * 0.14))
    result.push({
      date: d.toISOString().slice(0, 10),
      streams: Math.max(Math.round(base * 0.4), Math.round(base + trend + noise)),
    })
  }
  return result
}

export async function getStreamsTimeseries(days: 30 | 90 | 365): Promise<{ date: string; streams: number }[]> {
  void lgFetch
  if (days === 30) return buildTimeseries(30, 15000, 4000)
  if (days === 365) return buildTimeseries(365, 12000, 18000)
  return buildTimeseries(90, 18000, 8000)
}

// TODO: GET /distro-queue — see groups/distro-queue
export async function getDistributionStatus(): Promise<DistributionChannel[]> {
  void lgFetch
  return [
    {
      platform: 'Spotify',
      connected: true,
      lastSyncAt: '2026-06-15T18:52:00Z',
      status: 'healthy',
      deliveryCount: 4,
    },
    {
      platform: 'Apple Music',
      connected: true,
      lastSyncAt: '2026-06-15T18:52:00Z',
      status: 'healthy',
      deliveryCount: 3,
    },
    {
      platform: 'YouTube Music',
      connected: true,
      lastSyncAt: '2026-06-15T16:10:00Z',
      status: 'healthy',
      deliveryCount: 0,
    },
    {
      platform: 'Tidal',
      connected: false,
      lastSyncAt: '2026-06-13T09:00:00Z',
      status: 'warning',
      errorMessage: 'Authentication token expired — reconnect required',
      deliveryCount: 2,
    },
    {
      platform: 'Amazon Music',
      connected: true,
      lastSyncAt: '2026-06-15T17:30:00Z',
      status: 'healthy',
      deliveryCount: 1,
    },
    {
      platform: 'Other DSPs',
      connected: true,
      lastSyncAt: '2026-06-15T14:00:00Z',
      status: 'healthy',
      deliveryCount: 0,
    },
  ]
}

export async function getSyncEvents(): Promise<SyncEvent[]> {
  void lgFetch
  return [
    {
      id: 'evt-001',
      platform: 'Spotify',
      eventType: 'delivery',
      message: 'Midnight Tide delivered to Spotify',
      occurredAt: '2026-06-15T18:52:00Z',
    },
    {
      id: 'evt-002',
      platform: 'Apple Music',
      eventType: 'delivery',
      message: 'Midnight Tide delivered to Apple Music',
      occurredAt: '2026-06-15T18:51:00Z',
    },
    {
      id: 'evt-003',
      platform: 'Spotify',
      eventType: 'sync',
      message: 'Routine sync completed — all assets verified',
      occurredAt: '2026-06-15T16:10:00Z',
    },
    {
      id: 'evt-004',
      platform: 'Amazon Music',
      eventType: 'delivery',
      message: 'Low Country delivered to Amazon Music',
      occurredAt: '2026-06-15T14:20:00Z',
    },
    {
      id: 'evt-005',
      platform: 'Tidal',
      eventType: 'error',
      message: 'Tidal sync failed — authentication token expired',
      occurredAt: '2026-06-13T09:00:00Z',
    },
    {
      id: 'evt-006',
      platform: 'All platforms',
      eventType: 'payout',
      message: 'Payout processed for Theo Marsh — $4,210.00',
      occurredAt: '2026-06-12T11:00:00Z',
    },
    {
      id: 'evt-007',
      platform: 'Spotify',
      eventType: 'delivery',
      message: 'Undertow delivered to Spotify',
      occurredAt: '2026-06-11T09:15:00Z',
    },
    {
      id: 'evt-008',
      platform: 'Apple Music',
      eventType: 'sync',
      message: 'Metadata refresh completed for Harbour Lights',
      occurredAt: '2026-06-10T15:40:00Z',
    },
    {
      id: 'evt-009',
      platform: 'All platforms',
      eventType: 'payout',
      message: 'Payout processed for Nine Rivers — $2,890.00',
      occurredAt: '2026-06-09T10:00:00Z',
    },
    {
      id: 'evt-010',
      platform: 'Tidal',
      eventType: 'delivery',
      message: 'Undertow delivered to Tidal',
      occurredAt: '2026-06-08T08:30:00Z',
    },
  ]
}
