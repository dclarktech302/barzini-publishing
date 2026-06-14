import type {
  Artist,
  DistributionChannel,
  Platform,
  PlatformRevenue,
  Release,
  RoyaltyStatement,
  RoyaltySummary,
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

// TODO: aggregate from /statements — see groups/statements
// Confirm exact list/filter params against live docs before wiring up
export async function getRoyaltySummary(days: 30 | 90 | 365): Promise<RoyaltySummary> {
  void lgFetch
  return {
    totalRevenue: 28940,
    artistRoyaltiesOwed: 18402,
    pendingPayouts: 6180,
    labelRetained: 10538,
    periodDays: days,
    revenueByPlatform: [
      { platform: 'Spotify', revenue: 13240, streams: 1840000 },
      { platform: 'Apple Music', revenue: 8610, streams: 920000 },
      { platform: 'YouTube Music', revenue: 4320, streams: 610000 },
      { platform: 'Tidal', revenue: 2770, streams: 210000 },
    ],
    topArtists: [
      {
        artistId: 'art-001',
        artistName: 'Nova Vega',
        initials: 'NV',
        splitPercentage: 70,
        releaseCount: 8,
        royaltyOwed: 11200,
        deltaPercent: 12.4,
      },
      {
        artistId: 'art-002',
        artistName: 'Dray Montez',
        initials: 'DM',
        splitPercentage: 65,
        releaseCount: 5,
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
      artistId: 'art-001',
      artistName: 'Nova Vega',
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
      artistId: 'art-002',
      artistName: 'Dray Montez',
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
export async function getAnalyticsStreams(days: number): Promise<PlatformRevenue[]> {
  void lgFetch
  void days
  return [
    { platform: 'Spotify', revenue: 22100, streams: 1840000 },
    { platform: 'Apple Music', revenue: 14300, streams: 920000 },
    { platform: 'YouTube Music', revenue: 7200, streams: 610000 },
    { platform: 'Tidal', revenue: 4600, streams: 210000 },
    { platform: 'Amazon Music', revenue: 2100, streams: 98000 },
  ]
}

// TODO: GET /distro-queue — see groups/distro-queue
export async function getDistributionStatus(): Promise<DistributionChannel[]> {
  void lgFetch
  return [
    {
      platform: 'Spotify',
      connected: true,
      lastSyncAt: '2025-06-12T14:30:00Z',
      status: 'healthy',
      deliveryCount: 42,
    },
    {
      platform: 'Apple Music',
      connected: true,
      lastSyncAt: '2025-06-12T14:30:00Z',
      status: 'healthy',
      deliveryCount: 42,
    },
    {
      platform: 'YouTube Music',
      connected: true,
      lastSyncAt: '2025-06-11T09:15:00Z',
      status: 'warning',
      errorMessage: 'Delayed sync — retry scheduled',
      deliveryCount: 39,
    },
    {
      platform: 'Tidal',
      connected: false,
      lastSyncAt: '2025-06-08T16:00:00Z',
      status: 'error',
      errorMessage: 'Authentication token expired',
      deliveryCount: 38,
    },
  ]
}
