# Services Section - Sanity CMS Audit

**Date:** January 20, 2026
**Status:** Well integrated - most content is editable

## Summary

The services section is well-integrated with Sanity CMS. All business content (service details, descriptions, techniques, tags) is fully editable through the CMS. Only structural UI elements are hardcoded.

---

## What's Editable in Sanity

### Service Document Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | String (required) | Service title (e.g., "60-Minute Session") |
| `slug` | Auto-generated | URL-friendly identifier |
| `duration` | String | Display duration (e.g., "60 min") |
| `price` | String | Display price (e.g., "$100") |
| `description` | Text | Main description paragraph |
| `extendedDescription` | Text | Optional second paragraph |
| `techniques` | Array of strings | Tags like "Trigger point therapy", "Deep tissue" |
| `bestFor` | Array of strings | Tags like "Desk workers with neck tension" |
| `featured` | Boolean | Shows on homepage when true |
| `order` | Number | Display order (lower = first) |
| `bookingUrl` | URL | Cal.com or booking link |
| `seo` | Object | Per-service SEO settings |

### Homepage Services Section

Found in `homepageSettings` document:
- `servicesHeading` - Section title on homepage
- `servicesDescription` - Section subtitle/description

---

## What's Hardcoded

### Services Page (`src/page-content/Services.tsx`)

- Section title: "Services & Pricing"
- Subsection title: "Massage Sessions"
- CTA section text: "Ready to Feel Your Best?"
- CTA button text: "Book Your Session"
- Icon choices (Clock, DollarSign)
- Fallback services data (if Sanity unavailable)

### Homepage Preview (`src/components/ServicesPreview.tsx`)

- "View all services" link text
- "Learn More" button text
- Limited to showing only 3 featured services

---

## File Locations

| Purpose | File |
|---------|------|
| Sanity schema | `src/sanity/schemaTypes/service.ts` |
| Sanity queries | `src/sanity/lib/queries.ts` |
| Services page | `src/app/services/page.tsx` |
| Services content | `src/page-content/Services.tsx` |
| Homepage preview | `src/components/ServicesPreview.tsx` |
| Homepage settings schema | `src/sanity/schemaTypes/homepageSettings.ts` |

---

## Sanity Queries

### `ALL_SERVICES_QUERY`
Used on `/services` page. Fetches all services sorted by `order` field.

### `FEATURED_SERVICES_QUERY`
Used on homepage. Fetches only services where `featured == true`, limited to 3.

---

## What Shows Where

### Full Services Page (`/services`)

Displays for each service:
- Name, duration, price
- Description + extended description
- Techniques tags
- Best For tags
- Book button (links to `bookingUrl`)

### Homepage Services Preview

Displays for featured services only:
- Name, duration, price
- Description only (no extended, no tags)
- Learn More button (links to `/services`)

---

## Recommendations

The following hardcoded text could be moved to Sanity for full CMS control:

1. **Services page section titles** - "Services & Pricing", "Massage Sessions"
2. **CTA section content** - "Ready to Feel Your Best?" heading and subtext
3. **Button labels** - "Book Your Session", "Learn More"

These are in `src/page-content/Services.tsx` lines 68-117.

---

## SEO Capabilities

Each service has its own SEO object with:
- `metaTitle` - Custom search engine title
- `metaDescription` - Custom meta description
- `ogImage` - Social share image
- `noIndex` - Hide from search engines

This allows individual service pages to have unique SEO if service detail pages are added later.
