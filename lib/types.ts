export type UserRole = 'admin' | 'artist'

export interface AppUser {
  id: string
  email: string
  role: UserRole
  displayName: string
  artistId?: string
  createdAt: string
}

export interface Artist {
  id: string
  name: string
  initials: string
  genres: string[]
  releaseCount: number
  splitPercentage: number
  status: 'active' | 'inactive'
  monthlyListeners?: number
}

export interface Release {
  id: string
  title: string
  artistId: string
  artistName: string
  type: 'single' | 'ep' | 'album'
  status: 'draft' | 'scheduled' | 'processing' | 'live'
  releaseDate: string
  coverArtUrl?: string
  smartLinkUrl?: string
  platforms: Platform[]
  labelgridId?: string
}

export interface ReleaseInsight {
  releaseId: string
  totalStreams: number
  totalRevenue: number
  platformBreakdown: PlatformRevenue[]
}

export interface Platform {
  name: 'spotify' | 'apple_music' | 'youtube_music' | 'tidal' | 'amazon_music' | 'other'
  status: 'pending' | 'delivered' | 'live' | 'error'
  lastSyncAt?: string
  errorMessage?: string
}

export interface RoyaltyStatement {
  id: string
  artistId: string
  artistName: string
  periodStart: string
  periodEnd: string
  grossRevenue: number
  splitPercentage: number
  royaltyOwed: number
  status: 'pending' | 'processing' | 'paid'
  paidAt?: string
  scheduledPayoutDate?: string
  platforms: PlatformRevenue[]
}

export interface PlatformRevenue {
  platform: string
  revenue: number
  streams: number
}

export interface RoyaltySummary {
  totalRevenue: number
  artistRoyaltiesOwed: number
  pendingPayouts: number
  labelRetained: number
  periodDays: 30 | 90 | 365
  revenueByPlatform: PlatformRevenue[]
  topArtists: ArtistRoyalty[]
}

export interface ArtistRoyalty {
  artistId: string
  artistName: string
  initials: string
  splitPercentage: number
  releaseCount: number
  royaltyOwed: number
  deltaPercent: number
}

export interface DistributionChannel {
  platform: string
  connected: boolean
  lastSyncAt: string
  status: 'healthy' | 'warning' | 'error'
  errorMessage?: string
  deliveryCount: number
}

export interface SyncEvent {
  id: string
  platform: string
  eventType: 'delivery' | 'sync' | 'error' | 'payout'
  message: string
  occurredAt: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}
