import type { SiteSettings } from './metadata'

// ============================================================================
// Types
// ============================================================================

interface LocalBusinessSchema {
  '@context': 'https://schema.org'
  '@type': string
  '@id': string
  name: string
  description?: string
  url: string
  telephone?: string
  email?: string
  image?: string
  logo?: string
  address?: {
    '@type': 'PostalAddress'
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry: string
  }
  geo?: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
  openingHoursSpecification?: Array<{
    '@type': 'OpeningHoursSpecification'
    dayOfWeek: string[]
    opens: string
    closes: string
  }>
  priceRange?: string
  sameAs?: string[]
}

interface WebSiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  '@id': string
  name: string
  url: string
  description?: string
  publisher: {
    '@id': string
  }
}

interface ServiceSchema {
  '@context': 'https://schema.org'
  '@type': 'Service'
  name: string
  description?: string
  provider: {
    '@type': 'LocalBusiness'
    '@id': string
  }
  offers?: {
    '@type': 'Offer'
    price: string
    priceCurrency: string
  }
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_SITE_URL = 'https://kizmetmassage.com'
const DEFAULT_BUSINESS_NAME = 'Kizmet Massage'
const COUNTRY = 'US'

// ============================================================================
// Generator Functions
// ============================================================================

/**
 * Generate LocalBusiness schema for massage therapy business
 */
export function generateLocalBusinessSchema(
  settings: SiteSettings | null
): LocalBusinessSchema {
  const siteUrl = settings?.seo?.siteUrl || DEFAULT_SITE_URL
  const businessId = `${siteUrl}/#localbusiness`
  const businessType = settings?.businessInfo?.businessType || 'HealthAndBeautyBusiness'

  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': businessType,
    '@id': businessId,
    name: settings?.brandName || DEFAULT_BUSINESS_NAME,
    url: siteUrl,
  }

  // Add description
  if (settings?.seo?.metaDescription) {
    schema.description = settings.seo.metaDescription
  }

  // Add contact info
  if (settings?.phone) {
    schema.telephone = settings.phone
  }
  if (settings?.email) {
    schema.email = settings.email
  }

  // Add address
  if (settings?.address) {
    schema.address = {
      '@type': 'PostalAddress',
      addressCountry: COUNTRY,
    }
    if (settings.address.street) {
      schema.address.streetAddress = settings.address.street
    }
    if (settings.address.city) {
      schema.address.addressLocality = settings.address.city
    }
    if (settings.address.state) {
      schema.address.addressRegion = settings.address.state
    }
    if (settings.address.zip) {
      schema.address.postalCode = settings.address.zip
    }
  }

  // Add geo coordinates
  if (settings?.businessInfo?.geoCoordinates) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: settings.businessInfo.geoCoordinates.latitude,
      longitude: settings.businessInfo.geoCoordinates.longitude,
    }
  }

  // Add business hours
  if (settings?.businessInfo?.businessHours && settings.businessInfo.businessHours.length > 0) {
    schema.openingHoursSpecification = settings.businessInfo.businessHours.map(
      (hours) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.days,
        opens: hours.opens,
        closes: hours.closes,
      })
    )
  }

  // Add price range
  if (settings?.businessInfo?.priceRange) {
    schema.priceRange = settings.businessInfo.priceRange
  }

  // Add social profiles
  const sameAs: string[] = []
  if (settings?.seo?.twitterHandle) {
    sameAs.push(`https://twitter.com/${settings.seo.twitterHandle}`)
  }
  if (settings?.seo?.instagramHandle) {
    sameAs.push(`https://instagram.com/${settings.seo.instagramHandle}`)
  }
  if (settings?.seo?.facebookUrl) {
    sameAs.push(settings.seo.facebookUrl)
  }
  if (sameAs.length > 0) {
    schema.sameAs = sameAs
  }

  return schema
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema(
  settings: SiteSettings | null
): WebSiteSchema {
  const siteUrl = settings?.seo?.siteUrl || DEFAULT_SITE_URL

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: settings?.brandName || DEFAULT_BUSINESS_NAME,
    url: siteUrl,
    description: settings?.seo?.metaDescription,
    publisher: {
      '@id': `${siteUrl}/#localbusiness`,
    },
  }
}

/**
 * Generate combined schema graph for the site
 */
export function generateSiteSchemaGraph(settings: SiteSettings | null): {
  '@context': 'https://schema.org'
  '@graph': (LocalBusinessSchema | WebSiteSchema)[]
} {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateLocalBusinessSchema(settings),
      generateWebSiteSchema(settings),
    ],
  }
}

/**
 * Generate Service schema for massage services
 */
export function generateServiceSchema(
  service: {
    name: string
    description?: string
    price?: string
  },
  siteUrl: string = DEFAULT_SITE_URL
): ServiceSchema {
  const schema: ServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}/#localbusiness`,
    },
  }

  if (service.description) {
    schema.description = service.description
  }

  if (service.price) {
    // Parse price like "$100" to "100"
    const priceValue = service.price.replace(/[^0-9.]/g, '')
    schema.offers = {
      '@type': 'Offer',
      price: priceValue,
      priceCurrency: 'USD',
    }
  }

  return schema
}

// ============================================================================
// React Component
// ============================================================================

/**
 * StructuredData Component - Renders JSON-LD in a script tag
 */
export function StructuredData({
  data,
}: {
  data: object | object[]
}): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  )
}
