import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

// ============================================================================
// Types
// ============================================================================

export interface SeoFields {
  metaTitle?: string
  metaDescription?: string
  ogImage?: any
  noIndex?: boolean
}

export interface SiteSettings {
  brandName?: string
  tagline?: string
  phone?: string
  email?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  seo?: {
    siteUrl?: string
    metaTitle?: string
    metaDescription?: string
    socialImage?: any
    twitterHandle?: string
    instagramHandle?: string
    facebookUrl?: string
  }
  businessInfo?: {
    businessType?: string
    priceRange?: string
    businessHours?: Array<{
      days: string[]
      opens: string
      closes: string
    }>
    geoCoordinates?: {
      latitude: number
      longitude: number
    }
    googleMapsUrl?: string
    googlePlaceId?: string
  }
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_SITE_URL = 'https://kizmetmassage.com'
const DEFAULT_SITE_NAME = 'Kizmet Massage'
const DEFAULT_DESCRIPTION = 'Professional therapeutic massage services in Port Angeles, WA.'

// ============================================================================
// Queries
// ============================================================================

const SITE_SETTINGS_SEO_QUERY = `*[_type == "siteSettings"][0] {
  brandName,
  tagline,
  phone,
  email,
  address,
  seo {
    siteUrl,
    metaTitle,
    metaDescription,
    socialImage {
      asset-> { _id, url },
      hotspot,
      crop
    },
    twitterHandle,
    instagramHandle,
    facebookUrl
  },
  businessInfo {
    businessType,
    priceRange,
    businessHours[] {
      days,
      opens,
      closes
    },
    geoCoordinates {
      latitude,
      longitude
    },
    googleMapsUrl,
    googlePlaceId
  }
}`

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate Open Graph image URL (1200x630 for social sharing)
 */
export function getOgImageUrl(image: any): string {
  if (!image) return ''
  return urlFor(image)
    .width(1200)
    .height(630)
    .fit('crop')
    .quality(90)
    .url()
}

/**
 * Fetch site settings for metadata generation
 * Uses the regular client (not draft) for metadata
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch<SiteSettings>(SITE_SETTINGS_SEO_QUERY)
  } catch (error) {
    console.error('Error fetching site settings for metadata:', error)
    return null
  }
}

// ============================================================================
// Metadata Generators
// ============================================================================

/**
 * Generate base metadata from site settings (for root layout)
 */
export async function generateSiteMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const siteName = settings?.brandName || DEFAULT_SITE_NAME
  const siteUrl = settings?.seo?.siteUrl || DEFAULT_SITE_URL
  const metaTitle = settings?.seo?.metaTitle || `${siteName} | Therapeutic Massage Services`
  const metaDescription = settings?.seo?.metaDescription || DEFAULT_DESCRIPTION

  // Generate OG image URL
  let ogImageUrl = `${siteUrl}/og-default.jpg` // Fallback
  if (settings?.seo?.socialImage) {
    ogImageUrl = getOgImageUrl(settings.seo.socialImage)
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description: metaDescription,
    openGraph: {
      type: 'website',
      siteName,
      title: metaTitle,
      description: metaDescription,
      url: siteUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImageUrl],
      creator: settings?.seo?.twitterHandle ? `@${settings.seo.twitterHandle}` : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/icon',
      apple: '/apple-icon',
    },
  }
}

/**
 * Generate page-specific metadata with fallbacks to site defaults
 */
export async function generatePageMetadata({
  title,
  description,
  seo,
  path = '',
}: {
  title?: string
  description?: string
  seo?: SeoFields
  path?: string
}): Promise<Metadata> {
  const settings = await getSiteSettings()

  const siteName = settings?.brandName || DEFAULT_SITE_NAME
  const siteUrl = settings?.seo?.siteUrl || DEFAULT_SITE_URL

  // Use coalesce pattern: page SEO > page content > site defaults
  const metaTitle = seo?.metaTitle || title || settings?.seo?.metaTitle || siteName
  const metaDescription = seo?.metaDescription || description || settings?.seo?.metaDescription || DEFAULT_DESCRIPTION

  // Image priority: page SEO image > site default
  let ogImageUrl = `${siteUrl}/og-default.jpg`
  if (seo?.ogImage) {
    ogImageUrl = getOgImageUrl(seo.ogImage)
  } else if (settings?.seo?.socialImage) {
    ogImageUrl = getOgImageUrl(settings.seo.socialImage)
  }

  const pageUrl = path ? `${siteUrl}${path}` : siteUrl

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: pageUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      title: metaTitle,
      description: metaDescription,
      images: [ogImageUrl],
    },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: pageUrl,
    },
  }
}
