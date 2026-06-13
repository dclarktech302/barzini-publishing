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
  const mockPlatforms: Platform[] = [
    { name: 'spotify', status: 'live' },
    { name: 'apple_music', status: 'live' },
  ]
  return [
    {
      id: 'rel-001',
      title: 'Midnight Echoes',
      artistId: 'art-001',
      artistName: 'Nova Vega',
      type: 'single',
      status: 'live',
      releaseDate: '2025-03-15',
      platforms: mockPlatforms,
      labelgridId: 'lg-001',
    },
    {
      id: 'rel-002',
      title: 'Solstice EP',
      artistId: 'art-002',
      artistName: 'Dray Montez',
      type: 'ep',
      status: 'scheduled',
      releaseDate: '2025-07-01',
      platforms: [{ name: 'spotify', status: 'pending' }],
    },
  ]
}

// TODO: GET /releases/{release} — see groups/releases
export async function getRelease(id: string): Promise<Release> {
  void lgFetch
  return {
    id,
    title: 'Midnight Echoes',
    artistId: 'art-001',
    artistName: 'Nova Vega',
    type: 'single',
    status: 'live',
    releaseDate: '2025-03-15',
    platforms: [{ name: 'spotify', status: 'live' }],
    labelgridId: 'lg-001',
  }
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
    totalRevenue: 48200,
    artistRoyaltiesOwed: 33740,
    pendingPayouts: 12400,
    labelRetained: 14460,
    periodDays: days,
    revenueByPlatform: [
      { platform: 'Spotify', revenue: 22100, streams: 1840000 },
      { platform: 'Apple Music', revenue: 14300, streams: 920000 },
      { platform: 'YouTube Music', revenue: 7200, streams: 610000 },
      { platform: 'Tidal', revenue: 4600, streams: 210000 },
    ],
    topArtists: [
      {
        artistId: 'art-001',
        artistName: 'Nova Vega',
        initials: 'NV',
        splitPercentage: 70,
        releaseCount: 8,
        royaltyOwed: 18400,
        deltaPercent: 12.4,
      },
      {
        artistId: 'art-002',
        artistName: 'Dray Montez',
        initials: 'DM',
        splitPercentage: 65,
        releaseCount: 5,
        royaltyOwed: 9200,
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
      id: 'art-001',
      name: 'Nova Vega',
      initials: 'NV',
      genres: ['Electronic', 'Ambient'],
      releaseCount: 8,
      splitPercentage: 70,
      status: 'active',
      monthlyListeners: 284000,
    },
    {
      id: 'art-002',
      name: 'Dray Montez',
      initials: 'DM',
      genres: ['Hip-Hop', 'R&B'],
      releaseCount: 5,
      splitPercentage: 65,
      status: 'active',
      monthlyListeners: 127000,
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
