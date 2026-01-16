# Plan: Sanity SEO & Google Metadata — Kizmet

**Date:** 2026-01-15
**Tags:** seo, sanity, metadata, structured-data, open-graph

## Objective

Add comprehensive SEO capabilities to Kizmet using Sanity CMS for content management, enabling:
- CMS-controlled meta titles, descriptions, and social images
- JSON-LD structured data for Google rich results
- Open Graph and Twitter Card metadata for social sharing

## Background

Currently, the site has static metadata defined at build time with no CMS control. This limits the ability to optimize for search engines and social sharing without code deployments. The DOA project has a proven implementation pattern we can adapt.

## Requirements

### Must Have
- [ ] Reusable SEO object type in Sanity (metaTitle, metaDescription, ogImage, noIndex)
- [ ] Site-level default SEO settings in siteSettings schema
- [ ] Page-level SEO overrides on all page schemas
- [ ] Dynamic `generateMetadata()` in all page routes
- [ ] JSON-LD structured data for LocalBusiness/HealthAndBeautyBusiness
- [ ] Open Graph and Twitter Card metadata
- [ ] Fallback pattern using GROQ `coalesce()`

### Nice to Have
- [ ] Business hours in structured data
- [ ] Geo coordinates for Google Maps integration
- [ ] Service-level structured data
- [ ] FAQ schema for policies page
- [ ] Automatic sitemap generation

## Approach

Four-phase implementation following patterns from the DOA project.

---

## Phase 1: Sanity Schema Updates

### Task 1.1: Create SEO Object Type
**File:** `src/sanity/schemaTypes/objects/seo.ts`

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
      description: 'Override the page title for search engines (50-60 characters)',
      validation: (Rule) => Rule.max(60).warning('May be truncated in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Description for search results (150-160 characters)',
      validation: (Rule) => Rule.max(160).warning('May be truncated in search results'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      options: { hotspot: true },
      description: '1200x630px recommended for optimal display',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
```

### Task 1.2: Update siteSettings Schema
**File:** `src/sanity/schemaTypes/siteSettings.ts`

Add two new fieldsets:

**SEO Fieldset:**
- `seo.siteUrl` (url) - Canonical site URL
- `seo.metaTitle` (string) - Default meta title
- `seo.metaDescription` (text) - Default meta description
- `seo.socialImage` (image) - Default OG image (1200x630)
- `seo.twitterHandle` (string) - Twitter/X handle
- `seo.instagramHandle` (string) - Instagram handle

**Business Info Fieldset:**
- `businessInfo.businessType` (string) - HealthAndBeautyBusiness/DaySpa/LocalBusiness
- `businessInfo.priceRange` (string) - $/$$/$$$
- `businessInfo.businessHours` (array) - Days, opens, closes
- `businessInfo.geoCoordinates` (object) - latitude, longitude
- `businessInfo.googleMapsUrl` (url)

### Task 1.3: Add SEO to Page Schemas
Add `seo` field to each page schema:

| Schema | File |
|--------|------|
| homepageSettings | `src/sanity/schemaTypes/homepageSettings.ts` |
| aboutPage | `src/sanity/schemaTypes/aboutPage.ts` |
| policiesPage | `src/sanity/schemaTypes/policiesPage.ts` |
| bookPage | `src/sanity/schemaTypes/bookPage.ts` |
| service | `src/sanity/schemaTypes/service.ts` |

```typescript
defineField({
  name: 'seo',
  title: 'SEO Settings',
  type: 'seo',
  description: 'Custom SEO (overrides site defaults)',
}),
```

### Task 1.4: Update Schema Index
**File:** `src/sanity/schemaTypes/index.ts`

- Create `objects/` directory
- Import and export `seo` object type

---

## Phase 2: Next.js Metadata Integration

### Task 2.1: Create Metadata Utility
**File:** `src/lib/metadata.ts`

Functions to implement:
- `getOgImageUrl(image)` - Generate 1200x630 OG image URL from Sanity
- `getSiteSettings()` - Fetch site settings for metadata
- `generateSiteMetadata()` - Root layout metadata from CMS
- `generatePageMetadata({ title, description, seo, path })` - Page-specific metadata with fallbacks

### Task 2.2: Create Structured Data Utility
**File:** `src/lib/structured-data.tsx`

Functions to implement:
- `generateLocalBusinessSchema(settings)` - HealthAndBeautyBusiness JSON-LD
- `generateWebSiteSchema(settings)` - WebSite JSON-LD
- `generateSiteSchemaGraph(settings)` - Combined @graph for root layout
- `generateServiceSchema(service, siteUrl)` - Service JSON-LD (for services page)
- `StructuredData` component - React component for script injection

### Task 2.3: Update Root Layout
**File:** `src/app/layout.tsx`

- Change `export const metadata` to `export async function generateMetadata()`
- Add `StructuredData` component to `<head>`
- Fetch site settings for schema generation

### Task 2.4: Update Page Routes
Update each page to use dynamic metadata:

| Page | File |
|------|------|
| Home | `src/app/page.tsx` |
| About | `src/app/about/page.tsx` |
| Services | `src/app/services/page.tsx` |
| Policies | `src/app/policies/page.tsx` |
| Book | `src/app/book/page.tsx` |

Each page adds:
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>(PAGE_QUERY)
  return generatePageMetadata({
    title: 'Page Title',
    description: data?.description,
    seo: data?.seo,
    path: '/page-path',
  })
}
```

### Task 2.5: Update GROQ Queries
**File:** `src/sanity/lib/queries.ts`

- Add SEO fields to `SITE_SETTINGS_QUERY`
- Add businessInfo fields to `SITE_SETTINGS_QUERY`
- Update all page queries with `coalesce()` fallbacks for SEO

---

## Phase 3: Content Entry (Sanity Studio)

### Task 3.1: Site Settings SEO
- Enter site URL (canonical)
- Enter default meta title
- Enter default meta description
- Upload default social share image (1200x630)
- Add social handles (Twitter, Instagram)

### Task 3.2: Business Information
- Select business type (HealthAndBeautyBusiness)
- Set price range ($$)
- Enter business hours
- Add geo coordinates (Port Angeles location)
- Add Google Maps URL

### Task 3.3: Page-Specific SEO (Optional)
- Review each page for custom SEO needs
- Add custom OG images where beneficial

---

## Phase 4: Testing & Validation

### Task 4.1: Structured Data Validation
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Validate with [Schema.org Validator](https://validator.schema.org/)
- [ ] Check for errors in Google Search Console

### Task 4.2: Social Sharing Validation
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Test with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Task 4.3: General SEO Audit
- [ ] Run Lighthouse SEO audit in Chrome DevTools
- [ ] Verify meta tags in browser dev tools (View Page Source)
- [ ] Check canonical URLs are correct
- [ ] Verify robots meta tags

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Schema migration breaks existing content | Low | Med | Test on preview dataset first |
| Missing fallbacks cause empty metadata | Med | High | Use GROQ coalesce() throughout |
| Large OG images slow page load | Low | Low | Use Sanity CDN with size params |
| Invalid JSON-LD causes Google errors | Med | Med | Validate with Rich Results Test |

## Success Criteria

- [ ] All pages have dynamic metadata from CMS
- [ ] Google Rich Results Test shows valid LocalBusiness schema
- [ ] Social sharing shows correct title, description, and image
- [ ] No SEO errors in Lighthouse audit
- [ ] Site settings editable in Sanity Studio without code deploy

## Open Questions

- Should we add FAQ schema to the policies page?
- Do we want automatic sitemap generation (next-sitemap)?
- Should services have individual OG images or use the default?

## Related Research

- [Research Document](../research/RESEARCH_2026-01-15_sanity-seo-metadata.md)
- [DOA Project Reference](/Users/michaelevans/DOA/)

## Files to Create/Modify

### New Files
| File | Description |
|------|-------------|
| `src/sanity/schemaTypes/objects/seo.ts` | Reusable SEO object type |
| `src/lib/metadata.ts` | Metadata utility functions |
| `src/lib/structured-data.tsx` | JSON-LD generators + component |

### Modified Files
| File | Changes |
|------|---------|
| `src/sanity/schemaTypes/siteSettings.ts` | Add SEO + businessInfo fieldsets |
| `src/sanity/schemaTypes/homepageSettings.ts` | Add seo field |
| `src/sanity/schemaTypes/aboutPage.ts` | Add seo field |
| `src/sanity/schemaTypes/policiesPage.ts` | Add seo field |
| `src/sanity/schemaTypes/bookPage.ts` | Add seo field |
| `src/sanity/schemaTypes/service.ts` | Add seo field |
| `src/sanity/schemaTypes/index.ts` | Export seo object type |
| `src/sanity/lib/queries.ts` | Add SEO fields to all queries |
| `src/app/layout.tsx` | Dynamic metadata + structured data |
| `src/app/page.tsx` | Add generateMetadata() |
| `src/app/about/page.tsx` | Add generateMetadata() |
| `src/app/services/page.tsx` | Add generateMetadata() |
| `src/app/policies/page.tsx` | Add generateMetadata() |
| `src/app/book/page.tsx` | Add generateMetadata() |
