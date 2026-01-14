# Sanity CMS Implementation Research

**Date:** January 14, 2026
**Reference Project:** Opal Creek v2 (`/Users/michaelevans/opalcreekv2`)
**Target Project:** Kizmet Massage & Wellness

---

## Executive Summary

Implementing Sanity CMS for Kizmet would allow content to be managed through a visual studio interface, enabling non-technical content updates without code changes. Based on the Opal Creek v2 implementation, this is a well-established pattern that integrates smoothly with Next.js App Router.

**Estimated Effort:** Medium (setup and schema design are straightforward; most work is migrating hardcoded content)

---

## 1. Required Packages

Install these dependencies:

```bash
npm install @sanity/client @sanity/image-url sanity next-sanity @portabletext/react
```

| Package | Version (from opalcreekv2) | Purpose |
|---------|---------------------------|---------|
| `sanity` | ^4.22.0 | Sanity Studio framework |
| `next-sanity` | ^11.6.4 | Next.js integration, visual editing |
| `@sanity/client` | ^7.14.0 | API client for GROQ queries |
| `@sanity/image-url` | ^1.2.0 | Image URL builder |
| `@portabletext/react` | ^4.0.3 | Rich text rendering |
| `@sanity/preview-url-secret` | ^2.1.15 | Preview mode security |

---

## 2. Environment Variables

Create these environment variables:

```bash
# .env.local

# Sanity Project (from sanity.io dashboard)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Preview/Draft Mode (server-only)
SANITY_API_TOKEN=sk_...

# Visual Editing (browser)
NEXT_PUBLIC_SANITY_API_TOKEN=sk_...

# Site URL for preview
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 3. File Structure to Create

```
kizmet-booking-site-main/
├── sanity.config.ts          # Studio configuration
├── sanity.cli.ts             # CLI configuration
├── sanity/
│   ├── schemaTypes/          # Content schemas
│   │   ├── index.ts
│   │   ├── service.ts
│   │   ├── siteSettings.ts
│   │   ├── homepageSettings.ts
│   │   ├── aboutPage.ts
│   │   ├── contactPage.ts
│   │   ├── policiesPage.ts
│   │   └── footerSettings.ts
│   ├── lib/
│   │   ├── client.ts         # Sanity client
│   │   ├── queries.ts        # GROQ queries
│   │   ├── image.ts          # Image URL helper
│   │   └── live.ts           # Real-time updates
│   ├── deskStructure.ts      # Studio organization
│   └── presentation.ts       # Visual editing config
├── app/
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx      # Embedded studio
│   └── api/
│       └── draft-mode/
│           ├── enable/route.ts
│           └── disable/route.ts
```

---

## 4. Content Schema Design

Based on Kizmet's current hardcoded content, here are the recommended schemas:

### 4.1 Singleton Documents (One instance each)

#### `siteSettings.ts` - Global site configuration
```typescript
{
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // Navigation
    { name: 'brandName', type: 'string', title: 'Brand Name' },
    { name: 'tagline', type: 'string', title: 'Tagline' },

    // Contact Info (used across site)
    { name: 'phone', type: 'string', title: 'Phone Number' },
    { name: 'email', type: 'string', title: 'Email' },
    { name: 'address', type: 'object', fields: [
      { name: 'street', type: 'string' },
      { name: 'city', type: 'string' },
      { name: 'state', type: 'string' },
      { name: 'zip', type: 'string' },
    ]},

    // Booking Link
    { name: 'bookingUrl', type: 'url', title: 'External Booking URL' },

    // SEO Defaults
    { name: 'seo', type: 'object', fields: [
      { name: 'metaTitle', type: 'string' },
      { name: 'metaDescription', type: 'text' },
      { name: 'socialImage', type: 'image' },
    ]},
  ]
}
```

#### `homepageSettings.ts` - Homepage content
```typescript
{
  name: 'homepageSettings',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero Section
    { name: 'heroImage', type: 'image', title: 'Hero Background' },
    { name: 'heroHeadline', type: 'string', title: 'Headline' },
    { name: 'heroSubheadline', type: 'text', title: 'Subheadline' },
    { name: 'heroCta', type: 'string', title: 'CTA Button Text' },

    // Services Preview
    { name: 'servicesHeading', type: 'string' },
    { name: 'servicesDescription', type: 'text' },

    // CTA Section
    { name: 'ctaHeadline', type: 'string' },
    { name: 'ctaDescription', type: 'text' },
    { name: 'ctaButtonText', type: 'string' },
  ]
}
```

#### `aboutPage.ts` - About page content
```typescript
{
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    // Hero
    { name: 'eyebrow', type: 'string' },
    { name: 'headline', type: 'string' },
    { name: 'intro', type: 'text' },
    { name: 'heroImage', type: 'image' },

    // Quote
    { name: 'quoteText', type: 'text' },
    { name: 'quoteAttribution', type: 'string' },

    // Bio
    { name: 'bioTitle', type: 'string' },
    { name: 'credentials', type: 'array', of: [{ type: 'string' }] },
    { name: 'bioParagraphs', type: 'array', of: [{ type: 'text' }] },

    // Session Journey
    { name: 'journeyTitle', type: 'string' },
    { name: 'journeyIntro', type: 'text' },
    { name: 'journeySteps', type: 'array', of: [
      { type: 'object', fields: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'text' },
      ]}
    ]},

    // CTA
    { name: 'ctaHeadline', type: 'string' },
    { name: 'ctaButtonText', type: 'string' },
  ]
}
```

#### `policiesPage.ts` - Policies page content
```typescript
{
  name: 'policiesPage',
  title: 'Policies Page',
  type: 'document',
  fields: [
    { name: 'pageTitle', type: 'string' },
    { name: 'pageDescription', type: 'text' },
    { name: 'policies', type: 'array', of: [
      { type: 'object', fields: [
        { name: 'title', type: 'string' },
        { name: 'items', type: 'array', of: [{ type: 'text' }] },
      ]}
    ]},
  ]
}
```

#### `footerSettings.ts` - Footer content
```typescript
{
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  fields: [
    { name: 'brandDescription', type: 'text' },
    { name: 'therapistName', type: 'string' },
    // Links pull from siteSettings
  ]
}
```

### 4.2 Collection Documents (Multiple instances)

#### `service.ts` - Massage services
```typescript
{
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Service Name' },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'duration', type: 'string', title: 'Duration (e.g., "60 min")' },
    { name: 'price', type: 'string', title: 'Price (e.g., "$100")' },
    { name: 'description', type: 'text' },
    { name: 'featured', type: 'boolean', title: 'Show on Homepage' },
    { name: 'order', type: 'number', title: 'Display Order' },
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }
  ]
}
```

---

## 5. Sanity Client Setup

### `sanity/lib/client.ts`
```typescript
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})
```

### `sanity/lib/image.ts`
```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

### `sanity/lib/queries.ts`
```typescript
// Homepage
export const HOMEPAGE_SETTINGS_QUERY = `*[_type == "homepageSettings"][0]`

// Services
export const ALL_SERVICES_QUERY = `*[_type == "service"] | order(order asc)`
export const FEATURED_SERVICES_QUERY = `*[_type == "service" && featured == true] | order(order asc)`

// About
export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]`

// Policies
export const POLICIES_PAGE_QUERY = `*[_type == "policiesPage"][0]`

// Site Settings
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`

// Footer
export const FOOTER_SETTINGS_QUERY = `*[_type == "footerSettings"][0]`
```

---

## 6. Data Fetching Pattern

### Server Component Example (from Opal Creek)
```typescript
// app/page.tsx
import { client } from '@/sanity/lib/client'
import { HOMEPAGE_SETTINGS_QUERY, FEATURED_SERVICES_QUERY } from '@/sanity/lib/queries'

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    client.fetch(HOMEPAGE_SETTINGS_QUERY),
    client.fetch(FEATURED_SERVICES_QUERY),
  ])

  return (
    <>
      <Hero data={settings} />
      <ServicesPreview services={services} />
    </>
  )
}
```

---

## 7. Studio Integration

### Embedded Studio Route
```typescript
// app/studio/[[...tool]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

### Studio Configuration
```typescript
// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'
import { deskStructure } from './sanity/deskStructure'

export default defineConfig({
  name: 'kizmet',
  title: 'Kizmet Massage & Wellness',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [
    structureTool({ structure: deskStructure }),
  ],
  schema: { types: schemaTypes },
})
```

---

## 8. Migration Strategy

### Phase 1: Setup (Day 1)
1. Create Sanity project at sanity.io
2. Install dependencies
3. Create configuration files
4. Set up environment variables
5. Create embedded studio route

### Phase 2: Schema Development (Day 1-2)
1. Create all schema files
2. Deploy schemas to Sanity
3. Set up desk structure for singletons vs collections

### Phase 3: Content Migration (Day 2)
1. Enter all hardcoded content into Sanity Studio
2. Upload images to Sanity

### Phase 4: Frontend Integration (Day 2-3)
1. Create Sanity client and queries
2. Update page components to fetch from Sanity
3. Replace hardcoded content with Sanity data
4. Add image URL helper for Sanity images

### Phase 5: Testing & Polish (Day 3)
1. Test all pages with Sanity data
2. Verify image loading
3. Test content updates flow through
4. Optional: Add preview/draft mode

---

## 9. Current Content to Migrate

Based on current codebase analysis:

| Component | Content Type | Current Location |
|-----------|-------------|------------------|
| Hero | Homepage settings | `Hero.tsx` - hardcoded |
| About | About page | `About.tsx` - `aboutContent` object (already structured!) |
| Services | Service collection | `Services.tsx` - `allServices` array |
| Services Preview | Homepage settings | `ServicesPreview.tsx` - `services` array |
| Book | Contact/booking page | `Book.tsx` - `services` array |
| Policies | Policies page | `Policies.tsx` - `policies` array |
| CTA Section | Homepage settings | `CTASection.tsx` - hardcoded |
| Footer | Footer settings | `Footer.tsx` - hardcoded |
| Navigation | Site settings | `Navigation.tsx` - hardcoded |

**Good News:** The `About.tsx` component is already structured with content as a data object (`aboutContent`), which is the exact pattern needed for Sanity integration. This file shows the ideal migration approach.

---

## 10. Key Differences from Opal Creek

| Feature | Opal Creek | Kizmet (Recommended) |
|---------|-----------|---------------------|
| Blog | Yes (complex) | No (skip for now) |
| Case Studies | Yes | No |
| Team Members | Yes (multiple) | No (single therapist) |
| Testimonials | Yes | Optional (could add later) |
| Services | List with categories | Simple list |
| Visual Editing | Full implementation | Optional (simpler setup works) |
| Draft Mode | Yes | Optional |

**Recommendation:** Start with a minimal implementation (no visual editing, no draft mode) and add those features later if needed. Kizmet's content is much simpler than Opal Creek's.

---

## 11. Estimated Effort

| Task | Effort |
|------|--------|
| Sanity project setup | 30 min |
| Package installation | 10 min |
| Schema creation | 2-3 hours |
| Studio configuration | 1 hour |
| Content migration | 1-2 hours |
| Frontend integration | 3-4 hours |
| Testing | 1-2 hours |
| **Total** | **8-12 hours** |

---

## 12. Open Questions

1. **External Booking System:** Will Kizmet use an external booking system (Calendly, Square, etc.) or build custom booking? This affects whether the booking form stays as-is or just links out.

2. **Future Content:** Any plans for blog posts, testimonials, or other content types? Better to design schemas now.

3. **Preview Mode:** Is draft preview important? The owner could just publish and check the live site.

4. **Image Management:** Are there many images beyond the hero? Sanity's image CDN is powerful but adds complexity.

---

## 13. Conclusion

Sanity integration for Kizmet is straightforward given:
- Simple content structure (mostly singleton pages)
- No blog or complex content relationships
- Already has Sanity-ready patterns in `About.tsx`

The Opal Creek implementation provides a proven reference, but Kizmet can use a much simpler subset of those patterns. The key work is:
1. Creating schemas that match current content structure
2. Migrating hardcoded content to Sanity Studio
3. Updating components to fetch from Sanity instead of local data

This gives the business owner full control over content updates without developer involvement.
