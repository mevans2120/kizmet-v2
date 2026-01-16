# Research: Sanity CMS SEO & Google Metadata Integration

**Date:** 2026-01-15  
**Project:** Kizmet Massage & Wellness Booking Site  
**Researcher:** Claude Code  

---

## Executive Summary

This research document outlines the implementation strategy for adding comprehensive SEO capabilities to the Kizmet booking site using Sanity CMS for content management and Next.js 15's Metadata API for rendering. The implementation draws from:

1. Best practices from the existing DOA (Department of Art) project on this machine
2. Sanity's official SEO optimization course
3. Next.js 15 metadata API documentation
4. Google's structured data guidelines for local businesses

**Key Recommendations:**
- Add a reusable `seo` object type to Sanity schemas
- Implement `generateMetadata()` in all page routes
- Add JSON-LD structured data for `LocalBusiness` and `HealthAndBeautyBusiness` schemas
- Use the GROQ `coalesce()` function for fallback metadata values

---

## Current State Analysis

### Kizmet Project - Current Setup

**Root Layout Metadata (`/src/app/layout.tsx`):**
```typescript
export const metadata: Metadata = {
  title: {
    default: 'Kizmet Massage & Wellness | Therapeutic Massage Services',
    template: '%s | Kizmet Massage & Wellness',
  },
  description: 'Professional therapeutic massage services in Port Angeles, WA.',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
}
```

**Current Limitations:**
- Static metadata defined at build time
- No CMS control over SEO fields
- No Open Graph or Twitter Card metadata
- No JSON-LD structured data
- No per-page SEO customization from CMS
- Pages use static `metadata` objects instead of dynamic `generateMetadata()`

**Existing Sanity Schemas:**
| Schema | SEO Fields | Status |
|--------|------------|--------|
| `siteSettings` | brandName, tagline, phone, email, address | No SEO object |
| `homepageSettings` | Hero content, services, CTA | No SEO object |
| `aboutPage` | Hero, bio, journey content | No SEO object |
| `policiesPage` | Page title, policies array | No SEO object |
| `bookPage` | Eyebrow, headline, description | No SEO object |
| `service` | name, description, price, etc. | No SEO object |

### DOA Project - Reference Implementation

The DOA project has a complete SEO implementation that can serve as a template:

**Site Settings SEO Object (`/Users/michaelevans/DOA/sanity/schemaTypes/siteSettings.ts`):**
```typescript
defineField({
  name: 'seo',
  title: 'Default SEO Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Default Meta Title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
    }),
    defineField({
      name: 'socialImage',
      title: 'Default Social Share Image',
      type: 'responsiveImage',
      description: 'Will be displayed in landscape format (1200x630)',
    }),
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card Type',
      type: 'string',
      options: {
        list: [
          {title: 'Summary', value: 'summary'},
          {title: 'Summary Large Image', value: 'summary_large_image'},
        ],
      },
      initialValue: 'summary_large_image',
    }),
  ],
}),
```

**Metadata Utility (`/Users/michaelevans/DOA/src/lib/metadata.ts`):**
- `getOgImageUrl()` - Generates 1200x630 Open Graph images
- `getSiteMetadata()` - Fetches and transforms site settings to Next.js Metadata
- `getSiteSettingsForSchema()` - Prepares data for JSON-LD generation

**Structured Data (`/Users/michaelevans/DOA/src/lib/structured-data.tsx`):**
- `generateOrganizationSchema()` - Organization JSON-LD
- `generateLocalBusinessSchema()` - Local business JSON-LD
- `generateWebSiteSchema()` - Website JSON-LD
- `generateSiteSchemaGraph()` - Combined graph for root layout
- `StructuredData` component - React component for script injection

---

## Recommended Sanity Schema Additions

### 1. Reusable SEO Object Type

Create a new file: `/src/sanity/schemaTypes/objects/seo.ts`

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Override the page title for search engines (50-60 characters recommended)',
      validation: (Rule) => Rule.max(60).warning('Meta titles over 60 characters may be truncated'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engine results (150-160 characters recommended)',
      validation: (Rule) => Rule.max(160).warning('Meta descriptions over 160 characters may be truncated'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Image displayed when sharing on social media (1200x630 recommended)',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      description: 'If enabled, this page will not appear in search results',
      initialValue: false,
    }),
  ],
})
```

### 2. Updated Site Settings Schema

Update `/src/sanity/schemaTypes/siteSettings.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    { name: 'branding', title: 'Branding & Identity' },
    { name: 'contact', title: 'Contact Information' },
    { name: 'seo', title: 'SEO & Social Media' },
    { name: 'business', title: 'Business Information' },
  ],
  fields: [
    // Existing branding fields
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      fieldset: 'branding',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      fieldset: 'branding',
    }),
    
    // Existing contact fields
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      fieldset: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      fieldset: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fieldset: 'contact',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'state', title: 'State', type: 'string' }),
        defineField({ name: 'zip', title: 'ZIP Code', type: 'string' }),
      ],
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'string',
      fieldset: 'contact',
    }),
    
    // NEW: SEO Fields
    defineField({
      name: 'seo',
      title: 'Default SEO Settings',
      type: 'object',
      fieldset: 'seo',
      description: 'Default values used when pages don\'t specify their own',
      fields: [
        defineField({
          name: 'siteUrl',
          title: 'Site URL',
          type: 'url',
          description: 'The canonical URL of your website (e.g., https://kizmetmassage.com)',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'socialImage',
          title: 'Default Social Share Image',
          type: 'image',
          options: { hotspot: true },
          description: '1200x630 recommended for optimal social media display',
        }),
        defineField({
          name: 'twitterHandle',
          title: 'Twitter/X Handle',
          type: 'string',
          description: 'Without the @ symbol (e.g., kizmetmassage)',
        }),
        defineField({
          name: 'facebookPageId',
          title: 'Facebook Page ID',
          type: 'string',
        }),
        defineField({
          name: 'instagramHandle',
          title: 'Instagram Handle',
          type: 'string',
        }),
      ],
    }),
    
    // NEW: Business Information for Structured Data
    defineField({
      name: 'businessInfo',
      title: 'Business Information',
      type: 'object',
      fieldset: 'business',
      description: 'Used for Google Business Profile and structured data',
      fields: [
        defineField({
          name: 'businessType',
          title: 'Business Type',
          type: 'string',
          options: {
            list: [
              { title: 'Health & Beauty Business', value: 'HealthAndBeautyBusiness' },
              { title: 'Day Spa', value: 'DaySpa' },
              { title: 'Local Business', value: 'LocalBusiness' },
            ],
          },
          initialValue: 'HealthAndBeautyBusiness',
        }),
        defineField({
          name: 'priceRange',
          title: 'Price Range',
          type: 'string',
          options: {
            list: [
              { title: '$', value: '$' },
              { title: '$$', value: '$$' },
              { title: '$$$', value: '$$$' },
            ],
          },
          initialValue: '$$',
        }),
        defineField({
          name: 'businessHours',
          title: 'Business Hours',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'days',
                  title: 'Days',
                  type: 'array',
                  of: [{ type: 'string' }],
                  options: {
                    list: [
                      { title: 'Monday', value: 'Monday' },
                      { title: 'Tuesday', value: 'Tuesday' },
                      { title: 'Wednesday', value: 'Wednesday' },
                      { title: 'Thursday', value: 'Thursday' },
                      { title: 'Friday', value: 'Friday' },
                      { title: 'Saturday', value: 'Saturday' },
                      { title: 'Sunday', value: 'Sunday' },
                    ],
                  },
                }),
                defineField({ name: 'opens', title: 'Opens', type: 'string' }),
                defineField({ name: 'closes', title: 'Closes', type: 'string' }),
              ],
            },
          ],
        }),
        defineField({
          name: 'geoCoordinates',
          title: 'Location Coordinates',
          type: 'object',
          description: 'For Google Maps and local SEO',
          fields: [
            defineField({ name: 'latitude', title: 'Latitude', type: 'number' }),
            defineField({ name: 'longitude', title: 'Longitude', type: 'number' }),
          ],
        }),
        defineField({
          name: 'googleMapsUrl',
          title: 'Google Maps URL',
          type: 'url',
        }),
        defineField({
          name: 'googleBusinessProfileId',
          title: 'Google Business Profile ID',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
```

### 3. Add SEO to Page Schemas

Each page schema should include an SEO object. Example for `aboutPage.ts`:

```typescript
// Add to the fields array:
defineField({
  name: 'seo',
  title: 'SEO Settings',
  type: 'seo',
  description: 'Custom SEO settings for this page (overrides site defaults)',
}),
```

### 4. Update Schema Index

Update `/src/sanity/schemaTypes/index.ts`:

```typescript
import siteSettings from './siteSettings'
import homepageSettings from './homepageSettings'
import aboutPage from './aboutPage'
import policiesPage from './policiesPage'
import bookPage from './bookPage'
import footerSettings from './footerSettings'
import service from './service'
import seo from './objects/seo'

export const schemaTypes = [
  // Documents
  siteSettings,
  homepageSettings,
  aboutPage,
  policiesPage,
  bookPage,
  footerSettings,
  service,
  // Objects
  seo,
]
```

---

## Next.js Metadata Implementation

### 1. Create Metadata Utility

Create `/src/lib/metadata.ts`:

```typescript
import { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'

// Types
interface SeoFields {
  metaTitle?: string
  metaDescription?: string
  ogImage?: any
  noIndex?: boolean
}

interface SiteSettings {
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
  }
}

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
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * Generate base metadata from site settings (for root layout)
 */
export async function generateSiteMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  
  const siteName = settings?.brandName || 'Kizmet Massage & Wellness'
  const siteUrl = settings?.seo?.siteUrl || 'https://kizmetmassage.com'
  const metaTitle = settings?.seo?.metaTitle || `${siteName} | Therapeutic Massage Services`
  const metaDescription = settings?.seo?.metaDescription || 
    'Professional therapeutic massage services in Port Angeles, WA.'
  
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
  
  const siteName = settings?.brandName || 'Kizmet Massage & Wellness'
  const siteUrl = settings?.seo?.siteUrl || 'https://kizmetmassage.com'
  
  // Use coalesce pattern: page SEO > page content > site defaults
  const metaTitle = seo?.metaTitle || title || settings?.seo?.metaTitle || siteName
  const metaDescription = seo?.metaDescription || description || settings?.seo?.metaDescription || ''
  
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

// Export type for use in pages
export type { SiteSettings, SeoFields }
```

### 2. Update Root Layout

Update `/src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { generateSiteMetadata, getSiteSettings } from '@/lib/metadata'
import { StructuredData, generateSiteSchemaGraph } from '@/lib/structured-data'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata()
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch site settings for structured data
  const siteSettings = await getSiteSettings()
  const schemaGraph = generateSiteSchemaGraph(siteSettings)
  
  return (
    <html lang="en" className={`${plusJakarta.variable} ${fraunces.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <StructuredData data={schemaGraph} />
        
        {/* Preconnect to Sanity CDN */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 3. Update Page Routes with generateMetadata

Example for `/src/app/about/page.tsx`:

```typescript
export const revalidate = 300

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import AboutContent from '@/page-content/About'
import { sanityFetch } from '@/sanity/lib/fetch'
import { generatePageMetadata } from '@/lib/metadata'
import { ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>(ABOUT_PAGE_QUERY)
  
  return generatePageMetadata({
    title: 'About',
    description: data?.intro || 'Meet Destiny, a third-generation healer...',
    seo: data?.seo,
    path: '/about',
  })
}

export default async function AboutPage() {
  const isDraft = (await draftMode()).isEnabled

  const [aboutData, siteSettings, footerSettings] = await Promise.all([
    sanityFetch<any>(ABOUT_PAGE_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <>
      <AboutContent
        data={aboutData}
        siteSettings={siteSettings}
        footerSettings={footerSettings}
      />
      {isDraft && <VisualEditing />}
    </>
  )
}
```

---

## JSON-LD Structured Data Implementation

### 1. Create Structured Data Utility

Create `/src/lib/structured-data.tsx`:

```typescript
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
const DEFAULT_BUSINESS_NAME = 'Kizmet Massage & Wellness'
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

  // Add logo/image
  if (settings?.seo?.socialImage) {
    // Would use getOgImageUrl here
    schema.logo = `${siteUrl}/logo.png`
    schema.image = `${siteUrl}/og-default.jpg`
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
  if (settings?.businessInfo?.businessHours) {
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
  // Add Instagram, Facebook, etc. as needed
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
```

---

## Updated GROQ Queries

Update `/src/sanity/lib/queries.ts`:

```typescript
// Site-wide with SEO fields
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  brandName,
  tagline,
  phone,
  email,
  address,
  bookingUrl,
  seo {
    siteUrl,
    metaTitle,
    metaDescription,
    socialImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions
        }
      },
      hotspot,
      crop
    },
    twitterHandle,
    facebookPageId,
    instagramHandle
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
    googleMapsUrl
  }
}`

// Page queries with SEO - use coalesce for fallbacks
export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0] {
  ...,
  "seo": {
    "metaTitle": coalesce(seo.metaTitle, headline),
    "metaDescription": coalesce(seo.metaDescription, intro),
    "ogImage": seo.ogImage {
      asset-> { _id, url },
      hotspot,
      crop
    },
    "noIndex": seo.noIndex
  }
}`

export const POLICIES_PAGE_QUERY = `*[_type == "policiesPage"][0] {
  ...,
  "seo": {
    "metaTitle": coalesce(seo.metaTitle, pageTitle),
    "metaDescription": coalesce(seo.metaDescription, pageDescription),
    "ogImage": seo.ogImage,
    "noIndex": seo.noIndex
  }
}`

export const BOOK_PAGE_QUERY = `*[_type == "bookPage"][0] {
  ...,
  "seo": {
    "metaTitle": coalesce(seo.metaTitle, headline),
    "metaDescription": coalesce(seo.metaDescription, description),
    "ogImage": seo.ogImage,
    "noIndex": seo.noIndex
  }
}`
```

---

## Implementation Steps

### Phase 1: Schema Updates (Estimated: 1-2 hours)

1. Create `/src/sanity/schemaTypes/objects/seo.ts`
2. Update `/src/sanity/schemaTypes/siteSettings.ts` with SEO and businessInfo fields
3. Add `seo` field to all page schemas (aboutPage, policiesPage, bookPage, homepageSettings)
4. Update schema index to include new SEO object type
5. Deploy Sanity schema changes and migrate content

### Phase 2: Next.js Integration (Estimated: 2-3 hours)

1. Create `/src/lib/metadata.ts` with utility functions
2. Create `/src/lib/structured-data.tsx` with JSON-LD generators
3. Update `/src/app/layout.tsx` to use dynamic metadata and structured data
4. Update all page routes to use `generateMetadata()` function
5. Update GROQ queries with SEO fields and coalesce fallbacks

### Phase 3: Content Entry (Estimated: 1 hour)

1. Populate site settings SEO fields in Sanity Studio
2. Add business information (hours, coordinates, price range)
3. Optionally add page-specific SEO overrides
4. Create/upload default social share image (1200x630)

### Phase 4: Testing & Validation (Estimated: 1 hour)

1. Validate structured data with Google Rich Results Test
2. Check Open Graph tags with social media debuggers (Facebook, Twitter, LinkedIn)
3. Verify metadata in browser dev tools
4. Test Google Search Console integration

---

## Testing & Validation Tools

- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema Markup Validator:** https://validator.schema.org/
- **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
- **Chrome Lighthouse:** SEO audit in DevTools

---

## Additional Considerations

### Google Search Console Setup

1. Verify site ownership
2. Submit sitemap.xml
3. Monitor Core Web Vitals
4. Check for crawl errors
5. Request indexing for new pages

### Future Enhancements

- **Sitemap Generation:** Use `next-sitemap` package for automatic sitemap.xml
- **Blog/Article Schema:** If adding a blog, implement `Article` schema
- **FAQ Schema:** For the policies page, consider `FAQPage` schema
- **Service Schema:** Enhance service pages with detailed `Service` schema
- **BreadcrumbList Schema:** Add breadcrumb structured data for navigation

### Performance Considerations

- Cache CMS responses (already using `revalidate: 300`)
- Consider ISR for metadata-heavy pages
- Lazy load non-critical schema data
- Use `stega: false` in metadata fetch calls to avoid visual editing overhead

---

## References

### Documentation
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld)
- [Sanity SEO Optimization Course](https://www.sanity.io/learn/course/seo-optimization)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [Schema.org HealthAndBeautyBusiness](https://schema.org/HealthAndBeautyBusiness)

### Tools & Plugins
- [schema-dts](https://www.npmjs.com/package/schema-dts) - TypeScript types for schema.org
- [@operationnation/sanity-plugin-schema-markup](https://www.sanity.io/plugins/sanity-plugin-schema-markup) - Sanity plugin for schema markup

### Research Sources
- [The Complete Guide to SEO Optimization in Next.js 15](https://medium.com/@thomasaugot/the-complete-guide-to-seo-optimization-in-next-js-15-1bdb118cffd7)
- [Sanity SEO Schema Types and Metadata](https://www.sanity.io/learn/course/seo-optimization/seo-schema-types-and-metadata)
- [Next.js SEO in 2025 Best Practices](https://www.slatebytes.com/articles/next-js-seo-in-2025-best-practices-meta-tags-and-performance-optimization-for-high-google-rankings)
- [JSON-LD at Scale in 2025](https://wpnewsify.com/blog/json-ld-at-scale-schemas-that-move-the-needle-in-2025/)
- [The Complete Guide to Sanity SEO](https://www.webstacks.com/blog/sanity-seo)

### Local Project Reference
- DOA Project Implementation: `/Users/michaelevans/DOA/`
  - Metadata utility: `/Users/michaelevans/DOA/src/lib/metadata.ts`
  - Structured data: `/Users/michaelevans/DOA/src/lib/structured-data.tsx`
  - Site settings schema: `/Users/michaelevans/DOA/sanity/schemaTypes/siteSettings.ts`

---

## Summary

This implementation will provide:

1. **CMS-Controlled SEO:** All meta titles, descriptions, and social images editable in Sanity Studio
2. **Automatic Fallbacks:** Using GROQ coalesce() for graceful degradation
3. **Rich Snippets:** JSON-LD structured data for Google local business results
4. **Social Sharing:** Optimized Open Graph and Twitter Card metadata
5. **Type Safety:** Full TypeScript support for metadata and schemas
6. **Performance:** ISR caching with 5-minute revalidation
7. **Scalability:** Reusable patterns for future pages and content types
